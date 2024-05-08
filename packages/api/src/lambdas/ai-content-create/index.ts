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

interface AiContentCreateInput {
    data: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const client = new BedrockRuntimeClient({ region: 'us-east-1' });

const MAX_INPUT_TOKENS = 100000; // 100 thousand per month
const MAX_OUTPUT_TOKENS = 100000; // 100 thousand per month

const AiContentCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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

    const { data } = event.body as unknown as AiContentCreateInput;

    // Get Current token counts
    console.log("Get Current token counts")

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

    const aiContent = await dynamoDb.query(queryParams).promise();
    let totalInputTokens = 0
    let totalOutputTokens = 0

    // TODO monitor this query to see if it performs well. how many times does a user create content per month?
    aiContent?.Items?.forEach(item => {
        totalInputTokens += item.inputTokens;
        totalOutputTokens += item.outputTokens;
    });

    if (
        (totalInputTokens + data.length) > MAX_INPUT_TOKENS ||
        totalOutputTokens > MAX_OUTPUT_TOKENS
    ) return {
        statusCode: 403,
        body: JSON.stringify({ error: "Token limit exceeded for the month" })
    }


    // Call Bedrock
    console.log("Call Bedrock")

    const modelId = "amazon.titan-text-express-v1"
    const temperature = 0.9
    const maxTokenCount = 5000

    const command = new InvokeModelCommand({
        contentType: "application/json",
        accept: "application/json",
        modelId,
        body: JSON.stringify({
            inputText: data,
            textGenerationConfig: {
                maxTokenCount,
                stopSequences: [],
                temperature,
                topP: 0.1
            }
        })
    })

    const response = await client.send(command);
    const jsonString = Buffer.from(response.body).toString('utf8');
    console.log({ jsonString })
    const parsedData = JSON.parse(jsonString);
    console.log({ parsedData })
    const outputData = parsedData?.results[0]?.outputText;
    console.log({ outputData })

    // Update table content
    console.log("Update table content")
    const id = uuid.v4()
    const putParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: tableName,
        Item: {
            id,
            userId,
            projectId,
            createdAt: now,
            inputContent: data,
            outputContent: outputData,
            inputTokens: data.length,
            outputTokens: outputData.length,
        }
    };

    await dynamoDb.put(putParams).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            output: outputData,
            inputTokens: totalInputTokens + data.length,
            outputTokens: totalOutputTokens + outputData.length
        })
    };
}

const validationSchema = Joi.object<AiContentCreateInput>({
    data: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(AiContentCreate)

export { handler }
