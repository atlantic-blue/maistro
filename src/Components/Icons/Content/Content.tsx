import React from "react"

interface IconContentProps {
    className?: string
}

const IconContent: React.FC<IconContentProps> = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 491.6 491.6" className={props.className}>
            <path d="M430.1 0c-34 0-61.4 27.5-61.4 61.5v348.1c0 4 1.2 8 3.4 11.4l41 61.4a20.5 20.5 0 0 0 34 0l41-61.4c2.2-3.4 3.4-7.3 3.4-11.4V61.5c0-34-27.5-61.5-61.4-61.5zm0 41c11.3 0 20.5 9.2 20.5 20.5v41h-41v-41c0-11.3 9.2-20.5 20.5-20.5zm0 393.2-20.5-30.8v-260h41v260L430 434.2zm-107-303.7v-.1l-1.4-1.5L198.8 6l-1.5-1.3a20 20 0 0 0-14-4.7H20.5A20.5 20.5 0 0 0 0 20.5v450.6c0 11.3 9.2 20.5 20.5 20.5h286.7c11.3 0 20.5-9.2 20.5-20.5V144.4a20 20 0 0 0-4.6-14zm-65.3-7.6h-53V70l53 53zM41 450.6V41h122.9v102.4c0 11.3 9.1 20.5 20.4 20.5h102.4v286.7H41z" />
            <path d="M225.3 204.8H81.9a20.5 20.5 0 1 0 0 41h143.4a20.5 20.5 0 1 0 0-41zm0 82H81.9a20.5 20.5 0 1 0 0 41h143.4a20.5 20.5 0 1 0 0-41zm0 81.9H81.9a20.5 20.5 0 1 0 0 41h143.4a20.5 20.5 0 1 0 0-41z" />
        </svg>
    )
}

export default IconContent
