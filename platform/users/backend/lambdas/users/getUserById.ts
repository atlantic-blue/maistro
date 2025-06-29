import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createErrorResponse } from "../../utils/createError";
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || '';

export async function getUserById(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const userId = event.pathParameters?.userId;

  if (!userId) {
    return createErrorResponse(400, 'Missing userId parameter');
  }

  try {
    const params = {
      TableName: USERS_TABLE,
      Key: { UserId: userId }
    };

    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return createErrorResponse(404, 'User not found');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ user: result.Item })
    };

  } catch (error) {
    console.error('Error getting user by ID:', error);
    return createErrorResponse(500, 'Failed to get user');
  }
}
