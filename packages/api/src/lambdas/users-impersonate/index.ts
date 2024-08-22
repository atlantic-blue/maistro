import AWS, { CognitoIdentityServiceProvider } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import createError from '../../middlewares/error-handler';
import { LambdaMiddlewares } from '../../middlewares';
import authJwt from '../../middlewares/auth-jwt';
import jwt from "jsonwebtoken"

const cognito = new AWS.CognitoIdentityServiceProvider()

interface UsersImpersonateInput {
    googleIdToken: string
}

// admin impersonates a google user
// https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html#CognitoUserPools-InitiateAuth-request-AuthParameters
const usersImpersonate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const userPoolId = process.env.USERS_POOL_ID;
    if (!userPoolId) {
        throw createError(500, "process USERS_POOL_ID not specified")
    }

    const userClientId = process.env.USERS_CLIENT_ID;
    if (!userClientId) {
        throw createError(500, "process USERS_CLIENT_ID not specified")
    }

    const userClientSecret = process.env.USERS_CLIENT_SECRET;
    if (!userClientSecret) {
        throw createError(500, "process USERS_CLIENT_SECRET not specified")
    }

    const userPoolAdminGroup = process.env.USERS_POOL_ADMIN_GROUP;
    if (!userPoolAdminGroup) {
        throw createError(500, "process USERS_POOL_ADMIN_GROUP not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const groups = payload["cognito:groups"] as string[]
    const isAdmin = groups.includes(userPoolAdminGroup)
    if (!isAdmin) {
        throw createError(500, `${payload.sub} | user is not Admin`)
    }

    const { googleIdToken } = event.queryStringParameters as unknown as UsersImpersonateInput;
    if (!googleIdToken) {
        throw createError(500, "googleIdToken not specified")
    }

    const params: CognitoIdentityServiceProvider.Types.InitiateAuthRequest = {
        AuthFlow: 'USER_SRP_AUTH',
        ClientId: userClientId,

        AuthParameters: {
            'IDENTITY_PROVIDER': 'Google',
            'TOKEN': googleIdToken,
            'SECRET_HASH': userClientSecret,

        }
    };

    const response = await cognito.initiateAuth(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            idToken: response?.AuthenticationResult?.IdToken,
            accessToken: response?.AuthenticationResult?.AccessToken,
            refreshToken: response?.AuthenticationResult?.RefreshToken,
        }),
    };

}

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .handler(usersImpersonate)

export { handler }
