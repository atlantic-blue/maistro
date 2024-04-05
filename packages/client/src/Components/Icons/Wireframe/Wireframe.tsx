import React from "react"

interface IconWireframeProps {
    className?: string
}

const IconWireframe: React.FC<IconWireframeProps> = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={props.className}>
            <path d="M3 20V4a1 1 0 0 1 1-1h7v18H4a1 1 0 0 1-1-1Zm18 0v-7h-8v8h7a1 1 0 0 0 1-1Zm0-16a1 1 0 0 0-1-1h-7v8h8Z" />
        </svg>
    )
}

export default IconWireframe
