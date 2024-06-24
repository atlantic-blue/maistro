import Joi from "joi"
import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";
import createUpdateParams from "../../utils/createUpdateParams";
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

interface AiThreadsMessage {
    timestamp: string
    content: {
        text: string
    }[]
    role: string
}

interface AiThreadsUpdateByIdInput {
    messages: AiThreadsMessage[]
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const client = new BedrockRuntimeClient();

const MAX_INPUT_TOKENS = 500000; // 500 thousand per month
const MAX_OUTPUT_TOKENS = 500000; // 500 thousand per month

// TODO: count tokens even if the lambda fails
const aiThreadsUpdateById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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

    const threadId = event.pathParameters && event.pathParameters['thread-id']
    if (!threadId || threadId === 'undefined') {
        throw createError(500, "threadId not specified")
    }

    // 1. Check monthly token usage for userId
    const date = new Date();
    date.setDate(1); // Set to the first of the month
    date.setHours(0, 0, 0, 0); // Start of the day
    const monthStart = date.toISOString();
    const now = new Date().toISOString();

    const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        IndexName: "UserIdUpdatedAtIndex",
        KeyConditionExpression: 'userId = :userId AND updatedAt BETWEEN :monthStart AND :now',
        ExpressionAttributeValues: {
            ':userId': userId,
            ':monthStart': monthStart,
            ':now': now
        }
    };

    const aiContents = await dynamoDb.query(queryParams).promise();
    if (!aiContents.Items) return {
        statusCode: 404,
        body: JSON.stringify({ error: "No threads were found" })
    }

    let totalInputTokens = 0
    let totalOutputTokens = 0

    // TODO monitor this query to see if it performs well. how many times does a user create content per month?
    aiContents?.Items?.forEach(item => {
        totalInputTokens += (item.inputTokens || 0);
        totalOutputTokens += (item.outputTokens || 0);
    });

    if (
        totalInputTokens > MAX_INPUT_TOKENS ||
        totalOutputTokens > MAX_OUTPUT_TOKENS
    ) return {
        statusCode: 403,
        body: JSON.stringify({
            error: "Token limit exceeded for the month",
            totalInputTokens,
            totalOutputTokens,
        })
    }

    // 2. Generate Prompt
    const thread = aiContents.Items.find(item => item.id === threadId)
    if (!thread) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: `thread ${threadId} not found` })
        }
    }

    const { messages } = event.body as unknown as AiThreadsUpdateByIdInput;
    const prevMessages: AiThreadsMessage[] = thread.messages
    const inputMessages: AiThreadsMessage[] = [
        ...prevMessages,
        ...messages
    ]

    // Context aware truncated message, helps with token management 
    const statelessQuery = event.queryStringParameters && event.queryStringParameters['stateless']
    const isChatStateless = statelessQuery && statelessQuery === "true"
    const truncatedMessage: AiThreadsMessage[] = [
        ...(isChatStateless ? [] : [
            prevMessages[0],
            ...prevMessages.slice(-1)
        ]),
        ...messages
    ]

    const prompt = truncatedMessage.reduce((prevPrompt, next) => {
        const nextPrompt = `\n\n${next.role}: \n
            ${next.content.map(section => `${section.text} \n`)}\n
            `
        return `${prevPrompt}\n${nextPrompt}`
    }, "").trim() + `\n\nassistant:`

    // 3. Call Bedrock
    // https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-titan-text.html
    // const modelId = "amazon.titan-text-premier-v1:0"
    // const modelId = "amazon.titan-text-express-v1"
    // https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-meta.html
    // https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html
    const modelId = "meta.llama3-8b-instruct-v1:0"

    const maxTokenCount = 250
    const temperature = 0.7
    const topP = 0.9


    const command = new InvokeModelCommand({
        contentType: "application/json",
        accept: "application/json",
        modelId,
        trace: "ENABLED",
        body: JSON.stringify({
            prompt: prompt,
            max_gen_len: maxTokenCount,
            temperature,
            top_p: topP,
        })
    })

    interface ClientResponse {
        generation: string,
        prompt_token_count: number,
        generation_token_count: number,
        stop_reason: string
    }

    const response = await client.send(command);
    const jsonString = Buffer.from(response.body).toString('utf8');
    const parsedData: ClientResponse = JSON.parse(jsonString);
    // Update table content
    const aiMessageResponse: AiThreadsMessage = {
        role: "assistant",
        timestamp: new Date().toUTCString(),
        content: [
            {
                text: parsedData?.generation
            }
        ]
    }


    const inputTokens = (totalInputTokens || 0) + (parsedData?.prompt_token_count || 0)
    const outputTokens = (totalOutputTokens || 0) + (parsedData?.generation_token_count || 0)

    const params = createUpdateParams(
        {
            updatedAt: now,
            messages: [...inputMessages, aiMessageResponse],
            inputTokens,
            outputTokens,
        },
        {
            userId,
            createdAt: thread.createdAt,
        },
        tableName
    )

    await dynamoDb.update(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: aiMessageResponse,
            inputTokens,
            outputTokens,
        })
    };
};


const validationSchema = Joi.object<AiThreadsUpdateByIdInput>({
    name: Joi.string().optional(),
    messages: Joi.array().items(
        Joi.object({
            content: Joi.array().items(
                Joi.object({
                    text: Joi.string().required()
                }).required()
            ).required(),
            role: Joi.string().required(),
            timestamp: Joi.date().required()
        }).required()
    ).required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(aiThreadsUpdateById)

export { handler }
