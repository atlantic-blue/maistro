import { Box, Card, Checkbox, Container, Flex, Heading, Section, Skeleton, Text } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import * as yup from 'yup';
import json5 from "json5"

import { FormQuestion } from '../CreateProjectForm/CreateProjectForm';
import CreateProjectForms from '../CreateProjectForms/CreateProjectForms';
import { createUrl } from '../../../../Utils/url';
import { ApiContext } from '../../../../Api/ApiProvider';
import { ProjectsContext } from '../../../../Projects';
import { ProjectsCreateOutput } from '../../../../Api/Projects/projectsCreate';
import { Project } from '../../../../Store/Project';
import { PageMessageType, ProjectMessageType, ProjectThreadMessageRole, ProjectsMessageType } from '../../../../types';
import { TemplateCategory, TemplateComponentType } from '../../../../Templates/templateTypes';
import env from '../../../../env';
import { appRoutes } from '../../../router';
import { PaymentsContext, canUseFeature } from '../../../../Payments/PaymentsProvider';
import createImagePrompt from '../../../../Ai/prompts/SectionHeroImage';
import { CalendarCheck, FileSymlink, Headset, ShoppingCart, Users } from 'lucide-react';

import * as styles from "./CreateProjectFlow.scss"
import { fromMarkdown } from 'mdast-util-from-markdown';
import brainstormPrompt from '../../../RouteBrainstorm/prompt';

