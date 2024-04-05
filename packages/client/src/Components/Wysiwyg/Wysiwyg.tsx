import React, { useRef } from 'react';

import { ColourScheme } from '../../types';

import IconBold from '../Icons/Bold/Bold';
import IconItalic from '../Icons/Italic/Italic';
import IconUnderline from '../Icons/Underline/Underline';

import ToolbarJustify from './Toolbar/Justify/Justify';
import ToolBarFormatBlock from './Toolbar/FormatBlock/FormatBlock';
import ToolbarUndoRedo from './Toolbar/UndoRedo/UndoRedo';
import ToolbarColour from './Toolbar/Colour/Colour';
import { BehaviorSubject } from 'rxjs';
import ToolbarMedia from './Toolbar/Media/Media';
import { Command } from './Wysiwyg.types';

import * as styles from './Wysiwyg.scss';

interface WysiwygData {
    content?: string
}

export const wysiwyg$ = new BehaviorSubject<WysiwygData>({ content: "" })

interface WysiwygProps {
    isEditable: boolean
    children: React.ReactNode
    colourScheme: ColourScheme
    apiRef: any
}

export interface WysiwygApi {
    getContent: () => string | undefined
}

const Wysiwyg: React.FC<WysiwygProps> = (props) => {
    const editorRef = useRef<HTMLDivElement | null>(null);

    const execCommand = (command: Command, argument?: string | Node) => {
        if (command === Command.CUSTOM__INSERT_NODE) {
            try {
                window?.getSelection()?.getRangeAt(0).insertNode(argument as Node)
            } catch (error) {
                editorRef.current?.prepend(argument as Node)
            }
        } else {
            document.execCommand(command, false, argument as string);
            editorRef.current?.focus()
        }
    };

    React.useImperativeHandle<WysiwygApi, WysiwygApi>(props.apiRef, () => ({
        getContent: () => {
            return editorRef.current?.innerHTML;
        }
    }));

    return (
        <div className={styles.wysiwyg}>
            {props.isEditable &&
                <div className={styles.toolbar}>

                    <ToolbarUndoRedo
                        execCommand={execCommand}
                    />

                    <div className={styles.toolbarGroup}>
                        <button
                            type="button"
                            aria-label="Bold"
                            title="Bold"
                            tabIndex={-1}
                            className={styles.button}
                            onClick={() => execCommand(Command.BOLD)}>
                            <IconBold className={styles.buttonIcon} />
                        </button>
                        <button
                            type="button"
                            aria-label="Italic"
                            title="Italic"
                            tabIndex={-1}
                            className={styles.button}
                            onClick={() => execCommand(Command.ITALIC)}>
                            <IconItalic className={styles.buttonIcon} />
                        </button>
                        <button
                            type="button"
                            aria-label="Underline"
                            title="Underline"
                            tabIndex={-1}
                            className={styles.button}
                            onClick={() => execCommand(Command.UNDERLINE)}>
                            <IconUnderline className={styles.buttonIcon} />
                        </button>
                    </div>

                    <ToolbarJustify
                        execCommand={execCommand}
                    />

                    <ToolBarFormatBlock
                        execCommand={execCommand}
                        editorRef={editorRef}
                    />


                    <ToolbarColour
                        execCommand={execCommand}
                        colourScheme={props.colourScheme}
                    />

                    <ToolbarMedia
                        editorRef={editorRef}
                        execCommand={execCommand}
                    />
                </div>
            }

            <div
                ref={editorRef}
                className={styles.editor}
                contentEditable={props.isEditable}
                suppressContentEditableWarning
            >
                {props.children}
            </div>
        </div>
    );
};

export default Wysiwyg;
