import React from "react"
import classNames from "classnames"
import { useNavigate } from "react-router-dom"
import { randImg } from '@ngneat/falso';

import { ProjectsContext } from "../../Projects"
import Thumbnail from "../../Components/Thumbnail/Thumbnail"

import { appRoutes } from "../router"

import ProjectOptions from "./Components/ProjectOptions/ProjectOptions"
import RouteProjectHeader from "../RouteProject/Components/Header/Header"

import { PaymentsContext } from '../../Payments/PaymentsProvider';
import { templates } from "../../Templates"
import { Card } from "@radix-ui/themes"
import * as styles from "./RouteProjects.scss"
import SectionHeroImage from "../../Templates/Section/SectionHero/SectionHeroImage/SectionHeroImage";

const RoutesProjects: React.FC = () => {
    const navigate = useNavigate();
    const { projects } = React.useContext(ProjectsContext)
    const { isSubscribed, redirectToCheckout } = React.useContext(PaymentsContext)

    const onNewProjectClick = async () => {
        navigate(appRoutes.getProjectsNewRoute())
    }

    const projectsList = Object.keys(projects.getProjects())
    const canCreateNewProjects = projectsList.length < 1 || isSubscribed

    return (
        <div className={styles.projects}>
            <RouteProjectHeader />
            <div className={styles.projectsContent}>
                <Card
                    className={classNames(styles.section, styles.sectionEmpty)}
                    onClick={canCreateNewProjects ? onNewProjectClick : redirectToCheckout}
                    title="Create new Project"
                >
                    <div className={styles.content}>
                        <Thumbnail
                            dimensions={{
                                height: `350px`,
                                width: `250px`,
                                scale: 0.5
                            }}
                        >
                            <SectionHeroImage
                                {...{
                                    title: "Captivating Experiences Await",
                                    img: {
                                        src: randImg(),
                                        alt: "",
                                    },
                                    content: "Launch Your Next Adventure",
                                    cta: "Generate",
                                    ctaLink: "#home"
                                }}
                            />
                        </Thumbnail>

                    </div>
                </Card>

                {
                    projectsList.map(projectId => {
                        const project = projects.getProjectById(projectId)

                        const Preview = () => {
                            const indexPage = project.getPageByPathname("index")
                            if (!indexPage) {
                                return
                            }

                            const content = indexPage.getContentIds().map(contentId => {
                                const content = project.getContentById(contentId)
                                if (!content) {
                                    return
                                }
                                const Component = templates[content.getTemplate()]?.Component
                                if (!Component) {
                                    return null
                                }

                                let props = content.getData()

                                return (
                                    <Component key={content.getId()} {...props as any} />
                                )
                            })

                            return content
                        }

                        const onClick = () => {
                            navigate(
                                project.getPageByPathname("index")?.getId() ?
                                    appRoutes.getProjectPageRoute(project.getId(), project.getPageByPathname("index").getId())
                                    : appRoutes.getProjectRoute(project.getId())
                            )
                        }

                        return (
                            <div key={project.getId()}>
                                <Card
                                    className={styles.section}
                                    onClick={onClick}
                                    title={project.getId()}
                                >
                                    <div className={styles.content}>
                                        <Thumbnail
                                            dimensions={{
                                                height: `350px`,
                                                width: `250px`,
                                                scale: 0.5
                                            }}
                                        >
                                            <Preview />
                                        </Thumbnail>
                                    </div>
                                </Card>
                                <ProjectOptions
                                    project={project}
                                />
                            </div>
                        )
                    })
                }
            </div >
        </div >
    )
}

export default RoutesProjects
