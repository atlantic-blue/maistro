import { OnboardingFormData } from "../Routes/Onboarding/types";

const onboardUser = async (
  url: string,
  token: string,
  onboadingData: OnboardingFormData,
) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...onboadingData,
    }),
  }).then((response) => response.json());
};

export default onboardUser;
