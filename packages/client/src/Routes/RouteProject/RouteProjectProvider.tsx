import React from "react"

import { ApiContext } from "../../Api/ApiProvider"
import { ProjectsContext } from "../../Projects"
import { useParams } from "react-router-dom"
import { ProjectMessageType, ProjectThreadMessageRole, ProjectThreadName } from "../../types"
import Loading from "../../Components/Loading/Loading"
import { createMaistroChatPrompt } from "../../Ai/prompts/Maistro"
import { Theme } from "@radix-ui/themes"
import useObservable from "../../Utils/Hooks/UseObservable"
import { filter } from "rxjs"

const ProjectContext = React.createContext({})

interface RouteProjectProviderProps {
    children: React.ReactNode
}

const RouteProjectProvider: React.FC<RouteProjectProviderProps> = (props) => {
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const [isLoading, setIsLoading] = React.useState(true)

    const createCopyWritingThread = async () => {
        const aiThreadResponse = await api.ai.aiThreads.create({
            token: user.getTokenId(),
            name: ProjectThreadName.COPYWRITING,
            projectId: project.getId(),
            messages: [
                {
                    role: ProjectThreadMessageRole.SYSTEM,
                    timestamp: new Date().toUTCString(),
                    content: [
                        {
                            text: "Do not wrap responses with  \`\`\` and \`\`\`",
                        },
                    ]
                }
            ]
        })

        project.event$.next({
            type: ProjectMessageType.SET_AI_THREAD,
            data: {
                id: aiThreadResponse.id,
                createdAt: aiThreadResponse.createdAt,
                projectId: aiThreadResponse.projectId,
                name: aiThreadResponse.name,
                messages: aiThreadResponse.messages,
                updatedAt: aiThreadResponse.createdAt,
                inputTokens: 0,
                outputTokens: 0,
            },
        })
    }

    const createMainThread = async () => {
        const aiThreadResponse = await api.ai.aiThreads.create({
            token: user.getTokenId(),
            name: project.getName(),
            projectId: project.getId(),
            messages: [
                {
                    role: ProjectThreadMessageRole.SYSTEM,
                    timestamp: new Date().toUTCString(),
                    content: [
                        {
                            text: "Do not wrap responses with  \`\`\` and \`\`\`",
                        },
                        {
                            text: createMaistroChatPrompt()
                        }
                    ]
                }
            ]
        })

        project.event$.next({
            type: ProjectMessageType.SET_AI_THREAD,
            data: {
                id: aiThreadResponse.id,
                createdAt: aiThreadResponse.createdAt,
                projectId: aiThreadResponse.projectId,
                name: aiThreadResponse.name,
                messages: aiThreadResponse.messages,
                updatedAt: aiThreadResponse.createdAt,
                inputTokens: 0,
                outputTokens: 0,
            },
        })
    }

    const getThreads = async () => {
        if (!project) {
            return
        }

        const threads = await api.ai.aiThreads.read({
            projectId: project.getId(),
            token: user.getTokenId(),
        })

        if (threads) {
            threads?.map(thread => {
                project.event$.next({
                    type: ProjectMessageType.SET_AI_THREAD,
                    data: thread,
                })
            })
        }

        if (threads && !threads?.find(thread => thread.name === ProjectThreadName.COPYWRITING)) {
            createCopyWritingThread()
        }

        if (!threads || !threads.length) {
            return createMainThread()
        }
    }

    const getPages = async () => {
        if (!project) {
            return
        }

        const pages = await api.pages.read({ projectId: project.getId(), token: user.getTokenId() })
        if (!pages || !pages.length) {
            return
        }

        pages.map(page => {
            project.event$.next({
                type: ProjectMessageType.SET_PAGE,
                data: page,
            })
        })
    }

    const getContent = async () => {
        if (!projectId) {
            return
        }
        const response = await api.content.read({
            token: user.getTokenId(),
            projectId,
        })

        if (!response || !Array.isArray(response)) {
            return
        }

        response?.filter(Boolean)
            .map(contentStruct => {
                project.event$.next({
                    type: ProjectMessageType.SET_CONTENT,
                    data: {
                        id: contentStruct.id,
                        description: contentStruct.description,
                        template: contentStruct.template,
                        projectId: contentStruct.projectId,
                        createdAt: contentStruct.createdAt,
                        data: contentStruct.data,
                        categories: contentStruct.categories,
                    }
                })
            })
    }

    const getEmailList = async () => {
        if (!projectId) {
            return
        }
        const response = await api.email.lists.read({
            token: user.getTokenId(),
        })

        if (!response || !Array.isArray(response)) {
            return
        }

        const emailList = response
            .filter(emailList => emailList.projectId === projectId)[0]

        if (!emailList) {
            return
        }

        project.event$.next({
            type: ProjectMessageType.SET_EMAIL_LIST,
            data: {
                createdAt: emailList.createdAt,
                title: emailList.title,
                status: emailList.status,
                projectId: emailList.projectId,
                id: emailList.id,
                description: emailList.description
            }
        })
    }

    const getProduct = async () => {
        if (!projectId) {
            return
        }
        const response = await api.products.read({
            token: user.getTokenId(),
            projectId,

        })

        if (!response || !Array.isArray(response)) {
            return
        }

        response?.filter(Boolean)
            .map(productStruct => {
                project.event$.next({
                    type: ProjectMessageType.SET_PRODUCT,
                    data: {
                        id: productStruct.id,
                        description: productStruct.description,
                        currency: productStruct.currency,
                        images: productStruct.images,
                        name: productStruct.name,
                        options: productStruct.options,
                        price: productStruct.price,
                        priceDecimal: productStruct.priceDecimal,
                        stockQuantity: productStruct.stockQuantity
                    }
                })
            })
    }

    React.useEffect(() => {
        getPages()
            .then(() => {
                setIsLoading(false)
            })
    }, [project, projectId])

    React.useEffect(() => {
        getContent()
    }, [projectId])

    React.useEffect(() => {
        getProduct()
    }, [projectId])

    React.useEffect(() => {
        getEmailList()
    }, [projectId])

    React.useEffect(() => {
        getThreads()
    }, [projectId])

    useObservable(project.event$.pipe(filter(e => e.type === ProjectMessageType.SET_THEME)))

    if (isLoading) {
        return (
            <Loading>
                Loading Project...
            </Loading>
        )
    }

    return (
        <ProjectContext.Provider value={{}}>
            <Theme
                accentColor={project.getTheme()?.accentColor}
                grayColor={project.getTheme()?.grayColor}
                appearance={project.getTheme()?.appearance}
                radius={project.getTheme()?.radius}
                scaling={project.getTheme()?.scaling}
            >
                {props.children}
            </Theme>
        </ProjectContext.Provider>
    )
}

export default RouteProjectProvider
