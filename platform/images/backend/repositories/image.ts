import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { MaistroImage } from '../types/image';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const dynamoDB = new DynamoDBClient({});
const doc = DynamoDBDocumentClient.from(dynamoDB);

class ImagesRepository {
    private db: string

    constructor(db: string) {
        this.db = db
    }

    async createImagePlaceholder(input: Pick<MaistroImage, "ImageId" | "ContentType" | "OwnerId" | "OwnerType">): Promise<Partial<MaistroImage> | null> {
        try {
            const item: Partial<MaistroImage> = {
                Status: "UPLOADING",
                ImageId: input.ImageId,
                ContentType: input.ContentType,
                OwnerId: input.OwnerId,
                OwnerType: input.OwnerType,
                CreatedAt: new Date().toISOString(),
            }

            await doc.send(new PutCommand({
                TableName: this.db,
                Item: item,
                ConditionExpression: "attribute_not_exists(ImageId)" // idempotent create
            }))

            return item   
        } catch (error) {
            throw error
        }
    }

    async updateImageProcessed(
        input: Pick<MaistroImage, "ImageId" | "Urls" | "SizesInBytes">
    ): Promise<void> {
        try {
            await doc.send(new UpdateCommand({
                TableName: this.db,
                Key: { ImageId: input.ImageId },
                UpdateExpression: [
                    "SET Status = :ready",
                    "ProcessedAt = :ts",
                    "Urls = :urls",
                    "SizesInBytes = :sizes",
                ].filter(Boolean).join(", "),
                ExpressionAttributeValues: {
                    ":ready": "READY",
                    ":ts": new Date().toISOString(),
                    ":urls": input.Urls,
                    ":sizes": input.SizesInBytes,
                },
                ConditionExpression: "attribute_not_exists(ProcessedAt)" // idempotency guard
            }))
        } catch (error) {
            
        }
    }

    async deleteImage(imageId: string): Promise<void> {
        await doc.send(new DeleteCommand({
            TableName: this.db,
            Key: { ImageId: imageId }
        }))
    }

    async getImageById(imageId: string): Promise<MaistroImage | null> {
        const response = await doc.send(new GetCommand({
            TableName: this.db,
            Key: {ImageId: imageId }
        }))

        return response.Item ? response.Item as MaistroImage : null
    }

    async getImagesByOwner(
        ownerId: string,
        limit: 20,
        next?: string
    ): Promise<{
        items: MaistroImage[],
        next?: string
    }> {
        const ExclusiveStartKey = next ? JSON.parse(Buffer.from(next, "base64").toString("utf8")) : undefined;

        const response = await doc.send(new QueryCommand({
            TableName: this.db,
            IndexName: "OwnerId-index", // defined in Terraform
            KeyConditionExpression: "OwnerId = :oid",
            ExpressionAttributeValues: {
                ":oid": {
                    S: ownerId
                }
            },
            Limit: limit,
            ExclusiveStartKey,
        }))

        return {
            items: (response.Items ?? []) as unknown as MaistroImage[],
            next: response.LastEvaluatedKey ? Buffer.from(JSON.stringify(response.LastEvaluatedKey)).toString("base64") : undefined
        }
    }
}

export default ImagesRepository
