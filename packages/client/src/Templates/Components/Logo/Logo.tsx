import React from "react"
import { Avatar, Box } from "@radix-ui/themes"

import * as styles from "./Logo.scss"

interface LogoProps {
    slogan: string
    imgUrl: string
}

const Logo: React.FC<LogoProps> = (props) => {
    return (
        <Box className={styles.logo}>
            <a href="/" aria-label={props.slogan}>
                <Avatar
                    size="3"
                    fallback={props.slogan}
                    src={props.imgUrl}
                    alt={props.slogan}
                />
            </a>
        </Box>
    )
}

export default Logo

