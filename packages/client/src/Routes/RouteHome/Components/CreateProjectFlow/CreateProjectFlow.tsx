import React from "react"
import * as yup from 'yup';
import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Users, CalendarCheck, Headset, FileSymlink, ShoppingCart } from 'lucide-react';

import { FormQuestion } from "../../../RouteProjectsCreate/Components/CreateProjectForm/CreateProjectForm"
import CreateProjectForms from "../../../RouteProjectsCreate/Components/CreateProjectForms/CreateProjectForms"

import * as styles from "./CreateProjectFlow.scss"
import { useNavigate } from "react-router";
import { appRoutes } from "../../../router";

enum CreateProjectFlowId {
    DESCRIPTION = "description",
    GOAL = "goal",
}

enum ProjectGoalType {
    SELL = "SELL",
    GROW = "GROW",
    REDIRECT = "REDIRECT",
    CONTACT = "CONTACT",
    SCHEDULE = "SCHEDULE"
}

const projectFlowQuestions: FormQuestion[] = [
    {
        id: CreateProjectFlowId.DESCRIPTION,
        title: "Create Your Dream Website in Minutes",
        subTitle: "What business would you like to create?",
        validationSchema: yup.object({
            [CreateProjectFlowId.DESCRIPTION]: yup
                .string()
                .required('Business description is required'),
        }),
        initialValues: {
            [CreateProjectFlowId.DESCRIPTION]: '',
        },
        type: "textarea",
    },
    {
        type: "radio",
        id: CreateProjectFlowId.GOAL,
        title: "What is our main focus?",
        validationSchema: yup.object({
            [CreateProjectFlowId.GOAL]: yup
                .string()
                .required('Business goal is required'),
        }),
        initialValues: {
            [CreateProjectFlowId.GOAL]: '',
        },
        options: [
            {
                value: ProjectGoalType.SELL,
                child: (
                    <Card className={styles.card}>
                        <Flex gap="2" align="center">
                            <ShoppingCart />
                            <Box>
                                <Heading className={styles.cardTitle}>
                                    E-commerce
                                </Heading>
                                <Text>Sell your products online</Text>
                            </Box>
                        </Flex>
                    </Card>
                )
            },
            {
                value: ProjectGoalType.GROW,
                child: (
                    <Card className={styles.card}>
                        <Flex gap="2" align="center">
                            <Users />
                            <Box>
                                <Heading className={styles.cardTitle}>
                                    Collect subscribers
                                </Heading>
                                <Text>Grow your user base</Text>
                            </Box>
                        </Flex>
                    </Card>
                )
            },
            {
                value: ProjectGoalType.REDIRECT,
                child: (
                    <Card className={styles.card}>
                        <Flex gap="2" align="center">
                            <FileSymlink />
                            <Box>
                                <Heading className={styles.cardTitle}>
                                    Link to an existing site
                                </Heading>
                                <Text>Redirect to your product</Text>
                            </Box>
                        </Flex>
                    </Card>
                )
            },
            {
                value: ProjectGoalType.CONTACT,
                child: (
                    <Card className={styles.card}>
                        <Flex gap="2" align="center">
                            <Headset />
                            <Box>
                                <Heading className={styles.cardTitle}>
                                    Get Contacted
                                </Heading>
                                <Text>Get customers to call you</Text>
                            </Box>
                        </Flex>
                    </Card>
                )
            },
            {
                value: ProjectGoalType.SCHEDULE,
                child: (
                    <Card className={styles.card}>
                        <Flex gap="2" align="center">
                            <CalendarCheck />
                            <Box>
                                <Heading className={styles.cardTitle}>
                                    Schedule appointments
                                </Heading>
                                <Text>Book a appointments in your calendar</Text>
                            </Box>
                        </Flex>
                    </Card>
                )
            }
        ]
    },
]

const CreateProjectFlow: React.FC = () => {
    const navigate = useNavigate()

    const onSubmit = async (state: Record<string, string>) => {
        const params = new URLSearchParams()
        Object.keys(state).forEach(key => {
            params.set(key, state[key])
        })

        navigate(`${appRoutes.getBrainstormRoute()}?${params.toString()}`)
    }

    return (
        <>
            <CreateProjectForms
                questions={projectFlowQuestions}
                onSubmit={onSubmit}
            />
        </>
    )
}

export default CreateProjectFlow
