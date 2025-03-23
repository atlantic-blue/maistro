import Joi from "joi"
import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import * as uuid from "uuid"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import { validatorJoi } from '../../middlewares/validator-joi';
import createError from '../../middlewares/error-handler';
import authJwt from "../../middlewares/auth-jwt";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const projectsCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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

    const id = uuid.v4()
    const createdAt = new Date().toISOString()
    const {
        name,
        description,
        price,
        priceDecimal,
        stockQuantity,
        currency,
        images,
        options,
        modifiers,
    } = event.body as unknown as ProductsCreateInput;

    const params = {
        TableName: tableName,
        Item: {
            id,
            projectId,

            name,
            description,
            price,
            priceDecimal,
            stockQuantity,
            currency,
            images,
            options,
            createdAt,
            modifiers,
        }
    };

    await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            id,
            name,
            description,
            price,
            priceDecimal,
            stockQuantity,
            currency,
            images,
            options,
            createdAt,
            modifiers,
        })
    };
};


interface ProductsCreateInput {
    name: string
    description: string
    price: number
    priceDecimal: string
    stockQuantity: number
    currency: string
    images: string[]
    options: Record<string, string[]>
    modifiers: Array<{
        id: string
        name: string
        description: string
        price: number
        imgSrc: string
    }>
}

const validationSchema = Joi.object<ProductsCreateInput>({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    priceDecimal: Joi.string().optional(),
    stockQuantity: Joi.number().required(),
    currency: Joi.string().required(),
    images: Joi.array().items(Joi.string()).required(),
    options: Joi.object().optional(),
    modifiers: Joi.array().items(
        Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required(),
            imgSrc: Joi.string().required(),
        })
    ).required()
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(projectsCreate)

export { handler }
