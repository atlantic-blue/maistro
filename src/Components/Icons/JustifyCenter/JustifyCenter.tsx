import React from "react"

interface IconJustifyCenterProps {
    className: string
}

const IconJustifyCenter: React.FC<IconJustifyCenterProps> = (props) => {
    return (
        <svg className={props.className} viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" />
        </svg>
    )
}

export default IconJustifyCenter
