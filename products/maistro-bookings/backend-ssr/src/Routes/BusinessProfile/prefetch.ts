import { BusinessProfile } from "../../types/BusinessProfile";
import { getBusinessProfileBySlug } from "../../Api/BusinessProfile";

import { LoaderArgs } from "../../ssr/serverRoute";

export const businessProfilePrefetch = async ({
  params,
}: LoaderArgs): Promise<BusinessProfile> => {
  const businessSlug = params.businessProfile;
  const businessProfile = await getBusinessProfileBySlug(businessSlug);
  return businessProfile;
};
