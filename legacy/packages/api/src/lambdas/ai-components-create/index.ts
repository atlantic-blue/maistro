import Joi from "joi"
import {
    APIGatewayProxyEvent,
    APIGatewayProxyHandler,
    LambdaFunctionURLEvent
} from 'aws-lambda';
import AWS from 'aws-sdk';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import * as uuid from "uuid"

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import { validatorJoi } from '../../middlewares/validator-joi';
import cors from "../../middlewares/cors";

interface AiThreadsMessage {
    timestamp: string
    content: {
        text: string
    }[]
    role: string
}

interface AiThreadsUpdateByIdInput {
    name: string
    messages: AiThreadsMessage[]
}

const client = new BedrockRuntimeClient();
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME

const AiComponentsCreate = async (event: LambdaFunctionURLEvent) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',  // Allow all origins
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',  // Allowed methods
        'Access-Control-Allow-Headers': 'Content-Type',  // Allowed headers
    };

    // Determine the HTTP method
    const httpMethod = event.requestContext.http.method;

    if (httpMethod === 'OPTIONS') {
        // Handle pre-flight request for CORS
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify('CORS preflight response'),
        };
    }

    // Parse the event body
    let parsedBody: any;
    try {
        parsedBody = JSON.parse(event.body || '{}');
    } catch (error) {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message: 'Invalid JSON' }),
        };
    }

    if (!tableName) {
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: "process TABLE_NAME not specified" }),
        };
    }

    // // Your main logic here
    // const responseBody = {
    //     message: 'Hello from your Lambda function!',
    //     input: parsedBody,
    // };

    // return {
    //     statusCode: 200,
    //     headers: headers,
    //     body: JSON.stringify(responseBody),
    // };

    // const body = event.body && JSON.parse(event.body);
    const { messages } = parsedBody as unknown as AiThreadsUpdateByIdInput;
    const data: AiThreadsMessage[] = [
        // {
        //     timestamp: new Date().toISOString(),
        //     role: "system",
        //     content: [
        //         {
        //             text: componentsPrompt,
        //         }
        //     ]
        // },
        ...messages
    ]

    const prompt = data.reduce((prevPrompt, next) => {
        const nextPrompt = `\n\n${next.role}: \n
            ${next.content.map(section => `${section.text} \n`)}\n
            `
        return `${prevPrompt}\n${nextPrompt}`
    }, "").trim() + `\n\nassistant:`

    // Call Bedrock
    // https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-meta.html
    // https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html
    const modelId = "meta.llama3-70b-instruct-v1:0"
    const maxTokenCount = 2000
    const temperature = 0.1
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

    const aiMessageResponse: AiThreadsMessage = {
        role: "assistant",
        timestamp: new Date().toUTCString(),
        content: [
            {
                text: parsedData?.generation
            }
        ]
    }

    const id = uuid.v4()
    const createdAt = new Date().toISOString()

    const input = {
        id,
        createdAt,
        prompt: messages,
        data: aiMessageResponse
    }

    const params = {
        Item: input,
        TableName: tableName,
    };

    await dynamoDb.put(params).promise();

    return {
        headers: headers,
        statusCode: 200,
        body: JSON.stringify(input)
    };
}

const validationSchema = Joi.object<AiThreadsUpdateByIdInput>({
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

const handler = AiComponentsCreate
// const handler = new LambdaMiddlewares()
//     // .before(cors)
//     // .before(jsonBodyParser)
//     // .before(validatorJoi(validationSchema))
//     .handler(AiComponentsCreate)

export { handler }
