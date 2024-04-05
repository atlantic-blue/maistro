import React from "react"

import useClickOutside from "../../../../../Utils/Hooks/UseClickOutside"

import IconImage from "../../../../Icons/Image/Image"
import { Command } from "../../../Wysiwyg.types"
import ToolbarJustify from "../../Justify/Justify"
import EditableImage from "../../../../Editable/EditableImage/EditableImage"

import * as styles from "../Media.scss"
import * as wysiwygStyles from "../../../Wysiwyg.scss"

interface ToolbarToolbarMediaImageProps {
    editorRef: React.MutableRefObject<HTMLDivElement | null>
    execCommand: (cmd: Command, args?: string | Node) => void
}

const TOOLBAR_MEDIA_IMAGE = "ToolbarMedia-image"

const ToolbarMediaImage: React.FC<ToolbarToolbarMediaImageProps> = (props) => {
    const ref = React.useRef(null)
    const [currentMedia, setCurrentMedia] = React.useState<HTMLImageElement | null>(null)

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

    const onInsertImage: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!event?.target?.files) {
            return
        }

        const file = event?.target?.files[0];
        const objectUrl = URL.createObjectURL(file);

        const img = document.createElement('img');
        img.src = objectUrl
        img.className = styles.media;

        const div = document.createElement('div');
        div.appendChild(img)

        props.execCommand(Command.CUSTOM__INSERT_NODE, div)
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
            <input id={TOOLBAR_MEDIA_IMAGE} type="file" accept="image/*" onChange={onInsertImage} style={{ display: 'none' }} />
            <button className={wysiwygStyles.button} type="button">
                <label htmlFor={TOOLBAR_MEDIA_IMAGE}>
                    <IconImage className={wysiwygStyles.buttonIcon} />
                </label>
            </button>
            {currentMedia && (

                <div className={styles.options} ref={ref}>
                    <div className={styles.optionsContainer}>
                        <div className={styles.optionsPreview}>
                            <EditableImage
                                className={styles.optionsPreviewImg}
                                defaultImage={currentMedia.src}
                                onChange={onImageChange}
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

export default ToolbarMediaImage
