import React from "react"
import { Box, Flex, IconButton, Progress } from "@radix-ui/themes"

import CreateProjectForm, { FormQuestion } from "../CreateProjectForm/CreateProjectForm"

import * as styles from "./CreateProjectForms.scss"
import IconArrowLeft from "../../../../Components/Icons/ArrowLeft/ArrowLeft"

interface CreateProjectFormsProps {
    questions: FormQuestion[]
    onSubmit: (values: Record<string, string>) => Promise<void>
}

const CreateProjectForms: React.FC<CreateProjectFormsProps> = ({ questions, onSubmit }) => {
    const [index, setIndex] = React.useState(0)
    const progress = (index * 100) / (questions.length - 1)
    const [isLoading, setIsLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({})

    const onPrevClick = () => {
        if (index <= 0) {
            return
        }

        setIndex(index - 1)
    }

    return (
        <Box width="100%">
            {progress ? <Progress value={progress} color="orange" /> : null}
            <Flex direction="column" gap="3" m="20px" justify="center" align="center">
                {index > 0 && (
                    <IconButton onClick={onPrevClick} variant="ghost" className={styles.button}>
                        <IconArrowLeft className={styles.icon} />
                    </IconButton>
                )}

                <CreateProjectForm
                    type={questions[index].type}
                    options={questions[index].options}
                    id={questions[index].id}
                    initialValues={questions[index].initialValues}
                    title={questions[index].title}
                    subTitle={questions[index].subTitle}
                    validationSchema={questions[index].validationSchema}
                    cta={index === questions.length - 1 ? "Submit" : "Next"}
                    isLoading={isLoading}
                    onSubmit={async values => {
                        try {
                            setIsLoading(true)
                            setFormData(prev => {
                                return {
                                    ...prev,
                                    ...values
                                }
                            })
                            if (index < questions.length - 1) {
                                setIndex(index + 1)
                            } else {
                                await onSubmit({
                                    ...formData,
                                    ...values,
                                })
                            }
                        } catch (error) {
                            // TODO app level error
                            console.error(error)
                        } finally {
                            setIsLoading(false)
                        }
                    }}
                />
            </Flex>
        </Box>
    )
}

export default CreateProjectForms
