import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { MaistroImage } from '../types/image';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from "@aws-sdk/util-dynamodb";

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
            console.log("createImagePlaceholder", JSON.stringify(input))
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
                    "SET #status = :ready",
                    "ProcessedAt = :ts",
                    "#urls = :urls",
                    "#sizes = :sizes",
                ].filter(Boolean).join(", "),
                ExpressionAttributeNames: {
                    "#status": "Status",          // <-- reserved word in dynamo, must alias
                    "#urls": "Urls",          
                    "#sizes": "SizesInBytes",
                },
                ExpressionAttributeValues: {
                    ":ready": "READY",
                    ":ts": new Date().toISOString(),
                    ":urls": input.Urls,
                    ":sizes": input.SizesInBytes,
                },
                ConditionExpression: "attribute_not_exists(ProcessedAt)" // idempotency guard
            }))
        } catch (error) {
            console.log("updateImageProcessed", JSON.stringify(input))
            throw error
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
        limit: number,
        next?: string
    ): Promise<{
        images: MaistroImage[],
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

        const images = (response.Items ?? []).map((av) => unmarshall(av)) as MaistroImage[];
        images.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());

        return {
            images,
            next: response.LastEvaluatedKey ? Buffer.from(JSON.stringify(response.LastEvaluatedKey)).toString("base64") : undefined
        }
    }
}

export default ImagesRepository
