
/**
 * Function to sanitize and validate the S3 path.
 * Ensures the path does not start or end with a slash, and removes any double slashes.
 * @param path The user-provided path
 * @returns A sanitized path
 */
export const sanitizePath = (path: string): string => {
    // Remove leading and trailing slashes
    path = path.replace(/^\/+|\/+$/g, '');

    // Replace multiple consecutive slashes with a single slash
    path = path.replace(/\/+/g, '/');

    return path;
};


const sanitizeInput = (input: string): string => {
    // Replace unsafe characters with URL encoding (e.g., spaces to %20)
    return encodeURIComponent(input.trim());
};

export const s3Path = (input: { projectId: string, fileName: string, path?: string }): string => {
    // Sanitize inputs
    const sanitizedProjectId = sanitizeInput(input.projectId);
    const sanitizedFileName = sanitizeInput(input.fileName);

    // Construct the full path
    let fullPath = `${sanitizedProjectId}`;

    if (input.path) {
        const sanitizedPath = sanitizeInput(sanitizePath(input.path));
        fullPath += `/${sanitizedPath}`;
    }

    fullPath += `/${sanitizedFileName}`;

    // Remove leading and trailing slashes
    return fullPath.replace(/^\/+|\/+$/g, '');
};