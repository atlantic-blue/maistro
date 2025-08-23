import React from "react"
import { LambdaFunctionURLEvent } from "aws-lambda";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import Html from "./html";

interface Assets {
    scripts: string[]
    styles: string[]
}

const serverSideRenderer = async (
    event: LambdaFunctionURLEvent,
    assets: Assets,
    App: React.FC
) => {
    const state = {
        timestamp: Date.now()
    }

    const staticMarkup = renderToString(
        <StaticRouter location={event.rawPath}>
            <App />
        </StaticRouter>
    )

    const helmet = Helmet.renderStatic();

    const head = `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}

        ${assets.styles.map(filename => `<link rel="stylesheet" href="/${filename}" />`).join('\n')}
    `

    const scripts = `
        ${assets.scripts.map(filename => `<script src="/${filename}"></script>`).join('\n')}
        <script id="server-side-sate">
            window.__STATE__ = ${JSON.stringify(state)};
        </script>
    `

    return Html({
        head,
        body: {
            main: staticMarkup,
            scripts,
        },
        htmlAttributes: helmet.htmlAttributes.toString(),
        bodyAttributes: helmet.bodyAttributes.toString(),
    })
}

export default serverSideRenderer
