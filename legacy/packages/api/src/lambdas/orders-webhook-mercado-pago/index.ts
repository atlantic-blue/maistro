import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import sendEmail from '../email-create/sendEmail';
import newOrderEmail from './newOrderEmail';
import { Order, OrderStatus } from '../../types/Order';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Listens to a webhook to create orders
 * https://www.mercadopago.com.co/developers/es/docs/your-integrations/notifications/webhooks
 * https://www.mercadopago.com.co/developers/es/docs/your-integrations/notifications/webhooks#editor_6#bookmark_configuración_al_crear_pagos
 */
const ordersCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableNameOrders = process.env.TABLE_NAME_ORDERS
    if (!tableNameOrders) {
        throw createError(500, "process TABLE_NAME_ORDERS not specified")
    }

    const tableNameProjects = process.env.TABLE_NAME_PROJECTS
    if (!tableNameProjects) {
        throw createError(500, "process TABLE_NAME_PROJECTS not specified")
    }

    try {
        const projectId = event.queryStringParameters && event.queryStringParameters['project_id']
        if (!projectId) {
            throw createError(500, "queryParams must have a projectId")
        }

        const orderId = event.queryStringParameters && event.queryStringParameters['order_id']
        if (!orderId) {
            throw createError(500, "queryParams must have an orderId")
        }

        const updatedAt = new Date().toISOString()
        const status = OrderStatus.CHECKOUT_COMPLETED
        const history = {
            status,
            timestamp: updatedAt
        }

        const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: tableNameOrders,
            Key: {
                id: orderId,
                projectId,
            },
            UpdateExpression: 'set #status = :status, #updatedAt = :updatedAt, #history = list_append(#history, :history)',
            ExpressionAttributeValues: {
                ':status': status,
                ':updatedAt': updatedAt,
                ':history': [history]
            },
            ExpressionAttributeNames: {
                '#status': 'status',
                '#updatedAt': 'updatedAt',
                '#history': 'history',
            },
            ReturnValues: 'ALL_NEW',
        };

        await dynamoDb.update(params).promise()

        const orderGetParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: tableNameOrders,
            Key: {
                id: orderId,
                projectId,
            }
        };
    
        const orderData = await dynamoDb.get(orderGetParams).promise();
        const order = orderData && orderData.Item

        // Send Email
        const projectQueryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
            TableName: tableNameProjects,
            IndexName: 'idIndex',
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': projectId,
            },
            Limit: 25,
        };

        const data = await dynamoDb.query(projectQueryParams).promise()
        const project = (data.Items || []).find(item => item.id === projectId)
        const projectEmail = project?.email || "hello@atlanticblue.solutions"

        await sendEmail({
            to: [projectEmail, "atlanticbluesolutionslimited@gmail.com"],
            from: "info@team.maistro.website",
            subject: "You have a new order",
            body: newOrderEmail(order as Order)
        })

        return {
            statusCode: 200,
            body: JSON.stringify({
                id: orderId,
                projectId,
                history,
                updatedAt,
                status,
            })
        };
    } catch (e) {
        console.log(e)
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: e,
            })
        };
    }
};

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .handler(ordersCreate)

export { handler }


