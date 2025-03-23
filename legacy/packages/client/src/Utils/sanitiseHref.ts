export const sanitiseHref = (url: string) => {
    try {
        const parsedUrl = new URL(url);
        const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];

        if (!allowedProtocols.includes(parsedUrl.protocol)) {
            return ""
        }

        return parsedUrl.href;
    } catch (error) {
        // TODO app level message invalid URL
        return '';
    }
}
