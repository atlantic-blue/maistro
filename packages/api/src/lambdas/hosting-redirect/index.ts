import AWS from 'aws-sdk';
import { CloudFrontRequestHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';

/**
    TODO remove or write about this HACK!
    lambda at edge doesn't allow env variables,
    we then transpile the env value at build time
    tf: TABLE_NAME = aws_dynamodb_table.projects.name
    in the lambda : const tableName = '${TABLE_NAME}'
 */
const tableName = '${TABLE_NAME}'
AWS.config.update({ region: '${TABLE_REGION}' });

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const hostingRedirect: CloudFrontRequestHandler = async (event) => {
    const request = event.Records[0].cf.request;
    const hostHeader = request.headers.host[0].value;
    console.log(JSON.stringify({ request }))

    if (!tableName) {
        console.log("process TABLE_NAME not specified")
        return request;
    }

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        IndexName: "UrlIndex",
        KeyConditionExpression: "#url = :urlValue",
        ExpressionAttributeNames: {
            "#url": "url"
        },
        ExpressionAttributeValues: {
            ":urlValue": hostHeader // e.g test.maistro.live
        }
    };

    const data = await dynamoDb.query(params).promise();

    if (!data.Items || data.Items.length === 0) {
        // Continue with the original request if no mapping exists
        console.log("URL NOT FOUND", { hostHeader })
        return request;
    }

    if (data.Items.length > 1) {
        /**
         * Multiple Urls associated with a project
         * TODO:
         * - flag and resolve biz error
         */
        console.log("There are multiple Urls associated with a project", { hostHeader })
        return request
    }

    const { userId, id } = data.Items[0];
    if (!userId) {
        console.log("userId not found", JSON.stringify(data))
        return request
    }

    if (!id) {
        console.log("project id not found", JSON.stringify(data))
        return request
    }

    /**
     * CUSTOM ROUTING
     * 1. redirect root to index.html
     * 2. redirect home to index.html
     * 3. redirect routes without an extension to {route}.html
     *      e.g about => about.html
     */
    let path = request.uri
    if (path === "/") {
        path = "/index.html"
    }

    if (!/\.\w+$/.test(path)) {
        path += '.html';
    }

    const uri = `/${userId}/${id}${path}`
    request.uri = uri;
    return request;
};

const handler = new LambdaMiddlewares()
    .handler(hostingRedirect)

export { handler }
