const isBase64 = (input: string): [boolean, Buffer | null] => {
    try {
        const [header, data] = input.split(",")
        const buffer = Buffer.from(data, 'base64');

        // This step ensures the string was indeed base64 encoded
        const reEncoded = buffer.toString('base64');
        return [
            input === `${header},${reEncoded}`,
            buffer
        ];
    } catch (e) {
        // If an error occurs during decoding or encoding, the string is not base64
        return [
            false,
            null
        ];
    }
}

export {
    isBase64
}
