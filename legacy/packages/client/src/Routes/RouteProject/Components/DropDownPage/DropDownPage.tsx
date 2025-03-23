import React from "react"
import { useNavigate } from "react-router-dom"
import { Button, DropdownMenu } from "@radix-ui/themes"

import Page from "../../../../Store/Page"
import { Project } from "../../../../Store/Project"
import { appRoutes } from "../../../router"

interface DropDownPageProps {
    page?: Page
    project: Project
}

const DropDownPage: React.FC<DropDownPageProps> = ({
    page,
    project,
}) => {
    const navigate = useNavigate()

    const onPageClick = (page: Page) => {
        navigate(appRoutes.getProjectPageRoute(project.getId(), page.getId()))
    }

    const onNewPageClick = async () => {
        navigate(appRoutes.getProjectPageTemplatesRoute(project.getId()))
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="soft">
                    {page?.getPath() || "Page"}
                    <DropdownMenu.TriggerIcon />
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                {Object.values(project.getPages()).map(page => {
                    return (
                        <DropdownMenu.Item key={page.getId()} onClick={() => onPageClick(page)}>{page.getPath()}</DropdownMenu.Item>
                    )
                })}
                <DropdownMenu.Separator />
                <DropdownMenu.Item onClick={onNewPageClick}>
                    Create New Page
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}

export default DropDownPage