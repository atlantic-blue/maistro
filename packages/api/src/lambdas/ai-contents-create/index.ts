import Joi from "joi"
import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import * as uuid from "uuid"
import {
    APIGatewayProxyEvent,
    APIGatewayProxyHandler
} from 'aws-lambda';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import { validatorJoi } from '../../middlewares/validator-joi';
import createError from '../../middlewares/error-handler';
import authJwt from "../../middlewares/auth-jwt";

interface AiContentsCreateInput {
    data: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const client = new BedrockRuntimeClient();

const MAX_INPUT_TOKENS = 100000; // 100 thousand per month
const MAX_OUTPUT_TOKENS = 100000; // 100 thousand per month

// TODO: count tokens even if the lambda fails
const AiContentsCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const userId = payload.sub
    if (!userId) {
        throw createError(500, "userId not specified")
    }

    const projectId = event.pathParameters && event.pathParameters['project-id']
    if (!projectId) {
        throw createError(500, "projectId not specified")
    }

    const { data } = event.body as unknown as AiContentsCreateInput;

    // Get Current token counts
    const date = new Date();
    date.setDate(1); // Set to the first of the month
    date.setHours(0, 0, 0, 0); // Start of the day
    const monthStart = date.toISOString();
    const now = new Date().toISOString();

    const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: 'userId = :userId AND createdAt BETWEEN :monthStart AND :now',
        ExpressionAttributeValues: {
            ':userId': userId,
            ':monthStart': monthStart,
            ':now': now
        }
    };

    const aiContents = await dynamoDb.query(queryParams).promise();
    let totalInputTokens = 0
    let totalOutputTokens = 0

    // TODO monitor this query to see if it performs well. how many times does a user create content per month?
    aiContents?.Items?.forEach(item => {
        totalInputTokens += item.inputTokens;
        totalOutputTokens += item.outputTokens;
    });

    if (
        (totalInputTokens + data.split(" ").length) > MAX_INPUT_TOKENS ||
        totalOutputTokens > MAX_OUTPUT_TOKENS
    ) return {
        statusCode: 403,
        body: JSON.stringify({ error: "Token limit exceeded for the month" })
    }


    // Call Bedrock
    // https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-titan-text.html
    // const modelId = "amazon.titan-text-express-v1"
    const modelId = "amazon.titan-text-premier-v1:0"
    const temperature = 0.7
    const topP = 0.9
    const maxTokenCount = 1024

    const command = new InvokeModelCommand({
        contentType: "application/json",
        accept: "application/json",
        modelId,
        trace: "ENABLED",
        body: JSON.stringify({
            inputText: data,
            textGenerationConfig: {
                maxTokenCount,
                stopSequences: [],
                temperature,
                topP,
            }
        })
    })

    interface ClientResponse {
        inputTextTokenCount: number
        results: {
            tokenCount: number,
            outputText: string,
            completionReason: "FINISH"
        }[]
    }

    const response = await client.send(command);
    const jsonString = Buffer.from(response.body).toString('utf8');

    const parsedData: ClientResponse = JSON.parse(jsonString);
    const outputData = parsedData?.results[0];

    // Update table content
    const id = uuid.v4()
    const putParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: tableName,
        Item: {
            id,
            userId,
            projectId,
            createdAt: now,
            inputContent: data,
            outputContent: outputData?.outputText,
            inputTokens: parsedData.inputTextTokenCount,
            outputTokens: outputData?.tokenCount,
        }
    };

    await dynamoDb.put(putParams).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            output: outputData?.outputText,
            inputTokens: totalInputTokens + parsedData.inputTextTokenCount,
            outputTokens: totalOutputTokens + outputData?.tokenCount
        })
    };
}

const validationSchema = Joi.object<AiContentsCreateInput>({
    data: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(AiContentsCreate)

export { handler }
