export interface MaistroImage {
    OwnerType: 'user'|'business'
    OwnerId: string
    ImageId: string
    /**
     * 'image/jpeg'
     * 'image/png'
     */
    ContentType: string
    Status: 'UPLOADING'|'READY'

    Urls: { 
        Optimized: string, 
        Low: string, 
        Medium: string, 
        High: string,
        Original: string,
    }

    SizesInBytes: {
        Optimized: number,
        Low: number,
        Medium: number,
        High: number,
        TotalBytes: number,
    }

    CreatedAt: string
    ProcessedAt: string
}

export interface MaistroImageUsage {
    OwnerId: string
    BytesUsed: number,
    BytesQuota: number
}