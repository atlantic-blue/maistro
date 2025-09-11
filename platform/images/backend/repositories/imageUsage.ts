import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { MaistroImageUsage } from '../types/image';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const dynamoDB = new DynamoDBClient({})
const doc = DynamoDBDocumentClient.from(dynamoDB)

const QUOTA_BYTES_DEFAULT = 1e+9 * 2// 2GB

class ImagesUsageRepository {
    private tableName: string

    constructor(tableName: string) {
        this.tableName = tableName
    }

    async updateQuota(ownerId: string, bytesQuota: number): Promise<void> {
        await doc.send(new UpdateCommand({
            TableName: this.tableName,
            Key: {OwnerId: ownerId },
            UpdateExpression: "SET BytesQuota = if_not_exists(BytesQuota, :z) + :d",
            ExpressionAttributeValues: { ":z": QUOTA_BYTES_DEFAULT, ":d": bytesQuota }
        }))
    }

    async updateUsage(ownerId: string, bytesUsed: number): Promise<void> {
        await doc.send(new UpdateCommand({
            TableName: this.tableName,
            Key: {OwnerId: ownerId },
            UpdateExpression: "SET BytesUsed = if_not_exists(BytesUsed, :z) + :d",
            ExpressionAttributeValues: { ":z": 0, ":d": bytesUsed }
        }))
    }

    async getUsage(ownerId: string): Promise<MaistroImageUsage> {
        const response = await doc.send(new GetCommand({
            TableName: this.tableName,
            Key: { OwnerId: ownerId }
        }))

        return response.Item as MaistroImageUsage
    }
}

export default ImagesUsageRepository