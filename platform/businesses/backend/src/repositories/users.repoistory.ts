import { DynamoDB } from 'aws-sdk';
import { MaistroUser } from '../types/user';

const dynamoDB = new DynamoDB.DocumentClient();

export default class UsersRepository {
    private db: string

    constructor(dynamotable: string) {
        this.db = dynamotable
    }

    async getUserByCognitoId(cognitoUserId: string): Promise<MaistroUser | null> {
        try {
            const params = {
            TableName: this.db,
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
