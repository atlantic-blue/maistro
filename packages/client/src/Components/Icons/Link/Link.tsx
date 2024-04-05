import React from "react"

interface IconLinkProps {
    className?: string
}

const IconLink: React.FC<IconLinkProps> = (props) => {
    return (
        <svg className={props.className} viewBox="0 0 24 24">
            <path d="M6.2 12.3a1 1 0 0 1 1.4 1.4l-2 2a2 2 0 1 0 2.6 2.8l4.8-4.8a1 1 0 0 0 0-1.4 1 1 0 1 1 1.4-1.3 2.9 2.9 0 0 1 0 4l-4.8 5a3.9 3.9 0 0 1-5.5-5.5l2-2Zm11.6-.6a1 1 0 0 1-1.4-1.4l2-2a2 2 0 1 0-2.6-2.8L11 10.3a1 1 0 0 0 0 1.4A1 1 0 1 1 9.6 13a2.9 2.9 0 0 1 0-4l4.8-5a3.9 3.9 0 0 1 5.5 5.5l-2 2Z" />
        </svg>

    )
}

export default IconLink
