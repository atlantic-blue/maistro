import React from "react"

import IconJustifyLeft from "../../../Icons/JustifyLeft/JustifyLeft"
import IconJustifyCenter from "../../../Icons/JustifyCenter/JustifyCenter"
import IconJustifyRight from "../../../Icons/JustifyRight/JustifyRight"
import IconJustify from "../../../Icons/Justify/Justify"

import { Command } from "../../Wysiwyg.types"

import * as styles from "../../Wysiwyg.scss"

interface ToolbarJustifyProps {
    execCommand: (cmd: Command) => void
}

const ToolbarJustify: React.FC<ToolbarJustifyProps> = (props) => {
    return (
        <div className={styles.toolbarGroup}>
            <button
                type="button"
                aria-label="Justify Left"
                title="Justify Left"
                tabIndex={-1}
                className={styles.button}
                onClick={() => props.execCommand(Command.JUSTIFY_LEFT)}>
                <IconJustifyLeft className={styles.buttonIcon} />
            </button>
            <button
                type="button"
                aria-label="Justify Center"
                title="Justify Center"
                tabIndex={-1}
                className={styles.button}
                onClick={() => props.execCommand(Command.JUSTIFY_CENTER)}>
                <IconJustifyCenter className={styles.buttonIcon} />
            </button>
            <button
                type="button"
                aria-label="Justify Right"
                title="Justify Right"
                tabIndex={-1}
                className={styles.button}
                onClick={() => props.execCommand(Command.JUSTIFY_RIGHT)}>
                <IconJustifyRight className={styles.buttonIcon} />
            </button>
            <button
                type="button"
                aria-label="Justify"
                title="Justify"
                tabIndex={-1}
                className={styles.button}
                onClick={() => props.execCommand(Command.JUSTIFY)}>
                <IconJustify className={styles.buttonIcon} />
            </button>
        </div>
    )
}

export default ToolbarJustify
