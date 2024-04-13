import React from "react"

import * as styles from "./Thumbnail.scss"

export interface ThumbnailProps {
    dimensions?: {
        height: string;
        width: string;
        scale: number;
    }
    children: React.ReactNode
}

const defaultDimensions: ThumbnailProps["dimensions"] = {
    width: `150px`,
    height: `240px`,
    scale: 0.5,
}

const Thumbnail: React.FC<ThumbnailProps> = ({
    dimensions = defaultDimensions,
    children
}) => {
    const { height, scale, width } = dimensions

    const thumbnailStyle = {
        width: `${width}`,
        height: `${height}`,
        overflow: 'hidden',
    }

    const viewStyle = {
        overFlow: "scroll",
        transform: `scale(${scale})`,
        transformOrigin: "0 0",
        width: `calc(${width} * (1 / ${scale}))`,
        height: `calc(${height} * (1 / ${scale}))`,

    }

    return (
        <div style={thumbnailStyle} className={styles.thumbnail}>
            <div style={viewStyle} className={styles.view}>
                {children}
            </div>
        </div>
    )
}

export default Thumbnail
