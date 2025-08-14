import { MaistroUser, UserProfile } from "../../types/user";
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || '';
const USER_PROFILES_TABLE = process.env.USER_PROFILES_TABLE || '';

export async function createUser(user: MaistroUser): Promise<void> {
  try {
    const params = {
      TableName: USERS_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(UserId)' // Prevent duplicate creation
    };

    await dynamoDB.put(params).promise();
  } catch (error: any) {
    if (error?.code === 'ConditionalCheckFailedException') {
      console.log('User already exists, skipping creation');
      return;
    }
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  try {
    const params = {
      TableName: USER_PROFILES_TABLE,
      Item: profile,
      ConditionExpression: 'attribute_not_exists(UserId)'
    };

    await dynamoDB.put(params).promise();
  } catch (error: any) {
    if (error?.code === 'ConditionalCheckFailedException') {
      console.log('User profile already exists, skipping creation');
      return;
    }
    console.error('Error creating user profile:', error);
    throw error;
  }
}
