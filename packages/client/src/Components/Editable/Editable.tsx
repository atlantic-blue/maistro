import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser'
import classNames from 'classnames';
import { interval } from "rxjs"

import { PageContext } from '../../PageContext';
import { PageContentMessageType, PageMessageType } from '../../types';
import useClickOutside from '../../Utils/Hooks/UseClickOutside';
import ProjectContent from '../../Store/ProjectContent';

import IconEdit from '../Icons/Edit/Edit';
import IconSave from '../Icons/Save/Save';
import Wysiwyg, { WysiwygApi } from '../Wysiwyg/Wysiwyg';

import { ProjectsContext } from '../../Projects';
import { useParams } from 'react-router-dom';
import * as styles from "./Editable.scss"

interface EditableContent {
    content: ProjectContent;
}

const EditableContent: React.FC<EditableContent> = ({ content }) => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const page = project.getPageById(pageId || "")

    const ref = React.useRef<HTMLDivElement>(null)
    const editorApiRef = React.useRef<WysiwygApi>(null);
    const [isEditable, setIsEditable] = useState(false);

    useClickOutside({
        ref,
        onClickOutside() {
            setIsEditable(false);
        },
    })

    useEffect(() => {
        const subs = interval(1000 * 5).subscribe(() => {
            saveContent()
        })

        return () => {
            subs.unsubscribe()
        }
    }, [])

    const onClick = () => {
        setIsEditable(true);
    }

    const saveContent = () => {
        const input = editorApiRef?.current?.getContent()
        if (!input) {
            return
        }

        content.event$.next({
            type: PageContentMessageType.SET_COMPONENT,
            data: () => parse(input)
        })
    }

    const toggleEditMode = () => {
        setIsEditable(!isEditable);
        saveContent()
    };

    const onEditSectionClick = () => {
        page.event$.next({
            type: PageMessageType.SET_CONTENT_ID_ACTIVE,
            data: content
        })
    }

    const Component = content.Component()
    return (
        <div
            ref={ref}
            onMouseLeave={() => {
                saveContent()
            }}
            className={classNames(styles.editableContent, {
                [styles.editableContentIsEditable]: isEditable,
            })}
        >
            {isEditable && (
                <div className={styles.buttonSection}>
                    {/** TODO change button styles */}
                    <button onClick={onEditSectionClick} className={styles.button}>
                        <span className={styles.buttonText}>Edit Section</span>
                        <span><IconEdit className={styles.buttonIcon} /></span>
                    </button>
                    <button onClick={toggleEditMode} className={styles.button}>
                        {isEditable ? (
                            <>
                                <span className={styles.buttonText}>Save</span>
                                <span><IconSave className={styles.buttonIcon} /></span>
                            </>
                        ) :
                            (
                                <>
                                    <span className={styles.buttonText}>Edit Content</span>
                                    <span><IconEdit className={styles.buttonIcon} /></span>
                                </>
                            )
                        }
                    </button>
                </div>
            )}

            <div
                onClick={onClick}
            >
                <Wysiwyg
                    isEditable={isEditable}
                    apiRef={editorApiRef}
                >
                    <Component {...content.getProps() as any} />
                </Wysiwyg>

            </div>
        </div>
    );
};

export default EditableContent;