import React from "react"
import { Box, Flex, Section } from "@radix-ui/themes"
import { animated, useSpring } from '@react-spring/web';

import * as styles from "./Loading.scss"
import IconLogo from "../Icons/Logo/Logo"

interface LoadingProps {
    children?: string
}

const Loading: React.FC<LoadingProps> = (props) => {
    const [animatedProps] = useSpring(
        () => ({
            from: { opacity: 1 },
            to: { opacity: 0.5 },
        }),
        []
    )

    return (
        <animated.div style={animatedProps}>
            <div className={styles.main} data-is-root-theme='true'>
                <Section data-is-root-theme='true'>
                    <Flex direction="column" align="center" justify="center" gap="1">
                        <Box>
                            <IconLogo className={styles.icon} />
                        </Box>
                        <Box>
                            {props.children || "Loading..."}
                        </Box>
                    </Flex>
                </Section>
            </div>
        </animated.div>
    )
}

export default Loading