import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from "."

jest.mock('aws-sdk', () => ({
    S3: jest.fn().mockReturnValue({
        putObject: jest.fn().mockReturnValue({
            promise: jest.fn()
        })
    })
}));

describe("upload", () => {
    beforeEach(() => {
        process.env.BUCKET_NAME = "foo"
    })

    it("should validate input", async () => {
        // @ts-expect-error partial implementation
        const event: APIGatewayProxyEvent = {
            body: `{
                "userId":"foo",
                "projectId":"bf25a00a-ac76-4626-85e2-e613bee92fcb",
                "fileName":"flippant.html","fileContent":"<html lang=\\"eng\\"><body><section class=\\"SectionHeroBasic___hero___o9uWm\\"><h1>Landing Page.</h1><div class=\\"SectionHeroBasic___section___qN9td\\"><div class=\\"SectionHeroBasic___img-frame___dZskJ\\"><div class=\\"SectionHeroBasic___img-wrapper___gL_nS\\"><img src=\\"https://picsum.photos/seed/2OG34wN9/640/480\\" alt=\\"img\\" class=\\"SectionHeroBasic___img___uLIwe\\"/></div></div><p class=\\"SectionHeroBasic___text___dXQdM\\">Discover our services and offerings.</p></div><button class=\\"Button___button___Se8Ba\\"><a href=\\"#home\\" class=\\"Button___link____hc5R\\">Get Started</a></button></section></body></html>",
                "fileType": "image/png"
            }`,

        }

        const output = await handler(event, {} as Context, () => { })

        expect(output).toStrictEqual({
            headers: { 'Access-Control-Allow-Origin': '*' },
            statusCode: 200,
            body: "{\"message\":\"File uploaded successfully\",\"key\":\"foo/bf25a00a-ac76-4626-85e2-e613bee92fcb/assets/flippant.html\"}",
        })
    })
    
})
