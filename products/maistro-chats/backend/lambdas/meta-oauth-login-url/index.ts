import { APIGatewayProxyHandler } from 'aws-lambda';
import qs from 'querystring';

const FB_APP_ID = process.env.FB_APP_ID!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

/**
 * Returns the Facebook Login URL with the correct scopes and redirect URI.
 */
export const handler: APIGatewayProxyHandler = async () => {
  const query = qs.stringify({
    client_id: FB_APP_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'instagram_business_basic instagram_business_manage_messages instagram_business_manage_comments instagram_business_content_publish instagram_business_manage_insights',
    response_type: 'code',
    auth_type: 'rerequest',

    force_reauth: 'true',
  });

  const loginUrl = `https://www.instagram.com/oauth/authorize?${query}`;

  return {
    statusCode: 200,
    body: JSON.stringify({ loginUrl }),
  };
};
