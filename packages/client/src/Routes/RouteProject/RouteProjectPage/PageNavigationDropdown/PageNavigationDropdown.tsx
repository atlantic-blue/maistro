import React from "react";
import classNames from "classnames";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Flex, Text } from "@radix-ui/themes";

import { ProjectsContext } from "../../../../Projects";
import { appRoutes } from "../../../router";
import { SubmitProject } from "../../RouteProjectSettings/Components/SubmitProject/SubmitProject";
import { CaretDownIcon } from "@radix-ui/react-icons";
import IconHome from "../../../../Components/Icons/Home/Home";
import IconFile from "../../../../Components/Icons/File/File";

import * as styles from "./PageNavigationDropdown.scss"

const ListItem = React.forwardRef(({ className, children, title, ...props }, forwardedRef) => (
    <li>
        <NavigationMenu.Link asChild>
            <a className={classNames(styles.listItemLink, className)} {...props} ref={forwardedRef} aria-label={title}>
                <div className={styles.listItemHeading}>{title}</div>
                <div className={styles.listItemText}>{children}</div>
            </a>
        </NavigationMenu.Link>
    </li>
));

const PageNavigation: React.FC = () => {
    const navigate = useNavigate()
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const page = project && project.getPageById(pageId || "")

    const onProjectClick = (project: Project) => {
        navigate(appRoutes.getProjectRoute(project.getId()))
    }

    const onNewProjectClick = async () => {
        navigate(appRoutes.getProjectsNewRoute())
    }

    const onPageClick = (page: Page) => {
        navigate(appRoutes.getProjectPageRoute(project.getId(), page.getId()))
    }

    const onNewPageClick = async () => {
        navigate(appRoutes.getProjectPageTemplatesRoute(project.getId()))
    }

    return (
        <NavigationMenu.Root className={styles.navigationMenuRoot}>
            <NavigationMenu.List className={styles.navigationMenuList}>
                <Flex wrap="wrap" gap="1" align="center" justify="center">
                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger className={styles.navigationMenuTrigger}>
                            {project?.getUrl()?.replace("www.", "").split(".")[0]}... <CaretDownIcon className={styles.caretDown} aria-hidden />
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content className={styles.navigationMenuContent}>
                            <ul className={classNames(styles.list, styles.listOne)}>
                                {Object.values(projects.getProjects()).map(project => {
                                    return (
                                        <ListItem
                                            key={project.getId()}
                                            onClick={() => onProjectClick(project)}
                                        >

                                            <Flex align="center" gap="1">
                                                <Avatar
                                                    size="1"
                                                    src={project.getLogo()}
                                                    alt={project.getName()}
                                                    fallback={project.getName().charAt(0)}
                                                />
                                                <Text>
                                                    {project.getName()}
                                                </Text>
                                            </Flex>
                                        </ListItem>
                                    )
                                })}
                                <li>
                                    <NavigationMenu.Link asChild>
                                        <a className={styles.callout} onClick={onNewProjectClick} aria-label="New Project">
                                            <div className={styles.calloutHeading}> New Project</div>
                                        </a>
                                    </NavigationMenu.Link>
                                </li>
                            </ul>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger className={styles.navigationMenuTrigger}>
                            {page?.getPath() || "Page"} <CaretDownIcon className={styles.caretDown} aria-hidden />
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content className={styles.navigationMenuContent}>
                            <ul className={classNames(styles.list, styles.listTwo)}>
                                {project.getPagesMap().map(page => {
                                    if (!page) {
                                        return null
                                    }

                                    return (
                                        <ListItem
                                            key={page.getId()}
                                            onClick={() => onPageClick(page)}>
                                            <Flex>
                                                {
                                                    page.getPath() === "index" ?
                                                        <IconHome className={styles.navigationMenuContentItemIcon} /> :
                                                        <IconFile className={styles.navigationMenuContentItemIcon} />
                                                }
                                                <Text>
                                                    {page.getPath()}
                                                </Text>
                                            </Flex>
                                        </ListItem>
                                    )
                                })}
                                <li>
                                    <NavigationMenu.Link asChild>
                                        <a className={styles.callout} onClick={onNewPageClick} aria-label="New Page">
                                            <div className={styles.calloutHeading}>New page</div>
                                        </a>
                                    </NavigationMenu.Link>
                                </li>
                            </ul>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>

                    <NavigationMenu.Indicator className={styles.navigationMenuIndicator}>
                        <div className={styles.arrow} />
                    </NavigationMenu.Indicator>
                </Flex>
            </NavigationMenu.List>

            <div className={styles.viewportPosition}>
                <NavigationMenu.Viewport className={styles.navigationMenuViewport} />
            </div>
        </NavigationMenu.Root>
    )
}

export default PageNavigation