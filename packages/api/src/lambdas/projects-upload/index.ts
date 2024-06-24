import Joi from 'joi';
import { S3 } from 'aws-sdk';

import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';
import jsonBodyParser from '../../middlewares/json-body-parser';
import { validatorJoi } from '../../middlewares/validator-joi';


interface UploadMultipartInput {
    fileName: string
}

const s3 = new S3();
const bucketName = process.env.BUCKET_NAME;

const uploadMultipart: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    if (!bucketName) {
        console.error('No S3 BUCKET', process.env.BUCKET_NAME);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'No S3 BUCKET' }),
        };
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

    const { fileName } = event.body as unknown as UploadMultipartInput;

    const key = `${userId}/${projectId}/assets/${fileName}`;

    const params = {
        Bucket: bucketName,
        Key: key,
        Expires: 60 * 15, // URL valid for 15 minutes
    };

    const url = s3.getSignedUrl('putObject', params);
    return {
        statusCode: 200,
        body: JSON.stringify({ url }),
    };
};

const validationSchema = Joi.object<UploadMultipartInput>({
    fileName: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(uploadMultipart)

export { handler }
