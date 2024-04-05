import React from "react"

import useClickOutside from "../../../../../Utils/Hooks/UseClickOutside"

import IconVideo from "../../../../Icons/Video/Video"
import ToolbarJustify from "../../Justify/Justify"
import { Command } from "../../../Wysiwyg.types"

import * as styles from "../Media.scss"
import * as wysiwygStyles from "../../../Wysiwyg.scss"
import EditableVideo from "../../../../Editable/EditableVideo/EditableVideo"


interface ToolbarToolbarMediaVideoProps {
    editorRef: React.MutableRefObject<HTMLDivElement | null>
    execCommand: (cmd: Command, args?: string | Node) => void
}

const TOOLBAR_MEDIA_VIDEO = "ToolbarMedia-video"

const ToolbarMediaVideo: React.FC<ToolbarToolbarMediaVideoProps> = (props) => {
    const [currentMedia, setCurrentMedia] = React.useState<HTMLSourceElement | null>(null)
    const ref = React.useRef(null)

    useClickOutside({
        ref,
        onClickOutside() {
            setCurrentMedia(null)
        },
    })

    React.useEffect(() => {
        const handleClick = (event) => {
            const { target } = event;
            if (!['VIDEO'].includes(target.tagName)) {
                return
            }
            setCurrentMedia(event.target)
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [])

    const onInsertImage: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!event?.target?.files) {
            return
        }

        const file = event?.target?.files[0];
        const objectUrl = URL.createObjectURL(file);

        const videoSource = document.createElement("source");
        videoSource.src = objectUrl
        videoSource.type = "video/mp4"

        const div = document.createElement('div');
        div.className = styles.mediaContainer;
        div.addEventListener('click', () => {
            setCurrentMedia(videoSource)
        });

        const video = document.createElement("video");
        video.className = styles.mediaVideo;
        video.controls = true

        div.appendChild(video)
        video.appendChild(videoSource)

        props.execCommand(Command.CUSTOM__INSERT_NODE, div)
    };

    const onSizeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!currentMedia) {
            return
        }
        currentMedia.style.width = `${e.target.value}px`

    }

    const justifyContent = (cmd: Command) => {
        if (!currentMedia) {
            return
        }

        let style = "auto"

        if (cmd === Command.JUSTIFY_LEFT) {
            style = "0 auto 0 0"
        }


        if (cmd === Command.JUSTIFY_RIGHT) {
            style = "0 0 0 auto"
        }

        currentMedia.style.margin = style
    }

    const onVideoChange = (src: string) => {
        if (!currentMedia) {
            return
        }

        currentMedia.src = src
    }

    return (
        <div className={styles.section}>
            <input id={TOOLBAR_MEDIA_VIDEO} type="file" accept="video/*" onChange={onInsertImage} style={{ display: 'none' }} />
            <button className={wysiwygStyles.button} type="button">
                <label htmlFor={TOOLBAR_MEDIA_VIDEO}>
                    <IconVideo className={wysiwygStyles.buttonIcon} />
                </label>
            </button>
            {currentMedia && (
                <div className={styles.options} ref={ref}>
                    <div className={styles.optionsContainer}>
                        <div className={styles.optionsPreview}>
                            <EditableVideo
                                defaultVideo={currentMedia.src}
                                onChange={onVideoChange}
                            />
                        </div>

                        <ToolbarJustify
                            execCommand={justifyContent}
                        />

                        <input
                            className={styles.optionsInput}
                            type="range"
                            defaultValue={currentMedia.width}
                            onChange={onSizeChange}
                            min={0}
                            max={1080}
                        />

                    </div>
                </div>
            )}
        </div>
    )
}

export default ToolbarMediaVideo


