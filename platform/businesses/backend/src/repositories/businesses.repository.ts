import { DynamoDB } from 'aws-sdk';
import { BusinessProfile } from '../types/business';

const dynamoDB = new DynamoDB.DocumentClient();

export class BusinessesProfileRepository {
    private db: string

    constructor(dynamotable: string) {
        this.db = dynamotable
    }

    async updateBusinessProfile(businessProfile: BusinessProfile): Promise<void> {
      try {
        const params = {
          TableName: this.db,
          Item: businessProfile,
        };

         await dynamoDB.put(params).promise();
      } catch (error) {
        console.error('Error createing businessProfile:', error);
        throw error;
      }
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
        console.error('Error querying business by Slug:', error);
        throw error;
      }
    }

    async getBusinessProfileByBusinessId(businessId: string): Promise<BusinessProfile | null> {
      try {
        const params = {
          TableName: this.db,
          IndexName: 'BusinessId-index',
          KeyConditionExpression: 'BusinessId = :businessId',
          ExpressionAttributeValues: {
            ':businessId': businessId
          }
        };
    
        const result = await dynamoDB.query(params).promise();
        
        if (result.Items && result.Items.length > 0) {
          return result.Items[0] as BusinessProfile;
        }
        
        return null;
      } catch (error) {
        console.error('Error querying business by businessId:', error);
        throw error;
      }
    }

    async getBusinessProfileByUserId(userId: string): Promise<BusinessProfile[] | null> {
      try {
        const params = {
          TableName: this.db,
          IndexName: 'UserId-index',
          KeyConditionExpression: 'UserId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          }
        };
    
        const result = await dynamoDB.query(params).promise();
        
        if (result.Items && result.Items.length > 0) {
          return result.Items as BusinessProfile[];
        }
        
        return null;
      } catch (error) {
        console.error('Error querying business by userId:', error);
        throw error;
      }
    }
}