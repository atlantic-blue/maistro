import { getBusinessProfileBySlug } from "../../Api/BusinessProfile";
import { BusinessProfile } from "../Dahsboard/types";

export const businessProfilePrefetch = async(businessSlug: string): Promise<BusinessProfile> => {
    const businessProfile = await getBusinessProfileBySlug(businessSlug)
    return businessProfile
}
