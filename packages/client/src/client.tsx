/**
 * To be used by the clients to mount JS behaviour
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import parser, { HTMLReactParserOptions } from "html-react-parser"
import { templates } from './Templates';
import { Theme } from '@radix-ui/themes';

const appState = window.__STATE__
const maistroTheme = window.__MAISTRO_THEME__

export const AppClient = () => {
    const input = document.getElementById("main")?.innerHTML || ""
    const options: HTMLReactParserOptions = {
        replace(domNode, index) {
            if (domNode && domNode.attribs && domNode.attribs["data-hydration-id"]) {
                const hydrationId = domNode.attribs["data-hydration-id"]
                if (hydrationId) {
                    const [templateName] = hydrationId.split(":")
                    if (!templateName) {
                        console.log("Hydration | Template Name not found")
                        return null
                    }

                    const template = templates[templateName]
                    if (!template) {
                        console.log("Hydration | Template not found")
                        return null
                    }

                    const Component = template.Component
                    if (!Component) {
                        console.log("Hydration | Component not found")
                        return null
                    }

                    if (!appState) {
                        console.log("Hydration | appState not found")
                        return null
                    }

                    const props = appState[hydrationId]
                    if (!props) {
                        console.log("Hydration | state props not found")
                        return null
                    }

                    return <Component {...props} />
                }
            }
        },
    }

    return (
        <Theme
            accentColor={maistroTheme?.accentColor}
            grayColor={maistroTheme?.grayColor}
            appearance={maistroTheme?.appearance}
            radius={maistroTheme?.radius}
            scaling={maistroTheme?.scaling}
        >
            {parser(input, options)}
        </Theme>
    )
}

const container = document.getElementById('main') as HTMLElement
const root = createRoot(container)
root.render(<AppClient />)
