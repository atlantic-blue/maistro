import { LambdaFunctionURLEvent, APIGatewayProxyResultV2 } from "aws-lambda";

import assets from "../dist/public/stats.json"
import App from "./app";
import serverSideRenderer from "./ssr/render";


const handler = async (
    event: LambdaFunctionURLEvent,
): Promise<APIGatewayProxyResultV2> => {
    try {
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
            },
            body: await serverSideRenderer(event, assets, App),
        }
    } catch (error) {
        // Custom error handling for server-side errors
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "text/html",
            },
            body: `<html><body>${error?.toString()}</body></html>`,
        };
    }
}

export {
    handler,
}
