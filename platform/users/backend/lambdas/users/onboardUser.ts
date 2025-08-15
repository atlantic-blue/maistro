import { APIGatewayProxyEvent } from "aws-lambda";
import { MaistroUser, SubscriptionTier, UserProfile } from "../../types/user";
import { createUser, createUserProfile } from "../users-create/createUser";
import { getUserByCognitoId } from "../users-create/getUserByCognitoId";
import { v4 as uuidv4 } from 'uuid';
import { DecodedToken } from ".";

function generateUserId(): string {
  return uuidv4()
}

export interface Service {
  name: string;
  duration: string;
  price: number;
}

export interface OnboardingFormData {
  businessName: string;
  website: string;
  businessType: string[];
  accountType: 'independent' | 'team' | '';
  teamSize: string;
  address: string;
  phone: string;
  description: string;
  services: Service[];
  features: string[];
  hearAbout: string;
}

export const onboardUser = async (decodedToken: DecodedToken, event: APIGatewayProxyEvent) => {
  const cognitoId = decodedToken.username
  let user = await getUserByCognitoId(cognitoId);
  let profile = null;
  let isNewUser = false;
  const timestamp = new Date().toISOString();

  const onboardingData: OnboardingFormData = JSON.parse(event.body || '');

  let userId = user?.UserId || ""

        if (!user) {
          // New user, create user record
          userId = generateUserId();

          const newUser: MaistroUser = {
            UserId: userId,
            CognitoUserId: cognitoId,
            Email: "", // TODO get this data from cognito
            FirstName: "",
            Avatar: "",
            CreatedAt: timestamp,
            UpdatedAt: timestamp,
            LastLoginAt: timestamp,
            Status: 'ACTIVE',
            SubscriptionTier: SubscriptionTier.FREE,
            EmailVerified: false,
            ProductAccess: {
              websites: true,
              academy: true,
              customers: true, // Free tier gets access to customers
              funnels: false,   // Free tier gets access to funnels
              socials: false,   // Social features require premium
              chats: false,
              bookings: true,
            }
          };

          // Save user and profile to DynamoDB
          await Promise.all([
            createUser(newUser),
          ]);
        }

        const userProfile: UserProfile = {
            UserId: userId,
            OnboardingCompleted: true,
            OnboardingStep: 0,
            MarketingOptIn: false,
            CreatedAt: timestamp,
            UpdatedAt: timestamp,
            BusinessName: onboardingData.businessName,
            Website: onboardingData.website,
            BusinessType: onboardingData.businessType,
            AccountType: onboardingData.accountType,
            TeamSize: onboardingData.teamSize,
            Address: onboardingData.address,
            Phone: onboardingData.phone,
            Description: onboardingData.description,
            Services: onboardingData.services,
            Features: onboardingData.features,
            HearAbout: onboardingData.hearAbout,
          };

          await Promise.all([
            createUserProfile(userProfile)
          ])

  return {
            statusCode: 200,
            body: JSON.stringify({user, profile, isNewUser})
        }
}