import React from "react"

interface IconItalicProps {
    className: string
}

const IconItalic: React.FC<IconItalicProps> = (props) => {
    return (
        <svg className={props.className} viewBox="0 0 24 24">
            <path fillRule="evenodd" d="m16.7 4.7-.1.9h-.3c-.6 0-1 0-1.4.3-.3.3-.4.6-.5 1.1l-2.1 9.8v.6c0 .5.4.8 1.4.8h.2l-.2.8H8l.2-.8h.2c1.1 0 1.8-.5 2-1.5l2-9.8.1-.5c0-.6-.4-.8-1.4-.8h-.3l.2-.9h5.8Z" />
        </svg>
    )
}

export default IconItalic

