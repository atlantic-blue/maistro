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
import sanitiseInput from "../../utils/sanitiseInput";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const productsUpdateById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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

    const productId = event.pathParameters && event.pathParameters['product-id']
    if (!productId) {
        throw createError(500, "productId not specified")
    }

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
    } = event.body as unknown as ProductsUpdateByIdInput;

    const input = sanitiseInput({
        name,
        description,
        price,
        priceDecimal,
        stockQuantity,
        currency,
        images,
        options,
        updatedAt: new Date().toISOString(),
        modifiers,
    })

    const params = createUpdateParams(
        input,
        {
            projectId,
            id: productId
        },
        tableName
    )

    await dynamoDb.update(params).promise()

    return {
        statusCode: 200,
        body: JSON.stringify(input)
    };
};

interface ProductsUpdateByIdInput {
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

const validationSchema = Joi.object<ProductsUpdateByIdInput>({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().optional(),
    priceDecimal: Joi.string().optional(),
    stockQuantity: Joi.number().optional(),
    currency: Joi.string().optional(),
    images: Joi.array().items(Joi.string()).optional(),
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
    .handler(productsUpdateById)

export { handler }
