import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { BusinessProfileService } from "../../src/services/business.service";
import { BusinessProfileRepository } from "../../src/repositories/business.repository";

enum Routes {
    BUSINESS_PROFILE = 'business/{businessSlug}/profile'
}

const BUSINESSES_TABLE = process.env.BUSINESSES_TABLE || ""

const publicBusinessService = new BusinessProfileService(
    new BusinessProfileRepository(BUSINESSES_TABLE)
)

export const handler: APIGatewayProxyHandler = async (event) => {
      console.log('Public Business Service API event:', JSON.stringify(event, null, 2));

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
        
     if (method === "GET") {
        if(path === Routes.BUSINESS_PROFILE) {
            const slug = event.pathParameters?.businessSlug;
            const response = await publicBusinessService.getBusinessProfileBySlug(slug)
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