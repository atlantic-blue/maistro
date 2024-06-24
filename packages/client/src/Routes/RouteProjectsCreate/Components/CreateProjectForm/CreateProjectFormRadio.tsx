import React from 'react';
import { Card, RadioGroup } from '@radix-ui/themes';

interface CreateProjectFormTextArea {
    id: string,
    value: string
    defaultValue: string
    onChange: (value: string) => void
    options: { value: string, child: React.ReactNode }[]
    valueRef: React.MutableRefObject<HTMLTextAreaElement | null>
}

const CreateProjectFormRadio: React.FC<CreateProjectFormTextArea> = (props) => {
    return (
        <RadioGroup.Root ref={props.valueRef} defaultValue={props.defaultValue} name={props.id}>
            {
                props.options.map(option => {
                    return (
                        <RadioGroup.Item
                            id={option.value}
                            value={option.value} key={option.value} m="1">
                            <Card size="2">
                                {option.child || option.value}
                            </Card>
                        </RadioGroup.Item>
                    )
                })
            }
        </RadioGroup.Root>
    )
}

export default CreateProjectFormRadio
