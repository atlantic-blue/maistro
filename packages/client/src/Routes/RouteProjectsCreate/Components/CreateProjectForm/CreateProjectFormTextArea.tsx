import React from 'react';
import { TextArea } from '@radix-ui/themes';

interface CreateProjectFormTextArea {
    id: string,
    value: string
    onChange: (value: string) => void
}

const CreateProjectFormTextArea: React.FC<CreateProjectFormTextArea> = (props) => {
    const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        props.onChange(e.target.value)
    }

    return (
        <>
            <TextArea
                id={props.id}
                name={props.id}
                value={props.value}
                onChange={onChange}
            />
        </>
    )
}

export default CreateProjectFormTextArea
