import { S3 } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { isBase64 } from '../../utils/base64';

const s3 = new S3();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    try {
        const bucketName = process.env.BUCKET_NAME;
        if (!bucketName) {
            console.error('No S3 BUCKET', process.env.BUCKET_NAME);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'No S3 BUCKET' }),
            };
        }

        const body = event.body && JSON.parse(event.body);
        if (!body) {
            console.error('Empty request:', { event });
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Empty request' }),
            };
        }

        const {
            userId,
            projectId,
            fileContent,
            fileName,
            fileType,
        } = body;

        if (
            !userId ||
            !projectId ||
            !fileContent ||
            !fileName ||
            !fileType
        ) {
            console.log({ userId, projectId, fileContent, fileName, fileType })
            console.error('Invalid payload:', { event });
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Invalid payload' }),
            };
        }

        const key = `${userId}/${projectId}/assets/${fileName}`;

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
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            },
            statusCode: 200,
            body: JSON.stringify({
                message: 'File uploaded successfully',
                key
            }),
        };
    } catch (error) {
        console.error('Error uploading file:', { error, event });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to upload file' }),
        };
    }
};