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
import { isBase64 } from "../../utils/base64";

interface AiImagesCreateInput {
    data: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const client = new BedrockRuntimeClient({ region: 'us-east-1' });
const s3 = new AWS.S3();

const MAX_IMAGES = 40; // 40 images per month

// TODO count images even if lambda fails
const AiImagesCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const bucketName = process.env.BUCKET_NAME
    if (!bucketName) {
        throw createError(500, "process BUCKET_NAME not specified")
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

    const { data } = event.body as unknown as AiImagesCreateInput;
    if (!projectId) {
        throw createError(500, "data prompt not specified")
    }

    // Get Current image counts
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
    const totalImages = (aiContent?.Items?.length || 0) + 1

    if (totalImages > MAX_IMAGES) return {
        statusCode: 403,
        body: JSON.stringify({ error: "Images limit exceeded for the month" })
    }


    // Call Bedrock
    const modelId = "amazon.titan-image-generator-v1"

    const command = new InvokeModelCommand({
        contentType: "application/json",
        accept: "application/json",
        modelId,
        body: JSON.stringify({
            textToImageParams: {
                text: data
            },
            taskType: "TEXT_IMAGE",
            imageGenerationConfig: {
                cfgScale: 8,
                seed: 0,
                quality: "premium",
                width: 1024,
                height: 1024,
                numberOfImages: 1
            }
        })
    })

    interface ClientResponse {
        images: string[]
        error: unknown
    }

    const response = await client.send(command);
    const textDecoder = new TextDecoder('utf-8');
    const jsonString = textDecoder.decode(response.body.buffer);
    const parsedData: ClientResponse = JSON.parse(jsonString);
    const image = parsedData?.images[0];

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
        }
    };

    await dynamoDb.put(putParams).promise();

    let content: string | Buffer = image
    const [useBase64, buffer] = isBase64(image)
    if (useBase64 && buffer) {
        content = buffer
    }

    // TODO we are assuming that all ContentType is "image/png"
    const key = `${userId}/${projectId}/assets/ai-images/${id}.png`;
    await s3.putObject({
        Bucket: bucketName,
        Key: key,
        Body: content,
        ContentType: "image/png"
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            src: key,
            totalImages,
        })
    };
}

const validationSchema = Joi.object<AiImagesCreateInput>({
    data: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(AiImagesCreate)

export { handler }
