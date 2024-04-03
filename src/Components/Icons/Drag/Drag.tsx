import React from "react"

interface IconDragProps {
    className?: string
}

const IconDrag: React.FC<IconDragProps> = (props) => {
    return (
        <svg className={props.className} xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24">
            <path d="m13 22.5-5.2-5.1a2 2 0 0 1-.6-1.5 2 2 0 0 1 2-2 2 2 0 0 1 1.5.6l1.3 1.3V6.4a2 2 0 0 1 1.7-2 1.9 1.9 0 0 1 1.6.5 1.8 1.8 0 0 1 .5 1.4V12l5 .7a2 2 0 0 1 1.7 2 17.2 17.2 0 0 1-1.9 7.6v.2" />
            <path d="M15.8 10.6a4.5 4.5 0 0 0 1.5-1 4.8 4.8 0 1 0-6.8 0 4.5 4.5 0 0 0 1.5 1M1.5 5.3l2.9-2.8 2.8 2.8M4.4 12V2.5" />
        </svg>
    )
}

export default IconDrag
