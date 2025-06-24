import { APIGatewayProxyHandler } from 'aws-lambda';

const FB_APP_ID = process.env.FB_APP_ID!;
const FB_APP_SECRET = process.env.FB_APP_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

export const handler: APIGatewayProxyHandler = async (event) => {
  const code = event.queryStringParameters?.code;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing ?code in query params' }),
    };
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v20.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: FB_APP_ID,
          redirect_uri: REDIRECT_URI,
          client_secret: FB_APP_SECRET,
          code,
        }),
    );

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      throw new Error(`Token exchange failed: ${err}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Get basic user info
    const userRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name&access_token=${accessToken}`,
    );

    const userData = await userRes.json();

    // Get pages + IG accounts
    const pagesRes = await fetch(
      `https://graph.facebook.com/me/accounts?access_token=${accessToken}`,
    );

    const pagesData = await pagesRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken,
        user: userData,
        pages: pagesData,
      }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};