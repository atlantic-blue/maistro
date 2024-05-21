import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';

import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';
import jsonBodyParser from '../../middlewares/json-body-parser';

const images: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const accessKey = process.env.IMAGES_ACCESS_KEY
    if (!accessKey) {
        throw createError(500, "process IMAGES_ACCESS_KEY not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const userId = payload.sub
    if (!userId) {
        throw createError(500, "userId not specified")
    }

    const page = event.queryStringParameters && event.queryStringParameters['page']
    if (page && Number(page) === Number.NaN) {
        throw createError(500, "page query must be a number")
    }

    const perPage = event.queryStringParameters && event.queryStringParameters['perPage']
    if (perPage && Number(perPage) === Number.NaN) {
        throw createError(500, "perPage query must be a number")
    }

    const query = event.queryStringParameters && event.queryStringParameters['query']
    if (!query) {
        throw createError(500, "must have a query")
    }

    const unsplash = createApi({
        accessKey,
        fetch: nodeFetch,
    });
    // https://unsplash.com/documentation#search-collections
    // https://github.com/unsplash/unsplash-js?tab=readme-ov-file#searchgetcollectionsarguments-additionalfetchoptions
    const { response, errors } = await unsplash.search.getPhotos({
        query,
        page: Number(page) || 1,
        perPage: Number(page) || 10,
    });

    if (errors || !response) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                results: []
            })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            total: response.total,
            totalPages: response.total_pages,
            results: response.results,
        })
    };
};

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .handler(images)

export { handler }
