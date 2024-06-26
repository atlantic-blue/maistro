import React from "react"

interface IconRedoProps {
    className: string
}

const IconRedo: React.FC<IconRedoProps> = (props) => {
    return (
        <svg className={props.className} viewBox="0 0 24 24">
            <path d="M17.6 10H12c-2.8 0-4.4 1.4-4.9 3.5-.4 2 .3 4 1.4 4.6a1 1 0 1 1-1 1.8c-2-1.2-2.9-4.1-2.3-6.8.6-3 3-5.1 6.8-5.1h5.6l-3.3-3.3a1 1 0 1 1 1.4-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3Z" />
        </svg>
    )
}

export default IconRedo
