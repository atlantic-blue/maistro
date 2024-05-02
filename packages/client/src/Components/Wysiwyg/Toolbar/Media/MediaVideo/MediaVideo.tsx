import React from "react"

import useClickOutside from "../../../../../Utils/Hooks/UseClickOutside"

import IconVideo from "../../../../Icons/Video/Video"
import ToolbarJustify from "../../Justify/Justify"
import { Command } from "../../../Wysiwyg.types"

import * as styles from "../Media.scss"
import * as wysiwygStyles from "../../../Wysiwyg.scss"
import { Box, Card, IconButton, Spinner } from "@radix-ui/themes"
import EditorVideo from "../../../../Editor/EditorVideo"
import { EditorDataType } from "../../../../Editor/EditorData"


interface ToolbarToolbarMediaVideoProps {
    editorRef: React.MutableRefObject<HTMLDivElement | null>
    execCommand: (cmd: Command, args?: string | Node) => void
    onUploadFile: (file: File) => Promise<string>
}

const TOOLBAR_MEDIA_VIDEO = "ToolbarMedia-video"

const ToolbarMediaVideo: React.FC<ToolbarToolbarMediaVideoProps> = (props) => {
    const [currentMedia, setCurrentMedia] = React.useState<HTMLSourceElement | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)

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

    const onInsertVideo: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        if (!event?.target?.files) {
            return
        }

        try {
            const file = event?.target?.files[0];
            const src = await props.onUploadFile(file)

            const videoSource = document.createElement("source");
            videoSource.src = src
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
        } catch (error) {
            // TODO app level error
            console.log(error)
        } finally {
            setIsLoading(false)
        }

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
            <IconButton className={wysiwygStyles.button} type="button">
                <label htmlFor={TOOLBAR_MEDIA_VIDEO}>
                    {
                        !isLoading ? (
                            <IconVideo className={wysiwygStyles.buttonIcon} />
                        ) : (
                            <Spinner />
                        )
                    }
                </label>
                <input
                    id={TOOLBAR_MEDIA_VIDEO}
                    type="file"
                    accept="video/*"
                    onChange={onInsertVideo}
                    style={{ display: 'none' }}
                />
            </IconButton>
            {currentMedia && (
                <Card className={styles.options} ref={ref}>
                    <Box className={styles.optionsContainer}>
                        <div className={styles.optionsPreview}>
                            <EditorVideo
                                name="Video"
                                type={EditorDataType.VIDEO}
                                value={currentMedia.src}
                                onChange={onVideoChange}
                                onUploadFile={props.onUploadFile}
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

                    </Box>
                </Card>
            )}
        </div>
    )
}

export default ToolbarMediaVideo


