import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

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

/**
 * Main handler for user service API (API Gateway v2)
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('User Service API event:', JSON.stringify(event, null, 2));

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS'
  };

  try {
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({})
      };
    }

    // Parse the route and method
    const method = event.httpMethod;
    const path = event.resource;

    console.log(`Processing ${method} ${path} (routeKey)`);
    // Route based on the routeKey pattern
    if (method === 'GET') {
      // GET /users/{userId}
      if (path === '/users/{userId}') {
        return {
            statusCode: 200,
            body: JSON.stringify({response: "OK"})
        }
      }

      // GET /users/{userId}/profile
      if (path === '/users/{userId}/profile') {
        return {
            statusCode: 200,
            body: JSON.stringify({response: "OK"})
        }
      }

      // GET /users
      if (path === '/users') {
        return {
            statusCode: 200,
            body: JSON.stringify({response: "OK"})
        }
      }
    } else if (method === 'PUT') {
      // PUT /users/{userId}
      if (path === '/users/{userId}') {
       return {
            statusCode: 200,
            body: JSON.stringify({response: "OK"})
        }
      }

      // PUT /users/{userId}/profile
      if (path === '/users/{userId}/profile') {
        return {
            statusCode: 200,
            body: JSON.stringify({response: "OK"})
        }
      }
    }

    // If no route matches
    return createErrorResponse(404, 'Route not found', corsHeaders);

  } catch (error) {
    console.error('Error processing request:', error);
    return createErrorResponse(500, 'Internal server error', corsHeaders);
  }
};
