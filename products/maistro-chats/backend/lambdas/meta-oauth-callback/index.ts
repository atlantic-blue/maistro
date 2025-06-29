import { APIGatewayProxyHandler } from 'aws-lambda';

const FB_APP_ID = process.env.FB_APP_ID!;
const FB_APP_SECRET = process.env.FB_APP_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

/**
 * see https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const code = event.queryStringParameters?.code;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing ?code in query params' }),
    };
  }

  try {
    console.log("Step 1: Exchange code for short-lived access token")
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: FB_APP_ID,
        client_secret: FB_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.log(JSON.stringify(err))
      throw new Error(`Token exchange failed: ${err}`);
    }

    const tokenData = await tokenRes.json();
    const shortLivedAccessToken = tokenData.access_token;
    const userId = tokenData.user_id;

    console.log("Step 2: Exchange short-lived token for long-lived token")
    const longTokenRes = await fetch(
      `https://graph.instagram.com/access_token?` +
        new URLSearchParams({
          grant_type: 'ig_exchange_token',
          client_secret: FB_APP_SECRET,
          access_token: shortLivedAccessToken,
        }),
    );

    if (!longTokenRes.ok) {
      const err = await longTokenRes.text();
      console.log(JSON.stringify(err))
      throw new Error(JSON.stringify(err));
    }

    const longTokenData = await longTokenRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: longTokenData.access_token,
        expires_in: longTokenData.expires_in,
        user_id: userId,
      }),
    };
  } catch (err: any) {
    console.log(JSON.stringify(err))
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};