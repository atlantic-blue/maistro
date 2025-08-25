import { DynamoDB } from 'aws-sdk';
import { BusinessProfile } from '../types/business';

const dynamoDB = new DynamoDB.DocumentClient();

export class BusinessesProfileRepository {
    private db: string

    constructor(dynamotable: string) {
        this.db = dynamotable
    }

    async getBusinessProfileBySlug(slug: string): Promise<BusinessProfile | null> {
    try {
        const params = {
          TableName: this.db,
          IndexName: 'Slug-index',
          KeyConditionExpression: 'Slug = :slug',
          ExpressionAttributeValues: {
            ':slug': slug
          }
        };
    
        const result = await dynamoDB.query(params).promise();
        
        if (result.Items && result.Items.length > 0) {
          return result.Items[0] as BusinessProfile;
        }
        
        return null;
      } catch (error) {
        console.error('Error querying user by Cognito ID:', error);
        throw error;
      }
    }
}