import path from "path"
import express from "express"
import { LambdaFunctionURLEvent, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import {handler} from "./index.server"

const app = express()
const port = 3000

const createFakeEvent = (path: string): LambdaFunctionURLEvent => {
    return {
        "version": "2.0",
        "routeKey": "$default",
        "rawPath": path,
        "rawQueryString": "foo=baz",
        "headers": {
            "x-amzn-lambda-proxying-cell": "0",
            "content-length": "0",
            "x-amzn-tls-version": "TLSv1.2",
            "sec-fetch-site": "none",
            "x-forwarded-port": "443",
            "sec-fetch-user": "?1",
            "x-amzn-lambda-proxy-auth": "HmacSHA256, SignedHeaders=x-amzn-lambda-forwarded-client-ip;x-amzn-lambda-forwar" +
                "ded-host;x-amzn-lambda-proxying-cell, Signature=/8iAb9DT3oTJ2/CMRQhnjkv2atKqLBJ7" +
                "4NhcRudEOvA=",
            "via": "2.0 aeb457e87760dc433cf50cdb15399112.cloudfront.net (CloudFront)",
            "x-amzn-tls-cipher-suite": "ECDHE-RSA-AES128-GCM-SHA256",
            "sec-ch-ua-mobile": "?0",
            "host": "4ruyrzea3inreev7qr5r3avd7m0ukmzf.cell-1-lambda-url.us-east-1.on.aws",
            "upgrade-insecure-requests": "1",
            "x-amzn-lambda-forwarded-host": "4ruyrzea3inreev7qr5r3avd7m0ukmzf.lambda-url.us-east-1.on.aws",
            "cache-control": "max-age=0",
            "sec-fetch-mode": "navigate",
            "x-forwarded-proto": "https",
            "x-forwarded-for": "2800:484:517b:ab00:f479:f6fb:553f:b0d9",
            "x-amzn-lambda-forwarded-client-ip": "64.252.186.142",
            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
            "x-amzn-trace-id": "Self=1-65c08e4d-69f9a85a3e3e0d79149e7615;Root=1-65c08e4d-0f1cf053229cd24b5f68dda" +
                "7",
            "sec-ch-ua-platform": "\"macOS\"",
            "accept-encoding": "gzip",
            "x-amz-cf-id": "AIgfo1NYy7BV-TL22T4J2On7zL_M1anF0fu4C8BlSDk7kDU11-eQFA==",
            "sec-fetch-dest": "document",
            "user-agent": "Amazon CloudFront"
        },
        "queryStringParameters": {
            "foo": "baz"
        },
        "requestContext": {
            "accountId": "anonymous",
            "apiId": "4ruyrzea3inreev7qr5r3avd7m0ukmzf",
            "domainName": "4ruyrzea3inreev7qr5r3avd7m0ukmzf.cell-1-lambda-url.us-east-1.on.aws",
            "domainPrefix": "4ruyrzea3inreev7qr5r3avd7m0ukmzf",
            "http": {
                "method": "GET",
                "path": "/help",
                "protocol": "HTTP/1.1",
                "sourceIp": "64.252.186.142",
                "userAgent": "Amazon CloudFront"
            },
            "requestId": "0c6e3712-efc3-4132-a99c-3e8ef5cafce1",
            "routeKey": "$default",
            "stage": "$default",
            "time": "05/Feb/2024:07:29:17 +0000",
            "timeEpoch": 1707118157026
        },
        "isBase64Encoded": false
    }
}

app.use((req, res, next) => {
    console.log(req.path)
    next()
})

app.use(express.static(path.join(__dirname, '..', 'dist')))

app.get("/", async (req, res) => {
    try {
     const response = await handler(createFakeEvent(req.path))
    res.send((response as APIGatewayProxyStructuredResultV2).body)   
    } catch (error) {
        console.log({error}, "/")
        res.send({status: 500})
    }
})

app.get("*", async (req, res) => {
    try {
     const response = await handler(createFakeEvent(req.path))
    res.send((response as APIGatewayProxyStructuredResultV2).body)   
    } catch (error) {
        console.log({error})
        res.send({status: 500})
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})