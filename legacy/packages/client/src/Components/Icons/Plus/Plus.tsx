import React from "react"

interface IconPlusProps {
    className?: string
}

const IconPlus: React.FC<IconPlusProps> = (props) => {
    return (
        <svg className={props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path fillRule="evenodd" d="M16 30a14 14 0 1 1 0-28 14 14 0 0 1 0 28Zm0-30a16 16 0 1 0 0 32 16 16 0 0 0 0-32Zm6 15h-5v-5a1 1 0 0 0-2 0v5h-5a1 1 0 0 0 0 2h5v5a1 1 0 0 0 2 0v-5h5a1 1 0 0 0 0-2Z" />
        </svg>
    )
}

export default IconPlus
