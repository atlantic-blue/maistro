import * as yup from 'yup';

import { FormQuestion } from '../CreateProjectForm/CreateProjectForm';
import CreateProjectForms from '../CreateProjectForms/CreateProjectForms';
import React, { useState } from 'react';
import { createUrl } from '../../../../Utils/url';
import { ApiContext } from '../../../../Api/ApiProvider';
import { ProjectsContext } from '../../../../Projects';
import { ProjectsCreateOutput } from '../../../../Api/Projects/projectsCreate';
import { Project } from '../../../../Store/Project';
import { PageMessageType, ProjectMessageType, ProjectsMessageType } from '../../../../types';
import { templates } from '../../../../Templates';
import { TemplateComponentType } from '../../../../Templates/templateTypes';
import env from '../../../../env';
import { Box, Flex } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '../../../router';
import { PaymentsContext } from '../../../../Payments/PaymentsProvider';
import createSectionHeroPrompt from '../../../../Ai/prompts/SectionHero';

enum CreateProjectFlowId {
    NAME = "name",
    EMOTION = "emotion",
    DESCRIPTION = "description",
    TARGET_AUDIENCE = "targetAudience",
    BENEFITS = "benefits",
    CTA = "cta",
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
    },
    {
        id: CreateProjectFlowId.CTA,
        title: "What action do you want visitors to take upon seeing the hero section?",
        validationSchema: yup.object({
            [CreateProjectFlowId.CTA]: yup
                .string()
        }),
        initialValues: {
            [CreateProjectFlowId.CTA]: '',
        },
    },
    {
        id: CreateProjectFlowId.CTA,
        title: "What action do you want visitors to take upon seeing the hero section?",
        validationSchema: yup.object({
            [CreateProjectFlowId.CTA]: yup
                .string()
        }),
        initialValues: {
            [CreateProjectFlowId.CTA]: '',
        },
    },
]

