import React, { useEffect, useState } from "react"
import CreateProjectFlow from "../RouteHome/Components/CreateProjectFlow/CreateProjectFlow"
import { ApiContext } from "../../Api/ApiProvider"
import { Projects } from "../../Store/Projects"
import { ProjectThreadMessageRole, ProjectsMessageType } from "../../types"
import { defaultColorScheme, defaultFontScheme } from "../../PageContext"
import { TemplateCategory, TemplateComponentType } from "../../Templates/templateTypes"
import brainstormPrompt from "./prompt"
import { useNavigate, useSearchParams } from "react-router-dom"
import RouteBrainstormSkeleton from "./RouteBrainstorm.skeleton"
import { appRoutes } from "../router"

const RouteBrainstorm = () => {
    const { api } = React.useContext(ApiContext)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = React.useState(false)

    const [searchParams] = useSearchParams()
    const paramsDescription = searchParams.get("description")
    const paramsGoal = searchParams.get("goal")

    const fetchData = async (description: string, goal: string) => {
        setIsLoading(true)
        const imagesGallery = await api.images.get({
            token: "", // TODO remove
            page: 4,
            perPage: 5,
            query: description.replaceAll(" ", ","),
        })
        const imageGalleryUrls = imagesGallery.results.map(i => i.urls.full).join(", ")

        const response = await api.ai.aiComponents.create({
            projectId: "brainstorm",
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
                            text: `Description: ${description}`
                        },
                        {
                            text: `Goal: ${goal}`
                        },
                        {
                            text: `image Gallery URLs: ${imageGalleryUrls}`
                        }
                    ]
                }
            ]
        })

        navigate(appRoutes.getTemplateRoute(response.id))
    }

    useEffect(() => {
        if (paramsDescription && paramsGoal) {
            fetchData(paramsDescription, paramsGoal)
        }

    }, [paramsDescription, paramsGoal])


    if (isLoading) {
        return (
            <RouteBrainstormSkeleton />
        )
    }

    return (
        <>
            <CreateProjectFlow />
        </>
    )
}

export default RouteBrainstorm
