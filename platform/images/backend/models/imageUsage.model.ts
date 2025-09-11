import { MaistroImageUsage } from "../types/image";

class ImageUsageModel implements MaistroImageUsage {
    public BytesQuota: number;
    public BytesUsed: number;
    public OwnerId: string;

    constructor(imageUsageModel: MaistroImageUsage) {
        this.BytesQuota = imageUsageModel.BytesQuota
        this.BytesUsed = imageUsageModel.BytesUsed
        this.OwnerId = imageUsageModel.OwnerId
    }
}

export default ImageUsageModel
