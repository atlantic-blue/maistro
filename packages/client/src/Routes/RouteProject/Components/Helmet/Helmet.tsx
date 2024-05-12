import React from "react"
import { useNavigate, useParams } from "react-router-dom";

import {
    ColourPalette,
    ColourScheme,
    FontFamily,
    FontScheme,
    PageMessageType,
    ProjectMessageType
} from "../../../../types";
import Menu from "../Menu/Menu"

import { ProjectsContext } from "../../../../Projects";

import { defaultColorScheme, defaultFontScheme } from "../../../../PageContext";
import { Button, Flex, Section, Separator } from "@radix-ui/themes";
import RouteProjectHeader from "../Header/Header";
import ProjectDropDown from "../DropDownProject/DropDownProject";
import DropDownPage from "../DropDownPage/DropDownPage";

import * as styles from "./Helmet.scss"
import { SubmitProject } from "../../RouteProjectSettings/Components/SubmitProject/SubmitProject";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { CaretDownIcon } from '@radix-ui/react-icons';
import classNames from "classnames";
import { appRoutes } from "../../../router";
import { Project } from "../../../../Store/Project";
import Page from "../../../../Store/Page";
import useObservable from "../../../../Utils/Hooks/UseObservable";
import { filter, tap } from "rxjs/operators";
import AiAssistant from "../../../../Ai/Assistant/AiAssistant";


const ListItem = React.forwardRef(({ className, children, title, ...props }, forwardedRef) => (
    <li>
        <NavigationMenu.Link asChild>
            <a className={classNames(styles.listItemLink, className)} {...props} ref={forwardedRef}>
                <div className={styles.listItemHeading}>{title}</div>
                <p className={styles.listItemText}>{children}</p>
            </a>
        </NavigationMenu.Link>
    </li>
));

const appendColourSchemeToDocument = (scheme: ColourScheme) => {
    document.documentElement.style.setProperty(ColourPalette.ACCENT, scheme?.accent);
    document.documentElement.style.setProperty(ColourPalette.BACKGROUND, scheme?.background);
    document.documentElement.style.setProperty(ColourPalette.NEUTRAL, scheme?.neutral);
    document.documentElement.style.setProperty(ColourPalette.PRIMARY, scheme?.primary);
    document.documentElement.style.setProperty(ColourPalette.SECONDARY, scheme?.secondary);
    document.documentElement.style.setProperty(ColourPalette.TEXT, scheme?.text);
}

const appendFontSchemeToDocument = (scheme: FontScheme) => {
    document.documentElement.style.setProperty(FontFamily.BODY, scheme?.body?.css);
    document.documentElement.style.setProperty(FontFamily.HEADING, scheme?.heading?.css);
}

interface HelmetProps {
    children: React.ReactNode
}

const Helmet: React.FC<HelmetProps> = (props) => {
    const navigate = useNavigate()
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const page = project && project.getPageById(pageId || "")

    const [colourScheme, setColourScheme] = React.useState(project?.getColourScheme() || defaultColorScheme)
    const [fontScheme, setFontScheme] = React.useState(project?.getFontScheme() || defaultFontScheme)

    React.useEffect(() => {
        const subscription = project.event$.subscribe(event => {
            if (event.type === ProjectMessageType.SET_COLOUR_SCHEME) {
                setColourScheme(prev => {
                    return ({
                        ...prev,
                        ...event.data,
                    })
                })
            }

            if (event.type === ProjectMessageType.SET_FONT_SCHEME) {
                setFontScheme(prev => {
                    return ({
                        ...prev,
                        ...event.data,
                    })
                })
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    React.useEffect(() => {
        if (!colourScheme) {
            return
        }
        appendColourSchemeToDocument(colourScheme)
    }, [colourScheme])

    React.useEffect(() => {
        if (!fontScheme) {
            return
        }
        appendFontSchemeToDocument(fontScheme)
    }, [fontScheme])

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
        <main className={styles.main}>
            <RouteProjectHeader />

            <NavigationMenu.Root className={styles.navigationMenuRoot}>
                <NavigationMenu.List className={styles.navigationMenuList}>
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
                                            {project.getName()}
                                        </ListItem>
                                    )
                                })}
                                <li>
                                    <NavigationMenu.Link asChild>
                                        <a className={styles.callout} onClick={onNewProjectClick}>
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
                                {Object.values(project.getPages()).map(page => {
                                    return (
                                        <ListItem
                                            key={page.getId()}
                                            onClick={() => onPageClick(page)}>
                                            {page.getPath()}
                                        </ListItem>
                                    )
                                })}
                                <li>
                                    <NavigationMenu.Link asChild>
                                        <a className={styles.callout} onClick={onNewPageClick}>
                                            <div className={styles.calloutHeading}>New page</div>
                                        </a>
                                    </NavigationMenu.Link>
                                </li>
                            </ul>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item>
                        <SubmitProject
                            token={user.getTokenId()}
                            userId={user.getId()}
                            project={project}
                            page={page}
                        />
                    </NavigationMenu.Item>

                    <NavigationMenu.Indicator className={styles.navigationMenuIndicator}>
                        <div className={styles.arrow} />
                    </NavigationMenu.Indicator>
                </NavigationMenu.List>

                <div className={styles.viewportPosition}>
                    <NavigationMenu.Viewport className={styles.navigationMenuViewport} />
                </div>
            </NavigationMenu.Root>

            {props.children}
            <Menu />
            <AiAssistant />
        </main>
    )
}

export default Helmet
