import React from 'react';
import { useFormik } from 'formik';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Box, Button, Callout, Card, Flex, TextArea, Text } from '@radix-ui/themes';
import * as yup from 'yup';
import * as styles from "./CreateProjectForm.scss"

export interface FormQuestion {
    id: string;
    title: string;
    validationSchema: yup.ObjectSchema<Partial<{
        [key: string]: string;
    }>, yup.AnyObject, {
        [key: string]: undefined;
    }, "">;
    initialValues: Record<string, string>
}

interface FormProps extends FormQuestion {
    isLoading: boolean
    cta: string;
    onSubmit: (values: Record<string, string>) => void
}

const CreateProjectForm: React.FC<FormProps> = (props) => {
    const formik = useFormik({
        initialValues: props.initialValues,
        validationSchema: props.validationSchema,
        onSubmit: props.onSubmit
    });

    return (
        <Card key={props.id} className={styles.card}>
            <form onSubmit={formik.handleSubmit}>
                <Flex direction="column" justify="center" gap="3" minWidth="300px" maxWidth="800px" m="auto">
                    <Text
                        align="center"
                    >
                        {props.title}
                    </Text>

                    <Box>
                        <TextArea
                            id={props.id}
                            name={props.id}
                            value={formik.values[props.id]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </Box>

                    {Boolean(formik.errors[props.id]) && (
                        <Callout.Root color="red" size="1">
                            <Callout.Icon>
                                <InfoCircledIcon />
                            </Callout.Icon>
                            <Callout.Text>
                                {formik.errors[props.id]}
                            </Callout.Text>
                        </Callout.Root>
                    )}
                    <Button type="submit" loading={props.isLoading}>
                        {props.cta}
                    </Button>
                </Flex>
            </form>
        </Card>
    )
}

export default CreateProjectForm
