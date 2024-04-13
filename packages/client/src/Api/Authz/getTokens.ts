interface GetAuthzTokensInput {
    url: string
    grantType: GrantTypeCode
    code: string
    redirectUrl: string
    clientId: string
    clientSecret: string
}

interface GetAuthzTokensOutput {
    idToken: string
    accessToken: string
    refreshToken: string
    expiresIn: string
    tokenType: string
}

export enum GrantTypeCode {
    authorization_code = "authorization_code",
    refresh_token = 'refresh_token',
    client_credentials = "client_credentials"
}

const getAuthzTokens = ({
    url,
    grantType,
    code,
    redirectUrl,
    clientId,
    clientSecret,
}: GetAuthzTokensInput): Promise<GetAuthzTokensOutput> => {
    const params = new URLSearchParams()
    params.set("grant_type", grantType)
    params.set("code", code)
    params.set("redirect_uri", redirectUrl)

    return fetch(url, {
        headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        }),
        method: "POST",
        body: params
    })
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                // see https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html#post-token-positive-exchanging-a-refresh-token-for-tokens.title
                // TODO format errors
                throw new Error(`AUTH | getAuthzTokens: ${response.error}`)
            }

            return {
                idToken: response.id_token,
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
                expiresIn: response.expires_in,
                tokenType: response.token_type,
            }
        })
}

export default getAuthzTokens
