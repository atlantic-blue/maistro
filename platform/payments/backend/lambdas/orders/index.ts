import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

/**
 * Main handler for payment orders service API
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Payment Orders Service API event:', JSON.stringify(event, null, 2));

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS'
  };

  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({})
      };
    }

    const method = event.httpMethod;
    const path = event.resource;

    return {
        statusCode: 200,
        body: JSON.stringify({})
      };
  } catch (error) {
    console.error('Error processing request:', JSON.stringify(error));
    return createErrorResponse(500, 'Internal server error', corsHeaders);
  }
};

function createErrorResponse(statusCode: number, message: string, headers?: any): APIGatewayProxyResult {
  return {
    statusCode,
    headers: headers || {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ error: message })
  };
}