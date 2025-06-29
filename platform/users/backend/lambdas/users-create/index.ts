import { CognitoUserPoolTriggerEvent, Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import * as crypto from 'crypto';

/**
 * Cognito Post Authentication Trigger
 * Triggered after a user successfully authenticates
 */
export const handler = async (
  event: CognitoUserPoolTriggerEvent,
  context: Context,
  callback: Callback
): Promise<CognitoUserPoolTriggerEvent> => {
  console.log('Post Authentication Trigger Event:', JSON.stringify(event, null, 2));

  return event
//   try {
//     const { userPoolId, userName, userAttributes } = event.request;
//     const timestamp = new Date().toISOString();

//     // Extract user information from Cognito attributes
//     const email = userAttributes.email;
//     const emailVerified = userAttributes.email_verified === 'true';
//     const phoneNumber = userAttributes.phone_number;
//     const phoneVerified = userAttributes.phone_number_verified === 'true';
//     const firstName = userAttributes.given_name;
//     const lastName = userAttributes.family_name;
//     const preferredLanguage = userAttributes.locale || 'en';

//     // Check if user already exists in our system
//     const existingUser = await getUserByCognitoId(userName);

//     if (existingUser) {
//       // User exists, update last login time
//       await updateUserLastLogin(existingUser.UserId, timestamp);
//       console.log(`Updated last login for existing user: ${existingUser.UserId}`);
//     } else {
//       // New user, create user record
//       const newUserId = generateUserId();
      
//       const newUser: MaistroUser = {
//         UserId: newUserId,
//         CognitoUserId: userName,
//         Email: email,
//         FirstName: firstName,
//         LastName: lastName,
//         DisplayName: generateDisplayName(firstName, lastName, email),
//         CreatedAt: timestamp,
//         UpdatedAt: timestamp,
//         LastLoginAt: timestamp,
//         Status: 'ACTIVE',
//         SubscriptionTier: 'FREE', // Default to free tier
//         EmailVerified: emailVerified,
//         PhoneNumber: phoneNumber,
//         PhoneVerified: phoneVerified,
//         PreferredLanguage: preferredLanguage,
//         ProductAccess: {
//           websites: true,  // Free tier gets access to websites
//           funnels: true,   // Free tier gets access to funnels
//           customers: true, // Free tier gets access to customers
//           socials: false   // Social features require premium
//         }
//       };

//       // Create user profile
//       const userProfile: UserProfile = {
//         UserId: newUserId,
//         OnboardingCompleted: false,
//         OnboardingStep: 0,
//         MarketingOptIn: false,
//         CreatedAt: timestamp,
//         UpdatedAt: timestamp
//       };

//       // Save user and profile to DynamoDB
//       await Promise.all([
//         createUser(newUser),
//         createUserProfile(userProfile)
//       ]);

//       console.log(`Created new user: ${newUserId} for Cognito user: ${userName}`);

//       // Trigger onboarding flow for new users
//       await triggerOnboardingFlow(newUserId, email);
//     }

//     // Return the event to continue the authentication flow
//     return event;

//   } catch (error) {
//     console.error('Error in post authentication trigger:', error);
    
//     // Don't fail the authentication even if user creation fails
//     // Log the error for investigation but allow login to proceed
//     console.error('User creation failed but allowing authentication to proceed');
//     return event;
//   }
};
