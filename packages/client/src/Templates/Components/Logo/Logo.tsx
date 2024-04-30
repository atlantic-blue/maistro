import React from "react"
import { Avatar, Box } from "@radix-ui/themes"

import * as styles from "./Logo.scss"

interface LogoProps {
    slogan?: string
    imgUrl: string
}

const Logo: React.FC<LogoProps> = (props) => {
    return (
        <Box className={styles.logo}>
            <a href="/">
                <Avatar
                    fallback={props.slogan || ""}
                    src={props.imgUrl}
                />
            </a>
        </Box>
    )
}

export default Logo

