import { v4 as uuid } from "uuid";
import { S3 } from 'aws-sdk';
import { Jimp } from "jimp";

import ImagesRepository from "../repositories/image";
import ImagesUsageRepository from "../repositories/imageUsage";
import { MaistroImage, MaistroImageUsage } from "../types/image";

const s3 = new S3();

interface ImagesServiceConfig {
    S3Bucket: string
    HostingDomainUrl: string
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
        console.log("createPresignedUrl")
        console.log("Worksout future image URLs")
        const ImageId = uuid()
        const Urls = this.createImageUrls(
            {
                ImageId,
                OwnerId: input.OwnerId,
                OwnerType: input.OwnerType
            },
            this.config.HostingDomainUrl
        )

        console.log("Returns S3 presigned POST url")
        const PresignedUrl = s3.createPresignedPost({
                Bucket: this.config.S3Bucket, 
                Fields: {
                    Key: Urls.Original.replace(`${this.config.HostingDomainUrl}/`, ""),
                    'Content-Type': input.ContentType,
                },
                Conditions: [
                    ['eq', '$Content-Type', input.ContentType],
                    ['content-length-range', 0, this.config.SizeLimit],
                ],
                Expires: this.config.Timeout,
            })


        console.log("Writes `UPOLADING` state to db")
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
     * resize rules for users|business/<id>/originals/...
     */
    public async resizeVariants(key: string) {
        console.log("math", key)
        const match = key.match(/^(users|businesses)\/([^/]+)\/([^/]+)\/([^/]+)$/);
        if(!match) {
            console.log("RESIZE OBJECT: invalid key", key)
            return
        }

        const OwnerType = match[1] === "users" ? "user" : "business";
        const OwnerId   = match[2];
        const ImageId   = match[3];

        console.log("1) Fetch original from s3")
        const origBuf = await this.getObjectBuffer(this.config.S3Bucket, key);

        console.log("2) Process Images")
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
        }, this.config.HostingDomainUrl)

        console.log("3) Save variants")
        const put = (key: string, body: Buffer) =>
            s3.putObject({
                Bucket: this.config.S3Bucket,
                Key: key,
                Body: body,
                ContentType: "image/png",
            }).promise();

        await Promise.all([
            put(Urls.Low.replace(`${this.config.HostingDomainUrl}/`, ""), lowVariant),
            put(Urls.Medium.replace(`${this.config.HostingDomainUrl}/`, ""), mediumVariant),
            put(Urls.High.replace(`${this.config.HostingDomainUrl}/`, ""), highVariant),
            put(Urls.Optimized.replace(`${this.config.HostingDomainUrl}/`, ""), optimisedVariant),
        ]);

        console.log("4) Mark Image as processed")
        const SizesInBytes: MaistroImage["SizesInBytes"] = {
            Low: lowVariant.byteLength,
            Medium: mediumVariant.byteLength,
            High: highVariant.byteLength,
            Optimised: optimisedVariant.byteLength,
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

        console.log("5) Update User's usage")
        await this.imagesUsageRepository.updateUsage(OwnerId, SizesInBytes.TotalBytes)

        console.log("6) Delete raw original")
        await s3.deleteObject({ Bucket: this.config.S3Bucket, Key: key }).promise();

        return {
            ImageId,
            Urls,
        }
    }

    public async getImages(ownerId: string, limit: number, next?: string) {
        const response = await this.imagesRepository.getImagesByOwner(ownerId, limit, next)

        return {
            images: response.images,
            next: response.next
        }
    }

    public async getImagesUsage(ownerId: string): Promise<MaistroImageUsage> {
        const response = await this.imagesUsageRepository.getUsage(ownerId)

        return response
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
        extension: string = "png",
    ): MaistroImage["Urls"] {
        const owner = `${input.OwnerType === "user" ? "users" : "businesses"}`
        const url = `${baseUrl}/${owner}/${input.OwnerId}/${input.ImageId}`;

        return {
            High: `${url}/${this.config.Variants.high.width}px.${extension}`,
            Low: `${url}/${this.config.Variants.low.width}px.${extension}`,
            Medium: `${url}/${this.config.Variants.medium.width}px.${extension}`,
            Optimized: `${url}/${this.config.Variants.optimised.width}px.${extension}`,
            Original: `${url}/original.bin`,
        }
    }

    private async createVariants(origBuf: Buffer) {
        async function createVariant(width: number, quality: number): Promise<Buffer> {
            const image = await Jimp.fromBuffer(origBuf);
            image.resize({ w: width });

            // Png export
            return await image.getBuffer("image/png", { quality });
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

        return {
            lowVariant,
            mediumVariant,
            highVariant,
            optimisedVariant,
        };
    }
}

export default ImagesService
