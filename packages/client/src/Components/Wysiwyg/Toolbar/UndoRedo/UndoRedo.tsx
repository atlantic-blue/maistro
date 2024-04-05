import React from "react"

import IconUndo from "../../../Icons/Undo/Undo"
import IconRedo from "../../../Icons/Redo/Redo"
import { Command } from "../../Wysiwyg.types"

import * as styles from "../../Wysiwyg.scss"

interface ToolbarJustifyProps {
    execCommand: (cmd: Command, args?: string | Node) => void
}

const ToolbarUndoRedo: React.FC<ToolbarJustifyProps> = (props) => {
    return (
        <div className={styles.toolbarGroup}>
            <button
                type="button"
                aria-label="Undo"
                title="Undo"
                tabIndex={-1}
                className={styles.button}
                onClick={() => props.execCommand('undo')}>
                <IconUndo className={styles.buttonIcon} />
            </button>
            <button
                type="button"
                aria-label="Redo"
                title="Redo"
                tabIndex={-1}
                className={styles.button}
                onClick={() => props.execCommand('redo')}>
                <IconRedo className={styles.buttonIcon} />
            </button>
        </div>
    )
}

export default ToolbarUndoRedo
