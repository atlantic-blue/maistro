export interface JwtDecoded {
    encoded: {
        header: string
        payload: string
        signature: string
    },
    decoded: {
        header: {
            [key: string]: string
        }
        payload: {
            [key: string]: string
        }
    },
}

const decodeBase64 = (base64: string): [{
    [key: string]: string
}, Error | null] => {
    try {
        return [
            JSON.parse(
                decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(c => {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        })
                        .join('')
                        .replace(/_/g, '/')
                        .replace(/-/g, '+')
                )
            ), null
        ]
    } catch (error) {
        return [{}, new Error("Unable to decodeBase64")]
    }
}

export const decodeJwt = (jwt: string): [JwtDecoded | null, Error | null] => {
    const parts = jwt.split(".")
    const [header, payload, signature] = parts

    if (parts.length !== 3 || !header || !payload || !signature) {
        return [null, new Error("Unable to decode JWT")]
    }

    const [decodedHeader, decodedHeaderError] = decodeBase64(header)
    if (decodedHeaderError) {
        return [null, decodedHeaderError]
    }

    const [decodedPayload, decodedPayloadError] = decodeBase64(payload)
    if (decodedPayloadError) {
        return [null, decodedPayloadError]
    }

    return [{
        encoded: {
            header,
            payload,
            signature,
        },
        decoded: {
            header: decodedHeader,
            payload: decodedPayload
        }
    }, null]
}
