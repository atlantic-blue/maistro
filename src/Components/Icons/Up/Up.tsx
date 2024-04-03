import React from "react"

interface IconUpProps {
    className?: string
}

const IconUp: React.FC<IconUpProps> = (props) => {
    return (
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
            <path d="M12.0703 22V2" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 8L10 2.84009C10.2571 2.5677 10.5671 2.35047 10.911 2.20215C11.2549 2.05383 11.6255 1.97754 12 1.97754C12.3745 1.97754 12.7451 2.05383 13.089 2.20215C13.4329 2.35047 13.7429 2.5677 14 2.84009L19 8" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default IconUp
