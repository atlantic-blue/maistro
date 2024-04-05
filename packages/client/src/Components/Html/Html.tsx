import React, { HTMLAttributes } from "react"

interface HtmlProps {
    htmlAttributes: HTMLAttributes<HTMLHtmlElement>,
    children: React.ReactNode
}

const Html: React.FC<HtmlProps> = (props) => {
    return (
        <html {...props.htmlAttributes}>
            {props.children}
        </html>
    )
}

export default Html
