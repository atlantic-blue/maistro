import React from "react"
import { Avatar, Box } from "@radix-ui/themes"

import * as styles from "./Logo.scss"

interface LogoProps {
    slogan: string
    imgUrl: string
    href?: string
}

const Logo: React.FC<LogoProps> = (props) => {
    return (
        <Box className={styles.logo}>
            <a href={props.href || "/"} aria-label={props.slogan}>
                <Avatar
                    size="3"
                    fallback={props.slogan}
                    src={props.imgUrl}
                    alt={props.slogan}
                    loading="lazy"
                />
            </a>
        </Box>
    )
}

export default Logo

