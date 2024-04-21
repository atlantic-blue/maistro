const withHttps = (url: string) => {
    if (!url) {
        throw new Error("No URL provided");
    }

    // Check if URL starts with http:// or https://
    if (!/^https?:\/\//i.test(url)) {
        // If URL has no HTTP/HTTPS protocol, prepend https://
        url = `https://${url}`;
    } else if (url.startsWith('http://')) {
        // If URL is HTTP, change it to HTTPS
        url = url.replace('http://', 'https://');
    }

    return url;
}

const withExtension = (input: string, extension: string) => {
    if (!input.endsWith(extension)) {
        input += extension;
    }

    return input;
}

const withDomain = (input: string, domain: string) => {
    return withExtension(input, domain)
}

const sanitizeDomainName = (input: string) => {
    return input
        .replace(/(http)s/g, '')
        .replace(/[0-9]/g, '')
        .replace(/[^a-zA-Z-_]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
}

const isValidUrl = (url: string): [boolean, URL | null] => {
    try {
        const u = new URL(url);
        return [true, u]
    } catch (error) {
        return [false, null]
    }
}

const createUrl = (input: string, domain = ".hosting.maistro.website") => {
    const url = isValidUrl(input)[0] ? new URL(input).host : input
    let [domainName, ...topLevelDomain] = url.split(".")


    return withDomain(
        sanitizeDomainName(domainName),
        (topLevelDomain.length && topLevelDomain[0]) ? `.${topLevelDomain.join(".")}` : domain
    )
}

const sanitizeHref = (url: string, base: string) => {
    try {
        const parsedUrl = new URL(url, base);
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
export {
    sanitizeHref,
    createUrl,
    isValidUrl,
    withExtension,
    withHttps,
}