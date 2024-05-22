import React from "react";
import * as styles from "./VideoYoutube.scss"

interface VideoYoutubeProps {
    videoId: string
    title?: string
    classNames?: {
        container?: string
        frame?: string
    }
}

const VideoYoutube: React.FC<VideoYoutubeProps> = (props) => (
    <div className={styles.main}>
        <iframe
            className={styles.frame}
            src={`https://www.youtube.com/embed/${props.videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={props.title}
        />
    </div>
);

export default VideoYoutube
