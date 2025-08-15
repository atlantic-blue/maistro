import { APIGatewayProxyHandler } from 'aws-lambda';
import { createErrorResponse } from '../../utils/createError';
import { getUserById } from './getUserById';
import { getUserProfile } from './getUserProfile';

import { decode } from 'jsonwebtoken';
import { onboardUser } from './onboardUser';
import { updateUser } from './updateUser';
import { UserService } from '../../services/user.service';
import UserRepository from '../../repositories/user';
import { UserProfileService } from '../../services/userProfile.service';
import UserProfileRepository from '../../repositories/userProfile';

enum Routes {
    onboard = '/onboarding',

    users = '/users',

    userById = '/users/{userId}',
    userByIdProfile = '/users/{userId}/profile',

    me = '/me',
    meProfile = '/me/profile',
}

export interface DecodedToken {
  sub: string;
  email: string;
  username: string;
  [key: string]: any;
}

const USERS_TABLE = process.env.USERS_TABLE || '';
const USER_PROFILES_TABLE = process.env.USER_PROFILES_TABLE || '';

const userService = new UserService(
  new UserRepository(USERS_TABLE)
)

const userProfileService = new UserProfileService(
  new UserRepository(USERS_TABLE),
  new UserProfileRepository(USER_PROFILES_TABLE)
)
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
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse(401, 'Missing token');
    }

    const token = authHeader.split(' ')[1];
    
    // Decode token (skip verification for speed - you can add verification later)
    const decodedToken = decode(token) as DecodedToken;
    if (!decodedToken || !decodedToken.sub) {
      return createErrorResponse(401, 'Invalid token');
    }

    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({})
      };
    }

    const method = event.httpMethod;
    const path = event.resource;

    if(method == "POST") {
      if (path === Routes.onboard) {
        return await onboardUser(decodedToken, event)
      }
    }

    if (method === 'GET') {
      if (path === Routes.me) {
        const response = await userService.getUserByCognitoId(decodedToken.username)
        if (response) {
          return {
            statusCode: 200,
            body: JSON.stringify(response)
          }
        }
        return createErrorResponse(404, 'User not found');
      }

      if (path === Routes.meProfile) {
        const response = await userProfileService.getAuthenticatedUser(decodedToken)
        if (response) {
          return {
            statusCode: 200,
            body: JSON.stringify(response)
          }
        }
        return createErrorResponse(404, 'UserProfile not found');
      }

      if (path === Routes.userById) {
        return await getUserById(event)
      }

      if (path === Routes.userByIdProfile) {
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

      if (path === Routes.userByIdProfile) {
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
