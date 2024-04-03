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

import * as styles from "./Helmet.scss"
import { defaultColorScheme, defaultFontScheme } from "../../../../PageContext";

const appendColourSchemeToDocument = (scheme: ColourScheme) => {
    document.documentElement.style.setProperty(ColourPalette.ACCENT, scheme.accent);
    document.documentElement.style.setProperty(ColourPalette.BACKGROUND, scheme.background);
    document.documentElement.style.setProperty(ColourPalette.NEUTRAL, scheme.neutral);
    document.documentElement.style.setProperty(ColourPalette.PRIMARY, scheme.primary);
    document.documentElement.style.setProperty(ColourPalette.SECONDARY, scheme.secondary);
    document.documentElement.style.setProperty(ColourPalette.TEXT, scheme.text);
}

const appendFontSchemeToDocument = (scheme: FontScheme) => {
    document.documentElement.style.setProperty(FontFamily.BODY, scheme.body.css);
    document.documentElement.style.setProperty(FontFamily.HEADING, scheme.heading.css);
}

interface HelmetProps {
    children: React.ReactNode
}

const Helmet: React.FC<HelmetProps> = (props) => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

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
        appendColourSchemeToDocument(colourScheme)
    }, [colourScheme])

    React.useEffect(() => {
        appendFontSchemeToDocument(fontScheme)
    }, [fontScheme])

    return (
        <main className={styles.main}>
            {props.children}
            <Menu />
        </main>
    )
}

export default Helmet
