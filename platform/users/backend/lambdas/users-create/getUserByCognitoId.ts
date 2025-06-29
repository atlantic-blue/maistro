import { MaistroUser } from "../../types/user";
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || '';

export async function getUserByCognitoId(cognitoUserId: string): Promise<MaistroUser | null> {
  try {
    const params = {
      TableName: USERS_TABLE,
      IndexName: 'CognitoUserId-index', // GSI on CognitoUserId
      KeyConditionExpression: 'CognitoUserId = :cognitoUserId',
      ExpressionAttributeValues: {
        ':cognitoUserId': cognitoUserId
      }
    };

    const result = await dynamoDB.query(params).promise();
    
    if (result.Items && result.Items.length > 0) {
      return result.Items[0] as MaistroUser;
    }
    
    return null;
  } catch (error) {
    console.error('Error querying user by Cognito ID:', error);
    throw error;
  }
}