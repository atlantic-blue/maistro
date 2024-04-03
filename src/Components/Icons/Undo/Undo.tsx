import React from "react"

interface IconUndoProps {
    className: string
}

const IconUndo: React.FC<IconUndoProps> = (props) => {
    return (
        <svg className={props.className} viewBox="0 0 24 24">
            <path d="M6.4 8H12c3.7 0 6.2 2 6.8 5.1.6 2.7-.4 5.6-2.3 6.8a1 1 0 0 1-1-1.8c1.1-.6 1.8-2.7 1.4-4.6-.5-2.1-2.1-3.5-4.9-3.5H6.4l3.3 3.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 1.4L6.4 8Z" />
        </svg>
    )
}

export default IconUndo
