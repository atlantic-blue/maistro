import React, { useEffect, useState } from "react"
import { ApiContext } from "../../Api/ApiProvider"
import { Projects } from "../../Store/Projects"
import { PageMessageType, ProjectMessageType, ProjectsMessageType } from "../../types"
import useObservable from "../../Utils/Hooks/UseObservable"
import { filter } from "rxjs"
import { TemplateCategory, TemplateComponentType } from "../../Templates/templateTypes"
import { Flex, Button } from "@radix-ui/themes"
import * as styles from "./RouteTemplate.scss"
import { AuthContext } from "../../Auth/AuthProvider"
import { useParams } from "react-router-dom"
import { fromMarkdown } from "mdast-util-from-markdown"
import json5 from "json5"
import RouteBrainstormSkeleton from "../RouteBrainstorm/RouteBrainstorm.skeleton"

const projectsStore = new Projects()
const PROJECT_NAME = "template"

const RouteTemplate = () => {
    const { api } = React.useContext(ApiContext)
    const { logIn } = React.useContext(AuthContext)
    const { templateId } = useParams()
    const [data, setData] = useState<Partial<Record<TemplateCategory, {
        template: TemplateComponentType,
        description: string,
        data: {}
    }>>>({})

    const project = projectsStore.getProjectByName(PROJECT_NAME)
    const page = project?.getPageByPathname("index")

    useObservable(
        projectsStore.event$
            .pipe(
                filter(e => e.type === ProjectsMessageType.SET_PROJECT)
            )
    )

    useObservable(
        project?.event$
            .pipe(
                filter(e => e.type === ProjectMessageType.SET_PAGE)
            )
    )

    useObservable(
        page?.event$
            .pipe(
                filter(e => e.type === PageMessageType.SET_CONTENT_IDS)
            )
    )

    const fetchData = async (templateId: string) => {
        const response = await api.ai.aiTemplates.readById({ templateId })
        try {
            const md = fromMarkdown(response?.data?.content[0]?.text)
            const code = md.children.find(child => child.type === "code")
            const pageData = json5.parse(code?.value)
            setData(pageData)
        } catch (error) {
            console.log({ error })
        }
    }

    useEffect(() => {
        if (!templateId) {
            return
        }

        fetchData(templateId)
    }, [templateId])

    useEffect(() => {
        if (!project || !page) {
            return
        }

        if (
            !data[TemplateCategory.HEADER] ||
            !data[TemplateCategory.HERO] ||
            !data[TemplateCategory.TESTIMONIALS] ||
            !data[TemplateCategory.SERVICES] ||
            !data[TemplateCategory.FOOTER]
        ) {
            return
        }

        [
            TemplateCategory.HEADER,
            TemplateCategory.HERO,
            TemplateCategory.TESTIMONIALS,
            TemplateCategory.SERVICES,
            TemplateCategory.FOOTER
        ].forEach((category) => {
            if(!data || !data[category]) {
                return
            }

            const item = data[category]
            if(!item) {
                return
            }

            project.event$.next({
                type: ProjectMessageType.SET_CONTENT,
                data: {
                    createdAt: new Date().toISOString(),
                    projectId: project.getId(),
                    categories: [category],
    
                    id: item.template,
                    template: item.template,
                    description: item.description,
                    data: item.data,
                }
            })    
        })

        page.event$.next({
            type: PageMessageType.SET_CONTENT_IDS,
            data: Object.keys(data).map(dataKey => {
                return data[dataKey].template
            })
        })
    }, [page, JSON.stringify(data)])

    useEffect(() => {
        if (!project) {
            return
        }

        project.event$.next({
            type: ProjectMessageType.SET_PAGE,
            data: {
                id: "brainstorm",
                title: "brainstorm",
                description: "",
                path: "index",
                projectId: project.getId(),
                contentIds: [],
            }
        })
    }, [project])

    useEffect(() => {
        if (projectsStore.getProjectByName("template")) {
            return
        }

        projectsStore.event$.next({
            type: ProjectsMessageType.SET_PROJECT,
            data: {
                id: PROJECT_NAME,
                name: PROJECT_NAME,
                url: "",
                pages: {},
                threads: {},
                assets: {},
                content: {},
                emailLists: {},
            },
        })
    }, [])

    if (page) {
        return (
            <div className={styles.main}>
                <div className={styles.banner}>
                    <Flex className={styles.bannerContainer} justify="center">
                        <Button variant="outline" onClick={logIn}>
                            Claim this website
                        </Button>
                    </Flex>
                </div>
                <div>
                    {page.getContentIds().map(id => {
                        const content = project.getContentById(id)
                        if (!content) {

                            return null
                        }

                        return (
                            <div key={id}>
                                <content.Component />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <RouteBrainstormSkeleton />
    )
}

export default RouteTemplate
