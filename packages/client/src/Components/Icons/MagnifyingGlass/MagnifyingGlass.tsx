import React from "react"

interface IconMagnifyingGlassProps {
    className?: string
}

const IconMagnifyingGlass: React.FC<IconMagnifyingGlassProps> = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" className={props.className}>
            <path d="M448 768a320 320 0 1 0 0-640 320 320 0 0 0 0 640zm297.3-77L960 905.6l-54.3 54.3L691 745.3a384 384 0 1 1 54.3-54.3z" />
        </svg>
    )
}

export default IconMagnifyingGlass

