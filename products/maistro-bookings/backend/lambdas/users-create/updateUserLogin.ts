import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || '';

export async function updateUserLastLogin(userId: string, timestamp: string): Promise<void> {
  try {
    const params = {
      TableName: USERS_TABLE,
      Key: {
        UserId: userId
      },
      UpdateExpression: 'SET LastLoginAt = :timestamp, UpdatedAt = :timestamp',
      ExpressionAttributeValues: {
        ':timestamp': timestamp
      }
    };

    await dynamoDB.update(params).promise();
  } catch (error) {
    console.error('Error updating last login:', error);
    throw error;
  }
}
