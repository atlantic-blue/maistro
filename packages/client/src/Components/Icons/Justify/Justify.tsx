import React from "react"

interface IconJustifyProps {
    className: string
}

const IconJustify: React.FC<IconJustifyProps> = (props) => {
    return (
        <svg className={props.className} viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0 4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" />
        </svg>
    )
}

export default IconJustify
