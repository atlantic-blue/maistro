import React from 'react';
import EditableContent from '../../../Editable/EditableContent/EditableContent';

interface TitleProps {
    edit?: boolean
    title: string
    onChange: (content: string) => void
}

const Title: React.FC<TitleProps> = (props) => {
    if (props.edit) {
        return (
            <h1>
                <EditableContent
                    onContentChange={props.onChange}
                >
                    {props.title}
                </EditableContent>
            </h1>
        )
    }

    return (
        <h1>
            {props.title}
        </h1>
    )
}

export default Title