const ProjectFlow: React.FC = () => {
    const navigate = useNavigate();
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { isSubscribed, redirectToCheckout } = React.useContext(PaymentsContext)

    const [projectsCreateResponse, setProjectsCreateResponse] = React.useState<ProjectsCreateOutput | null>(null)
    const [progressMessage, setProgressMessage] = React.useState("")

    const projectsList = Object.keys(projects.getProjects())
    const canCreateNewProjects = projectsList.length < 1 || isSubscribed

    const createProject = async (currentId: string, values: Record<string, string>) => {
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

        const newProject = Project.createEmptyProject(
            response.id,
            response.name,
            response.url
        )

        projects.event$.next({
            type: ProjectsMessageType.SET_PROJECT,
            data: newProject.getStruct()
        })

        setProjectsCreateResponse(response)
        setProgressMessage("")
    }

    const createPages = async (currentId: string, values: Record<string, string>) => {
        if (!projectsCreateResponse) {
            console.error("PROJECT NOT CREATED")
            return
        }

        const project = projects.getProjectById(projectsCreateResponse.id)
        if (!project) {
            console.error("PROJECT NOT FOUND")
            return
        }

        const projectName = values[CreateProjectFlowId.NAME]
        const description = values[CreateProjectFlowId.DESCRIPTION]

        setProgressMessage("Creating Pages...")
        const promises = () => [
            api.pages.create({
                token: user.getTokenId(),
                path: 'index',
                title: projectName,
                description: description,
                projectId: projectsCreateResponse.id,
                contentIds: [],
            }).then(pageResponse => {
                setProgressMessage("Index page created...")
                project.event$.next({
                    type: ProjectMessageType.SET_PAGE,
                    data: {
                        id: pageResponse.id,
                        projectId: pageResponse.projectId,
                        path: pageResponse.path,
                        title: pageResponse.title,
                        description: pageResponse.description,
                        contentIds: [],
                        // TODO
                        colourScheme: {},
                        fontScheme: {}
                    },
                })
                return pageResponse
            }),
            api.pages.create({
                token: user.getTokenId(),
                path: 'success',
                title: projectName,
                description: description,
                projectId: projectsCreateResponse.id,
                contentIds: [],
            }).then(pageResponse => {
                setProgressMessage("Success page created...")
                project.event$.next({
                    type: ProjectMessageType.SET_PAGE,
                    data: {
                        id: pageResponse.id,
                        projectId: pageResponse.projectId,
                        path: pageResponse.path,
                        title: pageResponse.title,
                        description: pageResponse.description,
                        contentIds: [],
                        // TODO
                        colourScheme: {},
                        fontScheme: {}
                    },
                })
                return pageResponse
            }),
            api.email.lists.create({
                token: user.getTokenId(),
                title: projectName,
                description: description,
                projectId: projectsCreateResponse.id,
            }).then(emailListResponse => {
                setProgressMessage("Creating mailing list...")
                project.event$.next({
                    type: ProjectMessageType.SET_EMAIL_LIST,
                    data: {
                        createdAt: emailListResponse.createdAt,
                        title: emailListResponse.title,
                        status: emailListResponse.status,
                        projectId: emailListResponse.projectId,
                        id: emailListResponse.id,
                        description: emailListResponse.description
                    }
                })
                return emailListResponse
            })
        ]

        await Promise.all(promises())
        setProgressMessage("")
    }

    const createHeroContent = async (currentId: string, values: Record<string, string>) => {
        if (!projectsCreateResponse) {
            console.error("PROJECT NOT CREATED")
            return
        }

        const project = projects.getProjectById(projectsCreateResponse.id)
        if (!project) {
            console.error("PROJECT NOT FOUND")
            return
        }

        const page = project.getPageByPathname("index")
        if (!page) {
            console.error("PAGE NOT FOUND")
            return
        }

        try {
            setProgressMessage("Generating Ai Copywriting...")
            const projectName = values[CreateProjectFlowId.NAME]
            const benefits = values[CreateProjectFlowId.BENEFITS]
            const targetAudience = values[CreateProjectFlowId.TARGET_AUDIENCE]
            const description = values[CreateProjectFlowId.DESCRIPTION]
            const emotion = values[CreateProjectFlowId.EMOTION]
            const cta = values[CreateProjectFlowId.CTA]

            const response = await createSectionHeroPrompt({
                projectName,
                benefits,
                cta,
                description,
                emotion,
                targetAudience
            },
                user.getTokenId(),
                projectsCreateResponse.id,
                api.aiContent.create,
            )

            setProgressMessage("Creating content...")
            const template = templates[TemplateComponentType.HERO_IMAGE]
            const contentResponse = await api.content.create({
                token: user.getTokenId(),
                projectId: projectsCreateResponse.id,
                template: template.name,
                categories: template.categories,
                description: template.description,
                data: {
                    ...template.props,
                    title: response.title,
                    content: response.content,
                    cta: response.cta,
                    ctaLink: "/",
                }
            })

            project.event$.next({
                type: ProjectMessageType.SET_CONTENT,
                data: {
                    id: contentResponse.id,
                    description: contentResponse.description,
                    projectId: contentResponse.projectId,
                    createdAt: contentResponse.createdAt,
                    data: contentResponse.data,
                    template: contentResponse.template,
                    categories: contentResponse.categories,
                },
            })

            page.event$.next({
                type: PageMessageType.PUSH_CONTENT_IDS,
                data: [contentResponse.id]
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

    // const createSubscribeContent = async (currentId: string, values: Record<string, string>) => {
    //     if (!projectsCreateResponse) {
    //         console.error("PROJECT NOT CREATED")
    //         return
    //     }

    //     const project = projects.getProjectById(projectsCreateResponse.id)
    //     if (!project) {
    //         console.error("PROJECT NOT FOUND")
    //         return
    //     }

    //     const page = project.getPageByPathname("index")
    //     if (!page) {
    //         console.error("PAGE NOT FOUND")
    //         return
    //     }

    //     setProgressMessage("Creating subscribe content...")
    //     const template = templates[TemplateComponentType.SUBSCRIBE_BASIC]
    //     const contentResponse = await api.content.create({
    //         token: user.getTokenId(),
    //         projectId: projectsCreateResponse.id,
    //         template: template.name,
    //         categories: template.categories,
    //         description: template.description,
    //         data: {
    //             ...template.props,
    //             url: env.api.email.entries.create,
    //             emailListId: project.getEmailLists()[0].getId(),
    //         }
    //     })

    //     project.event$.next({
    //         type: ProjectMessageType.SET_CONTENT,
    //         data: {
    //             id: contentResponse.id,
    //             description: contentResponse.description,
    //             projectId: contentResponse.projectId,
    //             createdAt: contentResponse.createdAt,
    //             data: contentResponse.data,
    //             template: contentResponse.template,
    //             categories: contentResponse.categories,
    //         },
    //     })

    //     page.event$.next({
    //         type: PageMessageType.PUSH_CONTENT_IDS,
    //         data: [contentResponse.id]
    //     })

    //     api.pages.updateById({
    //         projectId: projectsCreateResponse.id,
    //         pageId: page.getId(),
    //         token: user.getTokenId(),
    //         contentIds: [...page.getContentIds(), contentResponse.id]
    //     })
    //     setProgressMessage("")
    // }

    const onSubmit = async (currentId: string, values: Record<string, string>) => {
        const stage = {
            [CreateProjectFlowId.NAME]: createProject,
            [CreateProjectFlowId.DESCRIPTION]: createPages,
            [CreateProjectFlowId.CTA]: createHeroContent,
            // [CreateProjectFlowId.CTA]: createSubscribeContent,
        }[currentId]

        if (!stage) {
            return
        }

        await stage(currentId, values)
    }

    return (
        <>
            <Flex direction="column" gap="2" justify="center" align="center">
                <CreateProjectForms
                    questions={projectFlowQuestions}
                    onSubmit={canCreateNewProjects ? onSubmit : async (currentId: string, values: Record<string, string>) => redirectToCheckout()}
                />
                {progressMessage && (
                    <Box>
                        {progressMessage}
                    </Box>
                )}
            </Flex>
        </>
    )
}

export default ProjectFlow