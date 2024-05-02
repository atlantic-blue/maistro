import React, { useRef } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Box, IconButton, Section } from '@radix-ui/themes';

import { ColourScheme } from '../../types';

import IconBold from '../Icons/Bold/Bold';
import IconItalic from '../Icons/Italic/Italic';
import IconUnderline from '../Icons/Underline/Underline';

import ToolbarJustify from './Toolbar/Justify/Justify';
import ToolBarFormatBlock from './Toolbar/FormatBlock/FormatBlock';
import ToolbarUndoRedo from './Toolbar/UndoRedo/UndoRedo';
import ToolbarColour from './Toolbar/Colour/Colour';
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
    apiRef: React.RefObject<WysiwygApi>
    onUploadFile: (file: File) => Promise<string>
}

export interface WysiwygApi {
    getContent: () => string | undefined
}

const Wysiwyg: React.FC<WysiwygProps> = (props) => {
    const editorRef = useRef<HTMLDivElement | null>(null);

    const execCommand = (command: Command, argument?: string | Node) => {
        try {
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
        } catch (error) {
            // TODO APP LEVEL ERROR
            console.log(error)
        }
    };

    React.useImperativeHandle<WysiwygApi, WysiwygApi>(props.apiRef, () => ({
        getContent: () => {
            return editorRef.current?.innerHTML;
        }
    }));

    return (
        <Box className={styles.wysiwyg}>
            {props.isEditable &&
                <div className={styles.toolbar}>

                    <ToolbarUndoRedo
                        execCommand={execCommand}
                    />

                    <ToolbarJustify
                        execCommand={execCommand}
                    />

                    <ToolBarFormatBlock
                        execCommand={execCommand}
                        editorRef={editorRef}
                    />

                    <div className={styles.toolbarGroup}>
                        <IconButton
                            type="button"
                            aria-label="Bold"
                            title="Bold"
                            variant="ghost"
                            className={styles.button}
                            onClick={() => execCommand(Command.BOLD)}>
                            <IconBold className={styles.buttonIcon} />
                        </IconButton>
                        <IconButton
                            type="button"
                            aria-label="Italic"
                            title="Italic"
                            variant="ghost"
                            className={styles.button}
                            onClick={() => execCommand(Command.ITALIC)}>
                            <IconItalic className={styles.buttonIcon} />
                        </IconButton>
                        <IconButton
                            type="button"
                            aria-label="Underline"
                            title="Underline"
                            variant="ghost"
                            className={styles.button}
                            onClick={() => execCommand(Command.UNDERLINE)}>
                            <IconUnderline className={styles.buttonIcon} />
                        </IconButton>
                    </div>

                    <ToolbarColour
                        execCommand={execCommand}
                        colourScheme={props.colourScheme}
                    />

                    <ToolbarMedia
                        editorRef={editorRef}
                        execCommand={execCommand}
                        onUploadFile={props.onUploadFile}
                    />
                </div>
            }

            <Box
                ref={editorRef}
                contentEditable={props.isEditable}
                suppressContentEditableWarning
                className={styles.editor}
            >
                {props.children}
            </Box>
        </Box>
    );
};

export default Wysiwyg;
