import React from "react"
import * as AvatarRadix from '@radix-ui/react-avatar';

interface AvatarProps {
    classNames?: {
        root?: string
        image?: string
        fallback?: string
    },
    src: string
    alt: string
    fallback: React.ReactNode
}

const Avatar: React.FC<AvatarProps> = (props) => {
    return (
        <AvatarRadix.Root className={props.classNames?.root}>
            <AvatarRadix.Image
                className={props.classNames?.image}
                src={props.src}
                alt={props.alt}
            />
            <AvatarRadix.Fallback className={props?.classNames?.fallback} delayMs={600}>
                {props.fallback}
            </AvatarRadix.Fallback>
        </AvatarRadix.Root>
    )
}

export default Avatar