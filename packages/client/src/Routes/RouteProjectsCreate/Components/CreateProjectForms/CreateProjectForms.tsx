import React from "react"
import { Box, Flex, IconButton, Progress } from "@radix-ui/themes"

import CreateProjectForm, { FormQuestion } from "../CreateProjectForm/CreateProjectForm"
import IconArrowRight from "../../../../Components/Icons/ArrowRight/ArrowRight"

import * as styles from "./CreateProjectForms.scss"
import IconArrowLeft from "../../../../Components/Icons/ArrowLeft/ArrowLeft"

interface CreateProjectFormsProps {
    questions: FormQuestion[]
    onSubmit: (currentId: string, values: Record<string, string>) => Promise<void>
}

const CreateProjectForms: React.FC<CreateProjectFormsProps> = ({ questions, onSubmit }) => {
    const [index, setIndex] = React.useState(0)
    const progress = (index * 100) / (questions.length - 1)
    const [isLoading, setIsLoading] = React.useState(false)

    const onPrevClick = () => {
        if (index <= 0) {
            return
        }

        setIndex(index - 1)
    }

    return (
        <Box width="100%">
            <Progress value={progress} color="cyan" />
            <Flex direction="column" gap="3" m="20px" justify="center" align="center">
                {index > 0 && (
                    <IconButton onClick={onPrevClick} variant="ghost" className={styles.button}>
                        <IconArrowLeft className={styles.icon} />
                    </IconButton>
                )}

                <CreateProjectForm
                    {...questions[index]}
                    cta={index === questions.length - 1 ? "Submit" : "Next"}
                    isLoading={isLoading}
                    onSubmit={async values => {
                        try {
                            setIsLoading(true)
                            await onSubmit(
                                questions[index].id,
                                values
                            )

                            if (index < questions.length - 1) {
                                setIndex(index + 1)
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
