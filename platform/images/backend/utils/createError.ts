import { APIGatewayProxyResult } from 'aws-lambda';

export function createErrorResponse(statusCode: number, message: string, headers?: any): APIGatewayProxyResult {
  return {
    statusCode,
    headers: headers || {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ error: message })
  };
}