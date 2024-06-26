import React from "react"

interface IconColourTextProps {
    className: string
}

const IconColourText: React.FC<IconColourTextProps> = (props) => {
    return (
        <svg className={props.className} viewBox="0 0 24 24">
            <g fillRule="evenodd">
                <path d="M3 18h18v3H3z" />
                <path d="M8.7 16h-.8a.5.5 0 0 1-.5-.6l2.7-9c.1-.3.3-.4.5-.4h2.8c.2 0 .4.1.5.4l2.7 9a.5.5 0 0 1-.5.6h-.8a.5.5 0 0 1-.4-.4l-.7-2.2c0-.3-.3-.4-.5-.4h-3.4c-.2 0-.4.1-.5.4l-.7 2.2c0 .3-.2.4-.4.4Zm2.6-7.6-.6 2a.5.5 0 0 0 .5.6h1.6a.5.5 0 0 0 .5-.6l-.6-2c0-.3-.3-.4-.5-.4h-.4c-.2 0-.4.1-.5.4Z" />
            </g>
        </svg>
    )
}

export default IconColourText
