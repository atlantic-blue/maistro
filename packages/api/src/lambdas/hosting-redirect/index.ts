import AWS from 'aws-sdk';
import { CloudFrontRequestHandler } from 'aws-lambda';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Assuming you have a way to map from the domain (user-url) to user-id and project-id
// This could be a database lookup or a configuration file; here we use a simple mapping
const userMapping: { [key: string]: { userId: string, projectId: string } } = {
    'test.hosting.maistro.website': { userId: '94080448-6071-707d-f507-e1dfd884d58f', projectId: '82adbd9c-d90c-491f-8ed7-2bb91e46afb1' }
};

const handler: CloudFrontRequestHandler = async (event) => {
    const request = event.Records[0].cf.request;
    const hostHeader = request.headers.host[0].value;
    const uri = request.uri;

    // Check if the host header is in the userMapping
    if (userMapping.hasOwnProperty(hostHeader)) {
        const { userId, projectId } = userMapping[hostHeader];
        // Rewrite the URI to include the userId and projectId
        request.uri = `/${userId}/${projectId}${uri}`;
    }

    console.log(event, request, request.uri)
    // Continue with the original request if no mapping exists
    return request;
};

export { handler }
