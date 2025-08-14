import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createErrorResponse } from "../../utils/createError";
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
const USER_PROFILES_TABLE = process.env.USER_PROFILES_TABLE || '';

export async function getUserProfile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const userId = event.pathParameters?.userId;

  if (!userId) {
    return createErrorResponse(400, 'Missing userId parameter');
  }

  try {
    const params = {
      TableName: USER_PROFILES_TABLE,
      Key: { UserId: userId }
    };

    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return createErrorResponse(404, 'User profile not found');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ profile: result.Item })
    };

  } catch (error) {
    console.error('Error getting user profile:', error);
    return createErrorResponse(500, 'Failed to get user profile');
  }
}
