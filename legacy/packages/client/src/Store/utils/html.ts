interface HtmlProps {
    head: string;
    body: {
        main: string
        scripts: string
    }
    htmlAttributes: string
    bodyAttributes: string
}

const Html = ({
    htmlAttributes,
    bodyAttributes,
    head,
    body,
}: HtmlProps) => {
    return (
        `
        <!DOCTYPE html>
        <html ${htmlAttributes}>

        <head>
            ${head}
        </head>

        <body ${bodyAttributes}>
            <main id="main">
                ${body.main}
            </main>
            ${body.scripts}
        </body>

        </html >
    `
    )
}

export {
    Html as default
}
