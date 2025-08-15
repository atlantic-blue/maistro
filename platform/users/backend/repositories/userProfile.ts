import { DynamoDB } from 'aws-sdk';
import { UserProfile } from '../types/user';

const dynamoDB = new DynamoDB.DocumentClient();

/**
 * Repository for dynamodb
 */
class UserProfileRepository {
    private userProfileTable: string

    constructor(dynamodbTable: string) {
        this.userProfileTable = dynamodbTable
    }

    async getUserProfileById(userId: string): Promise<UserProfile | null> {
    try {
        const params = {
          TableName: this.userProfileTable,
          IndexName: 'UserIdIndex',
          KeyConditionExpression: 'UserId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          }
        };
    
        const result = await dynamoDB.query(params).promise();
        
        console.log(JSON.stringify(result))
        if (result.Items && result.Items.length > 0) {
          return result.Items[0] as UserProfile;
        }
        

        return null;
      } catch (error) {
        console.error('Error querying user profile by ID:', error);
        throw error;
      }
    }
}

export default UserProfileRepository