import React from "react"

import IconUndo from "../../../Icons/Undo/Undo"
import IconRedo from "../../../Icons/Redo/Redo"
import { Command } from "../../Wysiwyg.types"

import * as styles from "../../Wysiwyg.scss"
import { Flex, IconButton } from "@radix-ui/themes"

interface ToolbarJustifyProps {
    execCommand: (cmd: Command, args?: string | Node) => void
}

const ToolbarUndoRedo: React.FC<ToolbarJustifyProps> = (props) => {
    return (
        <div className={styles.toolbarGroup}>
            <IconButton
                type="button"
                aria-label="Undo"
                title="Undo"
                variant="ghost"
                className={styles.button}
                onClick={() => props.execCommand('undo')}>
                <IconUndo className={styles.buttonIcon} />
            </IconButton>
            <IconButton
                type="button"
                aria-label="Redo"
                title="Redo"
                variant="ghost"
                className={styles.button}
                onClick={() => props.execCommand('redo')}>
                <IconRedo className={styles.buttonIcon} />
            </IconButton>
        </div>
    )
}

export default ToolbarUndoRedo
