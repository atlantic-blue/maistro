import { MaistroImage } from "./types";

interface GetImagesResponse  {
    images: MaistroImage[];
    next: string | undefined;
}

export const getImages = async(input: {
    url: string,
    token: string,
    OwnerId: string,
    Limit: number,
    Next?: string,
}) => {
    try {
        const url = new URL(input.url);
        url.searchParams.set('Limit', String(input.Limit));
        url.searchParams.set('OwnerId', input.OwnerId);
        if (input.Next) {
            url.searchParams.set('Next', String(input.Next));
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${input.token}`,
            },
        });

         if (!response.ok) {
            throw new Error(`Failed to get images (${response.status})`);
         }
        
        const data = (await response.json()) as GetImagesResponse;
        return data
    } catch (error) {
        throw new Error(`Failed to fetch images, ${JSON.stringify(error)}`)
    }
}


export const getImagesUsage = async(input: {
    url: string,
    token: string,
    OwnerId: string,
}) => {
    try {
        const url = new URL(input.url);
        url.searchParams.set('OwnerId', input.OwnerId);

        const response = await fetch(input.url, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${input.token}`,
            },
        });

         if (!response.ok) {
            throw new Error(`Failed to get images usage (${response.status})`);
         }
        
        const data = (await response.json()) as {
            OwnerId: string
            BytesUsed: number,
            BytesQuota: number
        };

        return data
    } catch (error) {
        throw new Error(`Failed to fetch images usage, ${JSON.stringify(error)}`)
    }
}
