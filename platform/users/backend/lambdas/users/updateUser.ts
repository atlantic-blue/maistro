import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createErrorResponse } from "../../utils/createError";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || '';

export async function updateUser(
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  const userId = event.pathParameters?.userId;

  if (!userId || !event.body) {
    return createErrorResponse(400, 'Missing userId parameter or request body');
  }

  try {
    const updateData = JSON.parse(event.body);
    const timestamp = new Date().toISOString();

    // Prepare update expression
    let updateExpression = 'SET UpdatedAt = :updatedAt';
    const expressionAttributeValues: any = {
      ':updatedAt': timestamp
    };
    const expressionAttributeNames: any = {};

    // Updatable fields
    const updatableFields = [
      'FirstName',
      'LastName',
      'DisplayName',
      'Avatar',
      'PhoneNumber',
      'PhoneVerified',
      'PreferredLanguage',
      'Timezone',
    ];

    updatableFields.forEach(field => {
      const lowerField = field.charAt(0).toLowerCase() + field.slice(1);
      if (updateData[lowerField] !== undefined) {
        updateExpression += `, ${field} = :${field}`;
          expressionAttributeValues[`:${field}`] = updateData[lowerField];
      }
    });

    const params = {
      TableName: USERS_TABLE,
      Key: { UserId: userId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ...(Object.keys(expressionAttributeNames).length > 0 && { ExpressionAttributeNames: expressionAttributeNames }),
      ReturnValues: 'ALL_NEW' as const
    };

    const result = await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ user: result.Attributes })
    };

  } catch (error) {
    console.error('Error updating user:', error);
    return createErrorResponse(500, 'Failed to update user');
  }
}