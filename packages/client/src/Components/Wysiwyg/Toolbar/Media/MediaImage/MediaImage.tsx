import React from "react"

import useClickOutside from "../../../../../Utils/Hooks/UseClickOutside"

import IconImage from "../../../../Icons/Image/Image"
import { Command } from "../../../Wysiwyg.types"
import ToolbarJustify from "../../Justify/Justify"

import * as styles from "../Media.scss"
import * as wysiwygStyles from "../../../Wysiwyg.scss"
import EditorImage from "../../../../Editor/EditorImage"
import { EditorDataType } from "../../../../Editor/EditorData"
import { Box, Card, Flex, IconButton, Slider, Spinner } from "@radix-ui/themes"

interface ToolbarToolbarMediaImageProps {
    editorRef: React.MutableRefObject<HTMLDivElement | null>
    execCommand: (cmd: Command, args?: string | Node) => void
    onUploadFile: (file: File) => Promise<string>
}

const TOOLBAR_MEDIA_IMAGE = "ToolbarMedia-image"

const ToolbarMediaImage: React.FC<ToolbarToolbarMediaImageProps> = (props) => {
    const ref = React.useRef(null)
    const [currentMedia, setCurrentMedia] = React.useState<HTMLImageElement | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)

    useClickOutside({
        ref,
        onClickOutside() {
            setCurrentMedia(null)
        },
    })

    React.useEffect(() => {
        const handleClick = (event) => {
            const { target } = event;
            if (!['IMG'].includes(target.tagName)) {
                return
            }
            setCurrentMedia(event.target)
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [])

    const getCurrentMedia = (): HTMLImageElement | undefined => {
        if (!currentMedia) {
            return
        }

        return currentMedia
    }

    const onInsertImage: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        if (!event?.target?.files) {
            return
        }
        try {
            setIsLoading(true)
            const file = event?.target?.files[0];
            const src = await props.onUploadFile(file)

            const img = document.createElement('img');
            img.src = src
            img.className = styles.media;

            const div = document.createElement('div');
            div.appendChild(img)

            props.execCommand(Command.CUSTOM__INSERT_NODE, div)
        } catch (error) {
            // TODO app level error
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    };

    const onSizeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const element = getCurrentMedia()
        if (!element) {
            return
        }
        element.style.width = `${e.target.value}px`
    }

    const justifyContent = (cmd: Command) => {
        const element = getCurrentMedia()
        if (!element) {
            return
        }

        let style = "auto"

        if (cmd === Command.JUSTIFY_LEFT) {
            style = "0 auto 0 0"
        }


        if (cmd === Command.JUSTIFY_RIGHT) {
            style = "0 0 0 auto"
        }

        element.style.margin = style
    }

    // TODO: HACK!
    const onImageChange = (src: string) => {
        const element = getCurrentMedia()
        if (!element) {
            return
        }

        element.src = src
        setCurrentMedia(element)
    }

    return (
        <div className={styles.section}>
            <IconButton
                className={wysiwygStyles.button}
                type="button"
                variant="ghost"
            >
                <label htmlFor={TOOLBAR_MEDIA_IMAGE}>
                    {!isLoading ?
                        (
                            <IconImage className={wysiwygStyles.buttonIcon} />
                        ) :
                        (
                            < Spinner />
                        )
                    }
                    <input
                        id={TOOLBAR_MEDIA_IMAGE}
                        type="file"
                        accept="image/*"
                        onChange={onInsertImage}
                        style={{ display: 'none' }}
                    />
                </label>
            </IconButton>

            {currentMedia && (
                <Card className={styles.options} ref={ref}>
                    <Box className={styles.optionsPreview}>
                        <EditorImage
                            name="Image"
                            type={EditorDataType.IMAGE}
                            value={currentMedia.src}
                            onChange={onImageChange}
                            onUploadFile={props.onUploadFile}
                        />
                    </Box>

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
                </Card>
            )}
        </div>
    )
}

export default ToolbarMediaImage
