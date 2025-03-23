import { resourceStringsEn } from "./en";
import { resourceStringsEs } from "./es";

export interface ResourceStrings {
    page: {
        home: {
            section: {
                hero: {
                    
                }
            }
        }
    }
}

export enum ResourceStringLanguage {
    SPANISH = "es",
    ENGLISH = "en",
}

export const resourceStrings: Record<ResourceStringLanguage, ResourceStrings> = {
    [ResourceStringLanguage.ENGLISH]: resourceStringsEn,
    [ResourceStringLanguage.SPANISH]: resourceStringsEs,
}
