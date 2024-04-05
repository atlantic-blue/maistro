import React from 'react';

import * as styles from "./EditableContent.scss"

interface EditableContentProps {
    children: React.ReactNode
    onContentChange: (content: string) => void
}

const EditableContent: React.FC<EditableContentProps> = (props) => {

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = e.target.innerText
        props.onContentChange(value);
    };

    return (
        <span
            role="textbox"
            contentEditable
            suppressContentEditableWarning
            onInput={handleChange}
            className={styles.editableContent}
        >
            {props.children}
        </span>
    )
};

export default EditableContent;
