import React from "react"

interface IconTypeProps {
    className?: string
}

const IconType: React.FC<IconTypeProps> = (props) => {
    return (
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
            <path d="M5 7V6C5 4.89543 5.89543 4 7 4H12M19 7V6C19 4.89543 18.1046 4 17 4H12M12 4V20M12 20H9M12 20H15" stroke="#292929" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
    )
}

export default IconType
