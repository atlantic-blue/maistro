import React, { useEffect } from "react"
import { createPortal } from "react-dom"
import { Subject } from "rxjs"

interface IframeMessage {
    type: "content",
    content: React.ReactNode
}

const iframe$ = new Subject<IframeMessage>()

interface IframeProps {
    children?: React.ReactNode
}

const copyStylesFromParent = (iframe?: Document) => {
    if (!iframe) {
        return
    }

    const stylesSheet = iframe.querySelector('head')?.appendChild(iframe.createElement("style")).sheet
    const styles = Array.from(document.styleSheets)
    styles
        .reduce<Array<string>>((styles, current: CSSStyleSheet) => {
            return [
                ...styles,
                ...Array.from(current.cssRules).map(rule => rule.cssText)
            ]
        }, [])
        .forEach((rule: string) => {
            stylesSheet?.insertRule(rule)
        })
}

const Iframe: React.FC<IframeProps> = (props) => {
    const [content, setContent] = React.useState<React.ReactNode | null>(null)
    const ref = React.useRef<HTMLIFrameElement | null>()
    const documentNode = ref?.current?.contentWindow?.document
    const mountNode = documentNode?.body

    useEffect(() => {
        copyStylesFromParent(documentNode)
        setContent(props.children)
    }, [documentNode])

    return (
        <iframe ref={ref as any}>
            {(content && mountNode) ? createPortal(content, mountNode) : null}
        </iframe>
    )
}

export {
    iframe$,
    Iframe as default,
}
