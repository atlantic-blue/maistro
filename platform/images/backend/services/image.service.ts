import { v4 as uuid } from "uuid";
import { S3 } from 'aws-sdk';
// @ts-ignore
import { ImagePool } from '@squoosh/lib';

import ImagesRepository from "../repositories/image";
import ImagesUsageRepository from "../repositories/imageUsage";
import { MaistroImage } from "../types/image";

const s3 = new S3();

interface ImagesServiceConfig {
    S3Bucket: string
    CloudfrontUrl: string
    Timeout: number
    SizeLimit: number
    Variants: {
        low: {
            width: number;
            quality: number;
        },
        medium: {
            width: number;
            quality: number;
        },
        high: {
            width: number;
            quality: number;
        },
        optimised: {
            width: number;
            quality: number;
        },
    }
}

class ImagesService {
    private imagesRepository: ImagesRepository
    private imagesUsageRepository: ImagesUsageRepository
    private config: ImagesServiceConfig

    constructor(
        imagesRepository: ImagesRepository,
        imagesUsageRepository: ImagesUsageRepository,
        config: ImagesServiceConfig
    ) {
        this.imagesRepository = imagesRepository
        this.imagesUsageRepository = imagesUsageRepository
        this.config = config
    }

    /**
     * @param input 
     * - Worksout future image URLs
     * - Returns S3 presigned POST url
     * - Writes "UPOLADING" state to db
     */
    async createPresignedUrl(input: Pick<MaistroImage, "ContentType" | "OwnerId" | "OwnerType">) {
        const ImageId = uuid()
        const Urls = this.createImageUrls(
            {
                ImageId,
                OwnerId: input.OwnerId,
                OwnerType: input.OwnerType
            },
            this.config.CloudfrontUrl
        )

        const PresignedUrl = s3.createPresignedPost({
                Bucket: this.config.S3Bucket, 
                Fields: {
                    key: Urls.Original,
                    'Content-Type': input.ContentType,
                },
                Conditions: [
                    ['content-length-range', 0, this.config.SizeLimit],
                ],
                Expires: this.config.Timeout,
            })


        await this.imagesRepository.createImagePlaceholder({
            ImageId,
            ContentType: input.ContentType,
            OwnerId: input.OwnerId,
            OwnerType: input.OwnerType,
        })

        return {
            ImageId,
            Urls,
            PresignedUrl,
        }
    }

    /**
     * @param key string
     * resize rules for /users|business/<id>/originals/...
     */
    public async resizeVariants(key: string) {
        const match = key.match(/^(users|businesses)\/([^/]+)\/originals\/([^/]+)$/);
        if(!match) {
            console.log("RESIZE OBJECT: invalid key", key)
            return
        }

        const OwnerType = match[1] === "users" ? "user" : "business";
        const OwnerId   = match[2];
        const ImageId   = match[3];

        // 1) Fetch original from s3
        const origBuf = await this.getObjectBuffer(this.config.S3Bucket, key);

        // 2) Process Images
        const {
            lowVariant,
            mediumVariant,
            highVariant,
            optimisedVariant,
        } = await this.createVariants(origBuf)

        const Urls = this.createImageUrls({
            ImageId,
            OwnerId,
            OwnerType,
        }, this.config.CloudfrontUrl)

        // 3) Save variants
        const put = (key: string, body: Buffer) =>
            s3.putObject({
                Bucket: this.config.S3Bucket,
                Key: key,
                Body: body,
                ContentType: "image/webp",
            }).promise();

        await Promise.all([
            put(Urls.Low, lowVariant),
            put(Urls.Medium, mediumVariant),
            put(Urls.High, highVariant),
            put(Urls.Optimized, optimisedVariant),
        ]);

        // 4) Mark Image as processed
        const SizesInBytes: MaistroImage["SizesInBytes"] = {
            Low: lowVariant.byteLength,
            Medium: mediumVariant.byteLength,
            High: highVariant.byteLength,
            Optimized: optimisedVariant.byteLength,
            TotalBytes: (
                optimisedVariant.byteLength + 
                lowVariant.byteLength +
                mediumVariant.byteLength +
                highVariant.byteLength
            )
        };

        await this.imagesRepository.updateImageProcessed({
            ImageId,
            Urls,
            SizesInBytes,
        })

        // 5) Update User's usage
        await this.imagesUsageRepository.updateUsage(OwnerId, SizesInBytes.TotalBytes)

        // 4) Delete raw original
        await s3.deleteObject({ Bucket: this.config.S3Bucket, Key: key }).promise();

        return {
            ImageId,
            Urls,
        }
    }

    private async getObjectBuffer(Bucket: string, Key: string): Promise<Buffer> {
        const res = await s3.getObject({ Bucket, Key }).promise();
        if (!res.Body) throw new Error("Empty S3 object body");
        if (Buffer.isBuffer(res.Body)) return res.Body as Buffer;
        if (typeof res.Body === "string") return Buffer.from(res.Body as string);
        // stream
        const stream = res.Body as NodeJS.ReadableStream;
        const chunks: Buffer[] = [];
        return await new Promise<Buffer>((resolve, reject) => {
            stream.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
            stream.on("error", reject);
            stream.on("end", () => resolve(Buffer.concat(chunks)));
        });
    }

    private createImageUrls(
        input: Pick<MaistroImage, "OwnerId" | "OwnerType" | "ImageId">,
        baseUrl: string,
        extension: string = "webp",
    ): MaistroImage["Urls"] {
        const owner = `${input.OwnerType === "user" ? "users" : "businesses"}`
        const url = `${baseUrl}/${owner}/${input.OwnerId}/${input.ImageId}`;

        return {
            High: `${url}/high.${extension}`,
            Low: `${url}/low.${extension}`,
            Medium: `${url}/medium.${extension}`,
            Optimized: `${url}/optimized.${extension}`,
            Original: `${url}/original.bin`,
        }
    }

    private async createVariants(origBuf: Buffer) {
        const pool = new ImagePool(1); // concurrency; keep low on Lambda

        async function createVariant(width: number, quality: number) {
            const img = pool.ingestImage(origBuf);
            await img.decoded;
            await img.preprocess({ resize: { width } });
            await img.encode({ webp: { quality } });
            const { binary } = await img.encodedWith.webp;
            return Buffer.from(binary);
        }

        const [
            lowVariant,
            mediumVariant,
            highVariant,
            optimisedVariant,
        ] = await Promise.all([
            createVariant(this.config.Variants.low.width, this.config.Variants.low.quality),
            createVariant(this.config.Variants.medium.width, this.config.Variants.medium.quality),
            createVariant(this.config.Variants.high.width, this.config.Variants.high.quality),
            createVariant(this.config.Variants.optimised.width, this.config.Variants.optimised.quality)
        ]);

        await pool.close();
        return {
            lowVariant,
            mediumVariant,
            highVariant,
            optimisedVariant,
        };
    }
}

export default ImagesService
