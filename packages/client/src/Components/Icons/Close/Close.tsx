import React from "react"

interface IconCloseProps {
    className: string
}

const IconClose: React.FC<IconCloseProps> = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" className={props.className}>
            <path fill="#030104" d="M21.1 0H5a4.9 4.9 0 0 0-5 4.9V21a5 5 0 0 0 4.9 5H21a5 5 0 0 0 4.9-4.9V5c.1-2.8-2.1-5-4.8-5zm-2.3 17.4-1.4 1.4a1 1 0 0 1-1 0L13 15.3l-3.5 3.5c-.2.2-.6.2-.9 0l-1.4-1.4a.7.7 0 0 1 0-1l3.5-3.4-3.5-3.5a.7.7 0 0 1 0-.9l1.4-1.4a1 1 0 0 1 1 0l3.4 3.5 3.5-3.5c.2-.2.6-.2.9 0l1.4 1.4c.2.3.2.7 0 1L15.3 13l3.5 3.5c.2.2.2.6 0 .9z" />
        </svg>
    )
}

export default IconClose

