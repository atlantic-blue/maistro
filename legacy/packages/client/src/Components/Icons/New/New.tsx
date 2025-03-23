import React from "react"

interface IconNewProps {
    className?: string
}

const IconNew: React.FC<IconNewProps> = (props) => {
    return (
        <svg className={props.className} viewBox="0 -.5 21 21" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M11.6 9h3.1v2h-3.1v3H9.4v-3H6.3V9h3.1V6h2.2v3Zm-1.1 9a8.2 8.2 0 0 1-8.4-8c0-4.4 3.8-8 8.4-8 4.6 0 8.4 3.6 8.4 8s-3.8 8-8.4 8Zm0-18C4.7 0 0 4.5 0 10s4.7 10 10.5 10S21 15.5 21 10 16.3 0 10.5 0Z" />
        </svg>
    )
}

export default IconNew
