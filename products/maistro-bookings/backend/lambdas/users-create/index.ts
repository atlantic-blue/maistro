import { PostAuthenticationTriggerEvent, Context, Callback } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { getUserByCognitoId } from './getUserByCognitoId';
import { MaistroUser, SubscriptionTier, UserProfile } from '../../types/user';
import { updateUserLastLogin } from './updateUserLogin';
import { createUser, createUserProfile } from './createUser';
import { triggerOnboardingFlow } from './triggerOnboarding';

function generateUserId(): string {
  return uuidv4()
}

/**
 * Cognito Post Authentication Trigger
 * Triggered after a user successfully authenticates
 */
export const handler = async (
  event: PostAuthenticationTriggerEvent,
  context: Context,
  callback: Callback
): Promise<PostAuthenticationTriggerEvent> => {
  console.log('Post Authentication Trigger Event:', JSON.stringify(event, null, 2));

  try {
    const { userPoolId, userName, request } = event;
    const timestamp = new Date().toISOString();

    // Extract user information from Cognito attributes
    const email = request.userAttributes.email;
    const emailVerified = request.userAttributes.email_verified === 'true';
    const name = request.userAttributes.name;
    const avatar = request.userAttributes.picture;

    // Check if user already exists in our system
    const existingUser = await getUserByCognitoId(userName);

    if (existingUser) {
      // User exists, update last login time
      await updateUserLastLogin(existingUser.UserId, timestamp);
    } else {
      // New user, create user record
      const newUserId = generateUserId();
      
      const newUser: MaistroUser = {
        UserId: newUserId,
        CognitoUserId: userName,
        Email: email,
        FirstName: name,
        Avatar: avatar,
        CreatedAt: timestamp,
        UpdatedAt: timestamp,
        LastLoginAt: timestamp,
        Status: 'ACTIVE',
        SubscriptionTier: SubscriptionTier.FREE,
        EmailVerified: emailVerified,
        ProductAccess: {
          websites: true,
          academy: true,
          customers: true, // Free tier gets access to customers
          funnels: false,   // Free tier gets access to funnels
          socials: false,   // Social features require premium
          chats: false,
        }
      };

      // Create user profile
      const userProfile: UserProfile = {
        UserId: newUserId,
        OnboardingCompleted: false,
        OnboardingStep: 0,
        MarketingOptIn: false,
        CreatedAt: timestamp,
        UpdatedAt: timestamp
      };

      // Save user and profile to DynamoDB
      await Promise.all([
        createUser(newUser),
        createUserProfile(userProfile)
      ]);

      console.log(`Created new user: ${newUserId} for Cognito user: ${userName}`);

      // Trigger onboarding flow for new users
      await triggerOnboardingFlow(newUserId, email);
    }

    // Return the event to continue the authentication flow
    return event;

  } catch (error) {
    console.error('Error in post authentication trigger:', error);
    
    // Don't fail the authentication even if user creation fails
    // Log the error for investigation but allow login to proceed
    console.error('User creation failed but allowing authentication to proceed');
    return event;
  }
};
