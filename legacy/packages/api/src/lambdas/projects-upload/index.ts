import { S3 } from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { isBase64 } from '../../utils/base64';
import { validatorJoi } from '../../middlewares/validator-joi';
import authJwt from '../../middlewares/auth-jwt';
import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import Joi from 'joi';
import createError from '../../middlewares/error-handler';
import { s3Path } from '../../utils/path';

const s3 = new S3();

interface ProjectsUploadInput {
    fileContent: string
    fileName: string
    fileType: string
    path: string
}

const projectsUpload: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const bucketName = process.env.BUCKET_NAME;
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

    const {
        fileType,
        fileName,
        fileContent,
        path
    } = event.body as unknown as ProjectsUploadInput;

    const key = s3Path({
        projectId,
        fileName,
        path,
    })

    let content: string | Buffer = fileContent
    const [useBase64, buffer] = isBase64(fileContent)
    if (useBase64 && buffer) {
        content = buffer
    }

    await s3.putObject({
        Bucket: bucketName,
        Key: key,
        Body: content,
        ContentType: fileType
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            key,
            message: 'File uploaded successfully',
        })
    };
}

const validationSchema = Joi.object<ProjectsUploadInput>({
    fileContent: Joi.string().required(),
    fileName: Joi.string().required(),
    fileType: Joi.string().required(),
    path: Joi.string().allow("").optional(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(projectsUpload)

export { handler }