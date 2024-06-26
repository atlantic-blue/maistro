import * as yup from 'yup';
import * as styles from "./CreateProjectForm.scss"
import React from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Box, Button, Callout, Flex, TextArea, Text, Heading, RadioGroup, TextField } from '@radix-ui/themes';
import classNames from 'classnames';

export interface FormQuestion {
    id: string;
    title: string;
    subTitle?: string;
    validationSchema: yup.ObjectSchema<Partial<{
        [key: string]: string;
    }>, yup.AnyObject, {
        [key: string]: undefined;
    }, "">;
    initialValues: Record<string, string>
    type?: "input" | "textarea" | "radio"
    options?: { value: string, child: React.ReactNode | React.FC }[]
    Component?: React.FC
    nextId?: string
}

interface FormPropsTextArea extends FormQuestion {
    type: "textarea" | "input"
    isLoading: boolean
    cta: string;
    onSubmit: (values: Record<string, string>) => void
}

interface FormPropsRadio extends FormQuestion {
    type: "radio"
    isLoading: boolean
    cta: string;
    onSubmit: (values: Record<string, string>) => void
    options: { value: string, child: React.ReactNode }[]
    defaultValue: string
}

type FormProps = FormQuestion & (FormPropsRadio | FormPropsTextArea)

const CreateProjectForm: React.FC<FormProps> = (props) => {
    const valueRef = React.useRef<HTMLTextAreaElement | HTMLDivElement | null>(null)
    const [value, setValue] = React.useState<Record<string, string>>({})
    const [error, setError] = React.useState("")

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()

        if (!(value[props.id] || valueRef?.current)) {
            setError(`value is required`)
            return
        }

        props.onSubmit({
            [props.id]: value[props.id] || valueRef?.current?.value
        })
        setError("")
    }

    const onChange = (value: string) => {
        if (!value) {
            setError(`value is required`)
            return
        }

        setValue(prev => {
            return {
                ...prev,
                [props.id]: value
            }
        })
        setError("")
    }

    const Body = () => {
        switch (props.type) {
            case "radio":
                return (
                    <RadioGroup.Root size="3" onChange={e => onChange(e.target.value)} required>
                        {
                            props.options.map(option => {
                                return (
                                    <RadioGroup.Item
                                        id={option.value}
                                        value={option.value}
                                        key={option.value}
                                        m="1"
                                        required
                                        className={classNames(styles.radioItem, {
                                            [styles.radioItemSelected]: value[props.id] === option.value
                                        })}
                                    >
                                        {(React.isValidElement(option.child) ? option.child : <option.child />) || option.value}
                                    </RadioGroup.Item>
                                )
                            })
                        }
                    </RadioGroup.Root>
                )
            case "input":
                return (
                    <TextField.Root
                        id={props.id}
                        name={props.id}
                        ref={valueRef}
                        size="2"
                        required
                    />
                )
            case "textarea":
                return (
                    <TextArea
                        id={props.id}
                        name={props.id}
                        ref={valueRef}
                        rows={3}
                        required
                        maxLength={200}
                    />
                )
            default:
                return (
                    <props.Component onChange={onChange} value={value[props.id]}/>
                )
        }
    }

    return (
        <div key={props.id} className={styles.card}>
            <form onSubmit={onSubmit}>
                <Flex direction="column" justify="center" gap="3" minWidth="350px" maxWidth="600px" m="auto">
                    <Heading
                        as="h1"
                        align="center"
                        wrap="pretty"
                        size="9"
                        mb="3"
                        className={styles.heading}
                    >
                        {props.title}
                    </Heading>

                    <Text size="6">
                        {props.subTitle}
                    </Text>

                    <Box>
                        <Body />
                        {Boolean(error) && (
                            <Callout.Root color="red" size="1">
                                <Callout.Icon>
                                    <InfoCircledIcon />
                                </Callout.Icon>
                                <Callout.Text>
                                    {error}
                                </Callout.Text>
                            </Callout.Root>
                        )}
                    </Box>
                    <Button type="submit" loading={props.isLoading}>
                        {props.cta}
                    </Button>
                </Flex>
            </form>
        </div>
    )
}

export default CreateProjectForm
