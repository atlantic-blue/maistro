import { decode } from 'jsonwebtoken';
import { APIGatewayProxyEvent } from "aws-lambda";

export interface DecodedToken {
  sub: string;
  email: string;
  username: string;
  [key: string]: any;
}

export default class BusinessesTransport {
    getDecodedToken(event: APIGatewayProxyEvent): DecodedToken {
        const authHeader = event.headers.Authorization || event.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error("Missing token")
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = decode(token) as DecodedToken;

        if (!decodedToken || !decodedToken.sub) {
            new Error('Invalid token');
        }

        return decodedToken
    }
}