import React from "react"
import { Button, DropdownMenu } from "@radix-ui/themes"
import { ProjectsContext } from "../../../../Projects"
import { Project } from "../../../../Store/Project"
import { appRoutes } from "../../../router"
import { useNavigate } from "react-router-dom"

interface ProjectDropDownProps {
    project: Project
}

const ProjectDropDown: React.FC<ProjectDropDownProps> = ({
    project
}) => {
    const navigate = useNavigate()
    const { projects } = React.useContext(ProjectsContext)

    const onProjectClick = (project: Project) => {
        navigate(appRoutes.getProjectRoute(project.getId()))
    }

    const onNewProjectClick = async () => {
        navigate(appRoutes.getProjectsNewRoute())
    }

    const onSeeProjectsClick = async () => {
        navigate(appRoutes.getProjectsRoute())
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="soft">
                    {project.getUrl().replace("www.", "").split(".")[0]}...
                    <DropdownMenu.TriggerIcon />
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                {Object.values(projects.getProjects()).map(project => {
                    return (
                        <DropdownMenu.Item onClick={() => onProjectClick(project)} key={project.getId()}>{project.getName()}</DropdownMenu.Item>
                    )
                })}
                <DropdownMenu.Separator />
                <DropdownMenu.Item onClick={onNewProjectClick}>
                    Create New
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={onSeeProjectsClick}>
                    See Projects
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}

export default ProjectDropDown