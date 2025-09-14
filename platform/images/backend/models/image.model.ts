import { MaistroImage } from "../types/image";

class ImageModel implements MaistroImage {
    public ImageId: string;
    public ContentType: string;
    public CreatedAt: string;
    public OwnerId: string;
    public OwnerType: "user" | "business";
    public ProcessedAt: string;
    public SizesInBytes: { Optimised: number; Low: number; Medium: number; High: number; TotalBytes: number; };
    public Status: "UPLOADING" | "READY";
    public Urls: { Optimized: string; Low: string; Medium: string; High: string; Original: string };

    constructor(maistroImage: MaistroImage) {
        this.ImageId = maistroImage.ImageId
        this.ContentType = maistroImage.ContentType
        this.CreatedAt = maistroImage.CreatedAt
        this.OwnerId = maistroImage.OwnerId
        this.OwnerType = maistroImage.OwnerType
        this.ProcessedAt = maistroImage.ProcessedAt
        this.SizesInBytes = maistroImage.SizesInBytes
        this.Status = maistroImage.Status
        this.Urls = maistroImage.Urls
    }
}

export default ImageModel
