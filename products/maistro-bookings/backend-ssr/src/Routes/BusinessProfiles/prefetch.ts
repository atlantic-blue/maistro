import { BusinessProfile } from "../../types/BusinessProfile";
import { getBusinessProfiles } from "../../Api/BusinessProfile";

import { LoaderArgs } from "../../ssr/serverRoute";

export const businessProfilesPrefetch = async ({
  url,
}: LoaderArgs): Promise<{
    items: BusinessProfile[];
    lastEvaluatedKey?: any;
}> => {
  const parsedURL = new URL(url)
  const pagination = parsedURL.searchParams.get("pagination")
  const businessProfile = await getBusinessProfiles(pagination);
  return businessProfile;
};
