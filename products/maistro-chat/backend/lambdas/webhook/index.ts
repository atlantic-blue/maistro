import { APIGatewayProxyHandler } from "aws-lambda";

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "";

export const handler: APIGatewayProxyHandler = async (event) => {
    const method = event.httpMethod;
    const headers = {
        "Content-Type": "application/json",
    };

    // --- Handle Meta Webhook Verification (GET) ---
  if (method === "GET") {
    const params = event.queryStringParameters || {};
    const mode = params["hub.mode"];
    const token = params["hub.verify_token"];
    const challenge = params["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return {
        statusCode: 200,
        headers,
        body: challenge || "",
      };
    } else {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: "Verification failed" }),
      };
    }
  }

  // --- Handle incoming messages (POST) ---
  if (method === "POST") {
    let body = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch (e) {
      console.error("❌ Invalid JSON:", event.body);
    }

    console.log("📩 Incoming webhook from Meta:", JSON.stringify(body, null, 2));

    // TODO: Process the message content and reply via Meta Send API

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "EVENT_RECEIVED" }),
    };
  }


  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
}