enum CreateProjectFlowId {
    NAME = "name",
    EMOTION = "emotion",
    DESCRIPTION = "description",
    TARGET_AUDIENCE = "targetAudience",
    BENEFITS = "benefits",
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
        id: CreateProjectFlowId.NAME,
        title: "What is the name of your product or service?",
        validationSchema: yup.object({
            [CreateProjectFlowId.NAME]: yup
                .string()
                .required('Project name is required'),
        }),
        initialValues: {
            [CreateProjectFlowId.NAME]: '',
        },
        type: "textarea"
    },
    {
        id: CreateProjectFlowId.EMOTION,
        title: "What tone or emotion should your product or survey convey?",
        validationSchema: yup.object({
            [CreateProjectFlowId.EMOTION]: yup
                .string()
        }),
        initialValues: {
            [CreateProjectFlowId.EMOTION]: '',
        },
        type: "textarea"
    },
    {
        id: CreateProjectFlowId.TARGET_AUDIENCE,
        title: "Who is your target audience?",
        validationSchema: yup.object({
            [CreateProjectFlowId.TARGET_AUDIENCE]: yup
                .string()
        }),
        initialValues: {
            [CreateProjectFlowId.TARGET_AUDIENCE]: '',
        },
        type: "textarea"
    },
    {
        id: CreateProjectFlowId.DESCRIPTION,
        title: "Can you describe your product or service in one sentence?",
        validationSchema: yup.object({
            [CreateProjectFlowId.DESCRIPTION]: yup
                .string()
        }),
        initialValues: {
            [CreateProjectFlowId.DESCRIPTION]: '',
        },
        type: "textarea"
    },
    {
        id: CreateProjectFlowId.BENEFITS,
        title: "What is the single most compelling benefit of your product or service?",
        validationSchema: yup.object({
            [CreateProjectFlowId.BENEFITS]: yup
                .string()
        }),
        initialValues: {
            [CreateProjectFlowId.BENEFITS]: '',
        },
        type: "textarea"
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

const ProjectFlow: React.FC = () => {
    const navigate = useNavigate();
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { paymentPlan, redirectToPaymentPlans } = React.useContext(PaymentsContext)

    const [projectsCreateResponse, setProjectsCreateResponse] = React.useState<ProjectsCreateOutput | null>(null)
    const [progressMessage, setProgressMessage] = React.useState("")
    const [progressList, setProgressList] = React.useState<string[]>([])

    const createProject = async (values: Record<string, string>) => {
        const projectName = values[CreateProjectFlowId.NAME]
        if (!projectName) {
            return
        }

        if (projectsCreateResponse) {
            // TODO app level warning
            console.log("Project has already been created")
            return
        }

        setProgressMessage("Creating Project...")
        const response = await api.projects.create({
            token: user.getTokenId(),
            name: projectName,
            url: createUrl(projectName),
        })
        setProgressList(prev => {
            return [
                ...prev,
                "Project Created"
            ]
        })

        const newProject = Project.createEmptyProject(
            response.id,
            response.name,
            response.url
        )

        projects.event$.next({
            type: ProjectsMessageType.SET_PROJECT,
            data: newProject.getStruct()
        })

        const project = projects.getProjectById(response.id)

        setProgressMessage("Creating Home Page...")
        const pageResponse = await api.pages.create({
            token: user.getTokenId(),
            title: projectName,
            projectId: response.id,
            path: 'index',
            description: projectName,
            contentIds: [],
        })
        setProgressList(prev => {
            return [
                ...prev,
                "Home page created"
            ]
        })
        setProgressMessage("Home page created...")
        project.event$.next({
            type: ProjectMessageType.SET_PAGE,
            data: {
                id: pageResponse.id,
                projectId: pageResponse.projectId,
                path: pageResponse.path,
                title: pageResponse.title,
                description: pageResponse.description,
                contentIds: [],
            },
        })


        setProgressMessage("Creating Email List...")
        const emailListResponse = await api.email.lists.create({
            token: user.getTokenId(),
            title: projectName,
            projectId: response.id,
            description: projectName,
        })
        setProgressList(prev => {
            return [
                ...prev,
                "Email list created"
            ]
        })
        setProgressMessage("Email list created...")
        project.event$.next({
            type: ProjectMessageType.SET_EMAIL_LIST,
            data: {
                createdAt: emailListResponse.createdAt,
                id: emailListResponse.id,
                status: emailListResponse.status,
                title: emailListResponse.title,
                projectId: emailListResponse.projectId,
                description: emailListResponse.description,
            },
        })

        return response
    }

    const createContent = async (projectID: string, values: Record<string, string>) => {
        const project = projects.getProjectById(projectID)
        if (!project) {
            console.error("PROJECT NOT FOUND")
            return
        }

        const page = project.getPageByPathname("index")
        if (!page) {
            console.error("PAGE NOT FOUND")
            return
        }
        const projectName = values[CreateProjectFlowId.NAME]
        const benefits = values[CreateProjectFlowId.BENEFITS]
        const targetAudience = values[CreateProjectFlowId.TARGET_AUDIENCE]
        const description = values[CreateProjectFlowId.DESCRIPTION]
        const emotion = values[CreateProjectFlowId.EMOTION]
        const goal = values[CreateProjectFlowId.GOAL]

        setProgressMessage("Generating Ai Logo...")
        const logoImgSrc = await createImagePrompt({
            details: "Create a logo image",
            description,
            emotion,
            projectName,
            targetAudience,
        },
            user.getTokenId(),
            project.getId(),
            api.ai.aiImages.create,
        )
        const logoImgUrl = `${env.hosting.baseUrl}/${logoImgSrc.src}`
        setProgressList(prev => {
            return [
                ...prev,
                "Logo created"
            ]
        })

        setProgressMessage("Searching for Stock Images...")
        const imagesGallery = await api.images.get({
            token: user.getTokenId(),
            page: 4,
            perPage: 5,
            query: projectName.replaceAll(" ", ","),
        })
        const imageGalleryUrls = imagesGallery.results.map(i => i.urls.full).join(", ")
        setProgressList(prev => {
            return [
                ...prev,
                "Stock images found"
            ]
        })

        try {
            setProgressMessage("Generating Ai Copywriting...")
            const response = await api.ai.aiComponents.create({
                projectId: project.getId(),
                messages: [
                    {
                        role: ProjectThreadMessageRole.SYSTEM,
                        timestamp: new Date().toISOString(),
                        content: [
                            {
                                text: brainstormPrompt
                            }
                        ]
                    },
                    {
                        role: ProjectThreadMessageRole.USER,
                        timestamp: new Date().toISOString(),
                        content: [
                            {
                                text: `ProjectName: ${projectName}`
                            },
                            {
                                text: `Benefits: ${benefits}`
                            },
                            {
                                text: `Target Audience: ${targetAudience}`
                            },
                            {
                                text: `Description: ${description}`
                            },
                            {
                                text: `Emotion: ${emotion}`
                            },
                            {
                                text: `Goal: ${goal}`
                            },
                            {
                                text: `Logo image: ${logoImgUrl}`
                            },
                            {
                                text: `image Gallery: ${imageGalleryUrls}`
                            }
                        ]
                    }
                ]
            })

            interface Content {
                template: TemplateComponentType,
                description: string,
                data: {}
            }

            let contentResponse: Record<TemplateCategory, Content> = {}
            try {
                const md = fromMarkdown(response?.data?.content[0]?.text)
                const code = md.children.find(child => child.type === "code")

                contentResponse = json5.parse(code?.value)
            } catch (error) {
                console.log({ error })
            }

            setProgressMessage("Creating content...")
            const contentPromises = () => Object.keys(contentResponse).map((key: TemplateCategory) => {
                return api.content.create({
                    token: user.getTokenId(),
                    projectId: project.getId(),

                    categories: [key],
                    template: contentResponse[key].template,
                    description: contentResponse[key].description || key,
                    data: contentResponse[key].data,
                })
            })

            const contentResponses = await Promise.all(contentPromises())

            contentResponses.map(r => {
                project.event$.next({
                    type: ProjectMessageType.SET_CONTENT,
                    data: {
                        id: r.id,
                        description: r.description,
                        projectId: r.projectId,
                        createdAt: r.createdAt,
                        data: r.data,
                        template: r.template,
                        categories: r.categories,
                    },
                })
            })

            page.event$.next({
                type: PageMessageType.SET_CONTENT_IDS,
                data: Object.keys(contentResponse).map((dataKey: TemplateCategory) => {
                    const c = contentResponses.find(r => {
                        return r.template === contentResponse[dataKey].template
                    })

                    return c?.id || ""
                }).filter(Boolean)
            })

            setProgressList(prev => {
                return [
                    ...prev,
                    "Content created"
                ]
            })

            setProgressMessage("Adding content to page...")
            await api.pages.updateById({
                projectId: project.getId(),
                pageId: page.getId(),
                token: user.getTokenId(),
                contentIds: [...page.getContentIds(), contentResponse.id]
            })

            setProgressMessage("")
            await Promise.resolve()

            navigate(appRoutes.getProjectPageRoute(project.getId(), page.getId()))
        } catch (error) {
            // TODO app level error
            console.error(error)
        }
    }

    const onSubmit = async (state: Record<string, string>) => {
        const project = await createProject(state)
        await createContent(project?.id || "", state)
    }

    return (
        <>
            <Flex direction="column" gap="2" justify="center" align="center">
                {!progressMessage ? (
                    <CreateProjectForms
                        questions={projectFlowQuestions}
                        onSubmit={canUseFeature.createProject[paymentPlan](Object.keys(projects.getProjects()).length) ? onSubmit : async (currentId: string, values: Record<string, string>) => redirectToPaymentPlans()}
                    />
                ) : (
                    <Section>
                        <Card>
                            <Flex justify="center" direction="column" gap="3" align="center">
                                <Container size="1">
                                    <Flex direction="column" gap="3">
                                        <Text>
                                            <Skeleton>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                                                felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
                                                erat, fringilla sed commodo sed, aliquet nec magna.
                                            </Skeleton>
                                        </Text>

                                        <Skeleton>
                                            <Text>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                                                felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
                                                erat, fringilla sed commodo sed, aliquet nec magna.
                                            </Text>
                                        </Skeleton>
                                    </Flex>
                                </Container>

                                <Heading m="3" size="5">
                                    {progressMessage}
                                </Heading>

                                <Flex gap="3" direction="column" justify="center">
                                    {progressList.map(text => {
                                        return (
                                            <Text as="label" size="2">
                                                <Flex gap="2">
                                                    <Checkbox defaultChecked />
                                                    {text}
                                                </Flex>
                                            </Text>
                                        )
                                    })}
                                </Flex>
                            </Flex>
                        </Card>
                    </Section>
                )}
            </Flex>
        </>
    )
}

export default ProjectFlow