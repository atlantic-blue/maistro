import Joi from "joi"
import AWS from 'aws-sdk';
import * as uuid from "uuid"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import { validatorJoi } from '../../middlewares/validator-joi';
import createError from '../../middlewares/error-handler';
import templatePrompt from "./templatePrompt"
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

interface AiThreadsMessage {
    timestamp: string
    content: {
        text: string
    }[]
    role: string
}

interface AiTemplatesCreateInput {
    messages: AiThreadsMessage[]
}

const client = new BedrockRuntimeClient();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const aiTemplatesCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const { messages } = event.body as unknown as AiTemplatesCreateInput;

    const data: AiThreadsMessage[] = [
        {
            timestamp: new Date().toISOString(),
            role: "system",
            content: [
                {
                    text: templatePrompt,
                }
            ]
        },
        ...messages,
    ]

    const prompt = data.reduce((prevPrompt, next) => {
        const nextPrompt = `\n\n${next.role}: \n
            ${next.content.map(section => `${section.text} \n`)}\n
            `
        return `${prevPrompt}\n${nextPrompt}`
    }, "").trim() + `\n\nassistant:`


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
        statusCode: 200,
        body: JSON.stringify(input)
    };
};

const validationSchema = Joi.object<AiTemplatesCreateInput>({
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
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(aiTemplatesCreate)

export { handler }
