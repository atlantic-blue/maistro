import React from "react"

interface IconPagesProps {
    className?: string
}

const IconPages: React.FC<IconPagesProps> = (props) => {
    return (
        <svg className={props.className} viewBox="0 0 30 30">
            <path d="M11.5 9.5a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3V17a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3Z" />
            <path d="M9.6 10A2.6 2.6 0 0 0 7 12.6V21a3 3 0 0 0 3 3h6.8a2.3 2.3 0 0 0 2.2-2.3.8.8 0 0 0-.8-.7h-3.7a4 4 0 0 1-4-4v-6.1a.9.9 0 0 0-.9-.9Z" opacity=".2" />
        </svg>
    )
}

export default IconPages
