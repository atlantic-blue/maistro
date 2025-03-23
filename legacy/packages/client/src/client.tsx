/**
 * To be used by the clients to mount JS behaviour
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import parser, { HTMLReactParserOptions } from "html-react-parser"
import { templates } from './Templates';
import { Theme } from '@radix-ui/themes';
import { TemplateComponentType, TemplateStruct } from './Templates/templateTypes';
import { LoadableComponent } from '@loadable/component';

const appState = window.__STATE__
const maistroTheme = window.__MAISTRO_THEME__

const parseHtml = () => {
    const input = document.getElementById("main")?.innerHTML || ""
    const options: HTMLReactParserOptions = {
        replace(domNode, index) {
            if (domNode && domNode?.attribs && domNode?.attribs["data-hydration-id"]) {
                const hydrationId = domNode?.attribs["data-hydration-id"] as string
                if (hydrationId) {
                    const templateName = hydrationId.split(":")[0] as TemplateComponentType
                    if (!templateName) {
                        console.log("Hydration | Template Name not found")
                        return null
                    }

                    const template = templates[templateName] as TemplateStruct
                    if (!template) {
                        console.log("Hydration | Template not found")
                        return null
                    }

                    const Component = (template?.getComponent && template?.getComponent()) || template?.Component
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

    return parser(input, options)
}

const preloadComponents = async () => {
    const elements = document.querySelectorAll("[data-hydration-id]");
    const promises: TemplateStruct["getComponent"][] = [];

    elements.forEach(element => {
        const hydrationId = element.getAttribute("data-hydration-id");
        if (hydrationId) {
            const templateName = hydrationId.split(":")[0] as TemplateComponentType;
            const template = templates[templateName] as TemplateStruct;

            if (template && template.getComponent) {
                // Push the promise to load the component via dynamic import
                promises.push(template.getComponent().preload);
            }
        }
    })

    return Promise.all(promises).then(() => {
        console.log("All components loaded!");
    });
}

export const AppWrapper: React.FC<{ children: string | React.JSX.Element | React.JSX.Element[] }> = (props) => {
    return (
        <Theme
            accentColor={maistroTheme?.accentColor}
            grayColor={maistroTheme?.grayColor}
            appearance={maistroTheme?.appearance}
            radius={maistroTheme?.radius}
            scaling={maistroTheme?.scaling}
        >
            {props.children}
        </Theme>
    )
}

preloadComponents().then(() => {
    const container = document.getElementById('main') as HTMLElement
    const root = createRoot(container)

    const App = parseHtml()
    root.render(<AppWrapper>{App}</AppWrapper>)
})
