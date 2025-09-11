import { APIGatewayProxyHandler } from 'aws-lambda';
import { decode } from 'jsonwebtoken';

import { createErrorResponse } from '../../utils/createError';
import ImagesService from '../../services/image.service';
import ImagesRepository from '../../repositories/image';
import ImagesUsageRepository from '../../repositories/imageUsage';
import { MaistroImage } from '../../types/image';

enum Routes{
    createSignedUrl = '/signedUrl',
    resize = '/resize',
}

export interface DecodedToken {
  sub: string;
  email: string;
  username: string;
  [key: string]: any;
}

const IMAGES_TABLE = process.env.USERS_TABLE || '';
const IMAGES_USAGE_TABLE = process.env.USER_PROFILES_TABLE || '';
const S3_BUCKET = process.env.S3_BUCKET || '';
const HOSTING_DOMAIN_URL = process.env.HOSTING_DOMAIN_URL || '';
const S3_UPLOAD_TIMEOUT =  300 // 5 minutes
const S3_UPLOAD_SIZE_LIMIT = 5 * 1024 * 1024 // Max 5MB

const imageService = new ImagesService(
    new ImagesRepository(IMAGES_TABLE),
    new ImagesUsageRepository(IMAGES_USAGE_TABLE),
    {
        HostingDomainUrl: HOSTING_DOMAIN_URL,
        S3Bucket: S3_BUCKET,
        SizeLimit: S3_UPLOAD_SIZE_LIMIT,
        Timeout: S3_UPLOAD_TIMEOUT,
        Variants: {
            low: {
                quality: 60,
                width: 480,
            },
            medium: {
                quality: 75,
                width: 1024,
            },
            high: {
                quality: 85,
                width: 2048,
            },
            optimised: {
                quality: 82,
                width: 2560,
            }
        }
    }
)

/**
 * Main handler for images service API
 */
export const handler: APIGatewayProxyHandler = async (event) => {
      console.log('User Service API event:', JSON.stringify(event, null, 2));

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS'
  };

  try {
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse(401, 'Missing token');
    }

    const token = authHeader.split(' ')[1];
        
    // Decode token (skip verification for speed - you can add verification later)
    const decodedToken = decode(token) as DecodedToken;
    if (!decodedToken || !decodedToken.sub) {
        return createErrorResponse(401, 'Invalid token');
    }

    if (event.httpMethod === 'OPTIONS') {
        return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({})
        };
    }

    const method = event.httpMethod;
    const path = event.resource;

    if (method === 'POST') {
        if(path === Routes.createSignedUrl) {
            // TODO check that OwnerId belongs to user
            const body: {
                OwnerId: MaistroImage["OwnerId"],
                OwnerType: MaistroImage["OwnerType"],
                ContentType: MaistroImage["ContentType"]
            } = JSON.parse(event.body || '');
    
            const response = await imageService.createPresignedUrl({
                OwnerId: body.OwnerId,
                OwnerType: body.OwnerType,
                ContentType: body.ContentType,
            })

            return {
                 statusCode: 200,
                 body: JSON.stringify(response)
            }
        }

        if(path == Routes.resize) {
            const body: {
                key: string
            } = JSON.parse(event.body || '')

            const response = await imageService.resizeVariants(body.key)
            return {
                 statusCode: 200,
                 body: JSON.stringify(response)
            }
        }
     }

     return createErrorResponse(404, 'Route not found', corsHeaders);
  } catch(error) {
    console.error('Error processing request:', error);
    return createErrorResponse(500, 'Internal server error', corsHeaders);
  }
}