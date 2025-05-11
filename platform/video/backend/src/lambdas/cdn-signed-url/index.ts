import {getSignedUrl} from "@aws-sdk/cloudfront-signer";
import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const cloudFrontUrl = process.env.CLOUDFRONT_URL!;
        const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID!; 
        const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY!.replace(/\\n/g, '\n'); // handle escaped newlines
    
    if (
        !cloudFrontUrl ||
        !keyPairId ||
        !privateKey
    ) {
        throw new Error("Env vars missing")
    }

    const { path } = event.queryStringParameters || {};
    if (!path) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Missing 'path' query parameter." }),
        };
      }

      const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      const signedUrl = getSignedUrl({
        keyPairId,
        privateKey,
        url: `${cloudFrontUrl}${path}`,
        dateLessThan: expires,
      })
    
      return {
        statusCode: 200,
        body: JSON.stringify({ signedUrl }),
      };   
    } catch (error) {
        console.error("Error generating signed URL", error);
    return {
      statusCode: 500,
        body: JSON.stringify({ message: "Internal server error." }),
        };
    }
}
