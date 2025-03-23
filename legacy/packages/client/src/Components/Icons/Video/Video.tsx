import React from "react"

interface IconWireVideoProps {
    className?: string
}

const IconWireVideo: React.FC<IconWireVideoProps> = (props) => {
    return (
        <svg className={props.className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path fill="#1C274C" clipRule="evenodd" fillRule="evenodd" d="M15.3 7.5H8.7c-3.4 0-5 0-6 1s-.8 2.5-.3 5.6l.4 2.9c.4 2.4.5 3.6 1.4 4.3 1 .7 2.2.7 4.9.7h5.8c2.7 0 4 0 4.9-.7.9-.7 1-2 1.4-4.3l.4-3c.5-3 .7-4.5-.3-5.5s-2.6-1-6-1Zm-.7 8.3a1 1 0 0 0 0-1.6l-3.4-2c-.5-.4-1.2 0-1.2.7v4.2c0 .7.7 1.1 1.2.8l3.4-2.1Z" />
            <path fill="#1C274C" d="M8.5 2h7.6c1 .1 2 .8 2.4 1.7h-13C6 2.7 6.8 2 8 2h.6Z" opacity=".4" />
            <path fill="#1C274C" d="M6.3 4.7a3 3 0 0 0-3 2l1.3-.2 4-.1h7a34.5 34.5 0 0 1 5.2.3 3 3 0 0 0-3-2H6.4Z" opacity=".7" />
        </svg>
    )
}

export default IconWireVideo
