import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createErrorResponse } from "../../utils/createError";
import { DynamoDB } from "aws-sdk";
import { UserProfile } from "../../types/user";

const dynamoDB = new DynamoDB.DocumentClient();
const USER_PROFILES_TABLE = process.env.USER_PROFILES_TABLE || '';

export async function updateUserProfile(userId: string, payload: UserProfile): Promise<APIGatewayProxyResult> {
  if (!userId || !payload) {
    return createErrorResponse(400, 'Missing userId parameter or request body');
  }

  try {
    const updateData = payload;
    const timestamp = new Date().toISOString();

    // Prepare update expression
    let updateExpression = 'SET UpdatedAt = :updatedAt';
    const expressionAttributeValues: any = {
      ':updatedAt': timestamp
    };

    // Updatable profile fields
    const updatableFields = [
        'CompanyName',
        'Industry',
        'CompanySize',
        'Country',
        'OnboardingCompleted',
        'OnboardingStep',
        'MarketingOptIn',
        'CreatedAt',
        'UpdatedAt',
        'BusinessName',
        'Website',
        'BusinessType',
        'AccountType',
        'TeamSize',
        'Address',
        'Phone',
        'Description',
        'Services',
        'Features',
        'HearAbout',
    ];

    updatableFields.forEach(field => {
      const lowerField = field.charAt(0).toLowerCase() + field.slice(1);
      // @ts-ignore
      if (updateData[lowerField] !== undefined) {
        updateExpression += `, ${field} = :${field}`;
        // @ts-ignore
        expressionAttributeValues[`:${field}`] = updateData[lowerField];
      }
    });

    const params = {
      TableName: USER_PROFILES_TABLE,
      Key: { UserId: userId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW' as const
    };

    const result = await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ profile: result.Attributes })
    };

  } catch (error) {
    console.error('Error updating user profile:', error);
    return createErrorResponse(500, 'Failed to update user profile');
  }
}