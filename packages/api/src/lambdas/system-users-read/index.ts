import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import AWS, { CognitoIdentityServiceProvider } from 'aws-sdk';
import createError from '../../middlewares/error-handler';
import { LambdaMiddlewares } from '../../middlewares';
import authJwt from '../../middlewares/auth-jwt';
import jwt from "jsonwebtoken"

const cognito = new AWS.CognitoIdentityServiceProvider()

interface UsersReadInput {
    limit: number
    page: string
    search: string
}

const usersRead: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const userPoolId = process.env.USERS_POOL_ID;
    if (!userPoolId) {
        throw createError(500, "process USERS_POOL_ID not specified")
    }

    const userPoolSystemGroup = process.env.USERS_POOL_SYSTEM_GROUP;
    if (!userPoolSystemGroup) {
        throw createError(500, "process USERS_POOL_SYSTEM_GROUP not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const groups = payload["cognito:groups"] as string[]
    const isAdmin = groups.includes(userPoolSystemGroup)
    if (!isAdmin) {
        throw createError(500, `${payload.sub} | user is not Admin`)
    }
   
    const { limit, page, search } = event.queryStringParameters as unknown as UsersReadInput;

    const params: CognitoIdentityServiceProvider.ListUsersRequest = {
        UserPoolId: userPoolId,
        Limit: limit || 25,
        PaginationToken: page || void 0,
    };

    if (search) {
        params.Filter = `name^="${search}"`
    }

    const response = await cognito.listUsers(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            users: response.Users,
            page: response.PaginationToken, // Return the token for the next page
        }),
    };

}

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .handler(usersRead)

export { handler }
