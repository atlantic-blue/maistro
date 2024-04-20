import React from "react"
import { useQuery } from "react-query"
import classNames from "classnames"

import { Project } from "../../../../../Store/Project"

import { postProject } from "../../../../../Api/Project/postProject"

import env from "../../../../../env"

import * as styles from "./SubmitProject.scss"

interface SubmitProjectProps {
    project: Project,
    userId: string
    request?: (input: { project: Project, userId: string }) => Promise<void>
}

const SubmitProject: React.FC<SubmitProjectProps> = ({
    project,
    userId,
    request = postProject
}) => {
    const [viewLink, setViewLink] = React.useState<null | string>(null)
    const { isError, isLoading, refetch } = useQuery({
        enabled: false,
        queryKey: "SubmitProject",
        queryFn: async () => {
            return await request({
                project,
                userId
            })
        }
    })

    const onPublish = () => {
        refetch()
            .then(response => {
                if (!response.data) {
                    // TODO app level message
                    return
                }
                // TODO needs a link to the index.html of that project instead
                setViewLink(`${env.hosting.baseUrl}/${response.data[0].key}`)
            })
    }

    const onSeeProject = () => {
        if (!viewLink) {
            return
        }

        window.open(viewLink, "_blank");
    }

    return (
        <div className={styles.content}>
            {isError &&
                (
                    <div className={styles.errorMessage}>
                        Failed to publish Page
                    </div>
                )
            }

            <button className={classNames(styles.button, {
                [styles.loading]: isLoading,
                [styles.success]: viewLink,
                [styles.error]: isError,
            })} onClick={viewLink ? onSeeProject : onPublish}>
                {isLoading ? "Publishing..." : viewLink ? "See Project" : "Publish"}
            </button>

        </div>
    )
}

export default SubmitProject