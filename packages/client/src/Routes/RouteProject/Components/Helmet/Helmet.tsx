import React from "react"
import { useParams } from "react-router-dom";

import {
    ColourPalette,
    ColourScheme,
    FontFamily,
    FontScheme,
    ProjectMessageType
} from "../../../../types";
import Menu from "../Menu/Menu"

import { ProjectsContext } from "../../../../Projects";

import { defaultColorScheme, defaultFontScheme } from "../../../../PageContext";
import { Flex, Section, Separator } from "@radix-ui/themes";
import RouteProjectHeader from "../Header/Header";
import ProjectDropDown from "../DropDownProject/DropDownProject";
import DropDownPage from "../DropDownPage/DropDownPage";

import * as styles from "./Helmet.scss"
import { SubmitProject } from "../../RouteProjectSettings/Components/SubmitProject/SubmitProject";

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


    return (
        <main className={styles.main}>
            <RouteProjectHeader />

            <Section size="1">
                <Flex direction="row" align="center" justify="start">
                    <ProjectDropDown project={project} />
                    <DropDownPage project={project} page={page} />
                    <SubmitProject
                        project={project}
                        userId={user.getId()}
                    />
                </Flex>
            </Section>

            {props.children}
            <Menu />
        </main>
    )
}

export default Helmet
