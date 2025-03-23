import React, { useEffect, useState } from "react"
import CreateProjectFlow from "../RouteHome/Components/CreateProjectFlow/CreateProjectFlow"
import { ApiContext } from "../../Api/ApiProvider"
import { ProjectThreadMessageRole, ProjectsMessageType } from "../../types"
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
    const paramsHeroImage = searchParams.get("imageHero")
    const paramsBenefits = searchParams.get("benefits")
    const paramsTargetAudience = searchParams.get("targetAudience")

    const fetchData = async (
        input: {
            description: string,
            goal: string,
            imageHero: string,
            benefits: string,
            targetAudience: string,
        }
    ) => {
        setIsLoading(true)
        const imagesGallery = await api.images.get({
            page: 4,
            perPage: 5,
            query: input.description.replaceAll(" ", ","),
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
                            text: `Description: ${input.description}`
                        },
                        {
                            text: `Goal: ${input.goal}`
                        },
                        {
                            text: `Target Audience: ${input.targetAudience}`
                        },
                        {
                            text: `Benefits: ${input.benefits}`
                        },
                        {
                            text: `Hero image: ${input.imageHero}`
                        },
                        {
                            text: `Secondary images: ${imageGalleryUrls}`
                        }
                    ]
                }
            ]
        })

        navigate(appRoutes.getTemplateRoute(response.id))
    }

    useEffect(() => {
        if (
            !paramsDescription ||
            !paramsGoal ||
            !paramsHeroImage ||
            !paramsBenefits ||
            !paramsTargetAudience
        ) {
            return
        }

        fetchData(
            {
                benefits: paramsBenefits,
                description: paramsDescription,
                imageHero: paramsHeroImage,
                targetAudience: paramsTargetAudience,
                goal: paramsTargetAudience,
            }
        )

    }, [
        paramsDescription,
        paramsGoal,
        paramsHeroImage,
        paramsBenefits,
        paramsTargetAudience,
    ])


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
