import React from "react"

import { Command } from "../../Wysiwyg.types"

import { ColourScheme } from "../../../../types"

import classNames from "classnames"
import IconColourText from "../../../Icons/ColourText/ColourText"
import IconColourBackground from "../../../Icons/ColourBackground/ColourBackground"
import useClickOutside from "../../../../Utils/Hooks/UseClickOutside"

import * as styles from "./Colour.scss"
import * as WysiwygStyles from "../../Wysiwyg.scss"

interface ToolbarJustifyProps {
    colourScheme: ColourScheme
    execCommand: (cmd: Command, args?: string | Node) => void
}

const ToolbarColourGrid: React.FC<{ palette: string[]; onChange: (colour: string) => void }> = (props) => {
    return (
        <div className={styles.grid}>
            {props.palette.map(colour => {
                return (
                    <div
                        key={colour}
                        style={{ backgroundColor: colour }}
                        className={styles.gridColour}
                        onClick={() => props.onChange(colour)}
                        title={`Apply ${colour}`}
                    >
                    </div>
                )
            })}
            <div className={classNames(styles.colourPicker, styles.gridColour)}>
                <input
                    type="color"
                    id="ToolbarColour-backgroundColour"
                    title={`Apply any colour`}
                    className={styles.gridColour}
                    onChange={(e) => props.onChange(e.target.value)}
                />
            </div>
            <div
                style={{ backgroundColor: 'transparent' }}
                className={classNames(styles.gridColour, styles.crossed)}
                onClick={() => props.onChange('transparent')}
                title={`Apply transparent`}
            >
            </div>
        </div>
    )
}

const ToolbarColour: React.FC<ToolbarJustifyProps> = (props) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const [textColourGridVisible, setTextColourGridVisible] = React.useState(false)
    const [bgColourGridVisible, setBgColourGridVisible] = React.useState(false)

    useClickOutside({
        ref,
        onClickOutside() {
            setBgColourGridVisible(false)
            setTextColourGridVisible(false)
        },
    })

    const onClickButtonTextColour = () => {
        setTextColourGridVisible(!textColourGridVisible)
        setBgColourGridVisible(false)
    }

    const onClickButtonBgColour = () => {
        setBgColourGridVisible(!bgColourGridVisible)
        setTextColourGridVisible(false)
    }

    const changeColour = (colour: string) => {
        props.execCommand(Command.COLOUR, colour)
    }

    const changeBackgroundColour = (colour: string) => {
        props.execCommand(Command.BACKGROUND_COLOUR, colour)
    }

    return (
        <div className={WysiwygStyles.toolbarGroup} ref={ref}>
            <div className={styles.section}>
                <button className={WysiwygStyles.button} onClick={onClickButtonTextColour}>
                    <IconColourText className={WysiwygStyles.buttonIcon} />
                </button>
                {textColourGridVisible && <ToolbarColourGrid
                    onChange={changeColour}
                    palette={[
                        props.colourScheme.text,
                        props.colourScheme.neutral,
                        props.colourScheme.accent,
                        props.colourScheme.primary,
                        props.colourScheme.secondary,
                    ]}
                />}
            </div>
            <div className={styles.section}>
                <button className={WysiwygStyles.button} onClick={onClickButtonBgColour}>
                    <IconColourBackground className={WysiwygStyles.buttonIcon} />
                </button>
                {bgColourGridVisible && <ToolbarColourGrid
                    onChange={changeBackgroundColour}
                    palette={props.colourScheme.palette}
                />}
            </div>
        </div>
    )
}

export default ToolbarColour
