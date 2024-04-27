import React from "react"
import Thumbnail, { ThumbnailProps } from "../Thumbnail/Thumbnail"

import IconNew from "../Icons/New/New"

import * as styles from "./TemplateView.scss"
import classNames from "classnames"
import { Box, Card, Section, Text } from "@radix-ui/themes"

interface TemplateViewProps {
    title?: string
    className?: string
    children?: React.ReactNode
    onClick?: () => void
    thumbnail?: Partial<ThumbnailProps>
}

const TemplateView: React.FC<TemplateViewProps> = (props) => {
    return (
        <Card className={classNames(props.className, styles.section)} onClick={props?.onClick} title={props.title}>
            <Box className={styles.content}>
                <Thumbnail {...props.thumbnail}>
                    {props.children}
                </Thumbnail>
            </Box>
            <Section size="1">
                <Text as="div" size="1" weight="bold">
                    {props.title}
                </Text>
            </Section>
        </Card>
    )
}

const TemplateViewNew: React.FC<TemplateViewProps> = (props) => {
    return (
        <Card className={classNames(props.className, styles.section, styles.sectionEmpty)} onClick={props.onClick} title={props.title}>
            <Box className={styles.content}>
                <IconNew className={styles.icon} />
            </Box>
            <Section size="1">
                <Text as="div" size="1" weight="bold">
                    {props.title}
                </Text>
            </Section>
        </Card>
    )
}

export {
    TemplateViewNew,
    TemplateView as default
}
