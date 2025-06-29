import { APIGatewayProxyHandler } from 'aws-lambda';
import { createErrorResponse } from '../../utils/createError';
import { getUserById } from './getUserById';
import { getUserProfile } from './getUserProfile';
import { updateUser } from './updateUser';

enum Routes {
    users = '/users',
    userById = '/users/{userId}',
    userProfile = '/users/{userId}/profile'
}

/**
 * Main handler for user service API
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
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({})
      };
    }

    const method = event.httpMethod;
    const path = event.resource;

    if (method === 'GET') {
      if (path === Routes.userById) {
        return await getUserById(event)
      }

      if (path === Routes.userProfile) {
        return await getUserProfile(event)
      }

      if (path === Routes.users) {
        return {
            statusCode: 200,
            body: JSON.stringify({response: "OK"})
        }
      }
    } else if (method === 'PUT') {
      if (path === Routes.userById) {
       return await updateUser(event)
      }

      if (path === Routes.userProfile) {
        return {
            statusCode: 200,
            body: JSON.stringify({response: "OK"})
        }
      }
    }

    return createErrorResponse(404, 'Route not found', corsHeaders);

  } catch (error) {
    console.error('Error processing request:', error);
    return createErrorResponse(500, 'Internal server error', corsHeaders);
  }
};
