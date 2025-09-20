import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { BusinessesProfileService, OnboardingFormData, UpdateBusinessFormData } from "../../src/services/businesses.service";
import { BusinessesProfileRepository } from "../../src/repositories/businesses.repository";
import BusinessesTransport from "../../src/transport/businesses.transport";
import UsersService from "../../src/services/users.service";
import UsersRepository from "../../src/repositories/users.repoistory";

enum Routes {
  BUSINESSES_ONBOARDING = '/businesses/onboarding',
  POST_BUSINESSES_PROFILE_BY_ID = '/businesses/{businessId}/profile',

  BUSINESSES_PROFILE_BY_SLUG = '/businesses/slug/{businessSlug}/profile',
  BUSINESSES_PROFILE_BY_ID = '/businesses/id/{businessId}/profile',
  BUSINESSES_PROFILE_ME = '/businesses/me/profile'
}

const BUSINESSES_TABLE = process.env.BUSINESSES_TABLE || ""
const USERS_TABLE = process.env.USERS_TABLE || ""

const usersService = new UsersService(
  new UsersRepository(USERS_TABLE)
)
const businessesService = new BusinessesProfileService(
    new BusinessesProfileRepository(BUSINESSES_TABLE)
)

const businessesTransport = new BusinessesTransport()

export const handler: APIGatewayProxyHandler = async (event) => {
      console.log('Public Businesses Service API event:', JSON.stringify(event, null, 2));

     const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({})
      };
    }

    const method = event.httpMethod;
    const path = event.resource;

    try {
      
      if(method === "POST") {
        if(path === Routes.BUSINESSES_ONBOARDING) {
            const decodedToken = businessesTransport.getDecodedToken(event)
            const user = await usersService.getUserByCognitoId(decodedToken.username)

            const onboardingData: OnboardingFormData = JSON.parse(event.body || '');
            const response = await businessesService.createBusinessProfile(onboardingData, user?.UserId || "", user?.Email || "")
          
            if(response) {
              return {
                      statusCode: 200,
                      body: JSON.stringify(response)
                  }
            }

          return createErrorResponse(500, 'Onboarding failed');
        }

        if(path === Routes.POST_BUSINESSES_PROFILE_BY_ID) {
            const decodedToken = businessesTransport.getDecodedToken(event)
            const user = await usersService.getUserByCognitoId(decodedToken.username)
            const businessId = event.pathParameters?.businessId;
            const userId = user?.UserId

            if (!businessId || !userId) {
              return createErrorResponse(500, 'Profile update failed, userId or businessId missing');
            }

            const updateBusinessFormData: UpdateBusinessFormData = JSON.parse(event.body || '');
            const response = await businessesService.updateBusinessProfile(updateBusinessFormData, businessId, userId)

             if(response) {
              return {
                      statusCode: 200,
                      body: JSON.stringify(response)
                  }
            }

          return createErrorResponse(500, 'Profile update failed');
        }
      }

     if (method === "GET") {
        if(path === Routes.BUSINESSES_PROFILE_BY_SLUG) {
            const businessSlug = event.pathParameters?.businessSlug;
            const response = await businessesService.getBusinessProfileBySlug(businessSlug)
            if (response) {
                return {
                    statusCode: 200,
                    body: JSON.stringify(response)
                }
            }

            return createErrorResponse(404, 'User not found');
        }

        if(path === Routes.BUSINESSES_PROFILE_BY_ID) {
            const businessId = event.pathParameters?.businessId;
            const response = await businessesService.getBusinessProfileByBusinessId(businessId)
            if (response) {
                return {
                    statusCode: 200,
                    body: JSON.stringify(response)
                }
            }

            return createErrorResponse(404, 'User not found');
        }

        if(path === Routes.BUSINESSES_PROFILE_ME) {
            const decodedToken = businessesTransport.getDecodedToken(event)
            const user = await usersService.getUserByCognitoId(decodedToken.username)
            const response = await businessesService.getBusinessProfileByUserId(user?.UserId)
            if (response) {
                return {
                    statusCode: 200,
                    body: JSON.stringify(response)
                }
            }

            return createErrorResponse(404, 'User not found');
        }
    } 
    
    return createErrorResponse(404, 'Route not found');
    } catch (error) {
        console.error('Error processing request:', error);
            return createErrorResponse(500, 'Internal server error', corsHeaders);
    }
}

export function createErrorResponse(statusCode: number, message: string, headers?: any): APIGatewayProxyResult {
  return {
    statusCode,
    headers: headers || {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ error: message })
  };
}