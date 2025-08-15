import { DynamoDB } from 'aws-sdk';
import { MaistroUser } from '../types/user';

const dynamoDB = new DynamoDB.DocumentClient();

/**
 * Repository for dynamodb
 */
class UserRepository {
    private userTable: string

    constructor(dynamodbTable: string) {
        this.userTable = dynamodbTable
    }

    async getUserByCognitoId(cognitoUserId: string): Promise<MaistroUser | null> {
    try {
        const params = {
          TableName: this.userTable,
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
}

export default UserRepository