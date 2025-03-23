import React from "react"

interface IconMinusProps {
    className?: string
}

const IconMinus: React.FC<IconMinusProps> = (props) => {
    return (
        <svg className={props.className} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#1C274C" strokeWidth="1.5" />
            <path d="M15 12H9" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

export default IconMinus
