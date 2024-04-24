import React from "react";
import { useQuery } from "react-query";
import classNames from "classnames";
import { Button, Callout } from "@radix-ui/themes";
import { postProject } from "../../../../../Api/Project/postProject";
import * as styles from "./SubmitProject.scss";
import { withHttps } from "../../../../../Utils/url";

import { Project } from "../../../../../Store/Project";

interface SubmitProjectProps {
    project: Project,
    userId: string
    request?: (input: { project: Project, userId: string }) => Promise<void>
}

export const SubmitProject: React.FC<SubmitProjectProps> = ({
    project, userId, request = postProject
}) => {
    const [viewLink, setViewLink] = React.useState<null | string>(null);
    const { isError, isLoading, refetch } = useQuery({
        enabled: false,
        queryKey: "SubmitProject",
        queryFn: async () => {
            return await request({
                project,
                userId
            });
        }
    });

    const onPublish = () => {
        refetch()
            .then(() => {
                setViewLink(project.getUrl());
            });
    };

    const onSeeProject = () => {
        if (!viewLink) {
            return;
        }

        window.open(withHttps(viewLink), "_blank");
    };

    return (
        <div className={styles.content}>
            <Button
                size="3"
                className={classNames(styles.button, {
                    [styles.loading]: isLoading,
                    [styles.success]: viewLink,
                    [styles.error]: isError,
                })} onClick={viewLink ? onSeeProject : onPublish}>
                {isLoading ? "Publishing..." : viewLink ? "See Project" : "Go Live"}
            </Button>

            {isError &&
                (
                    <div className={styles.errorMessage}>
                        <Callout.Root data-accent-color="red">
                            <Callout.Text>
                                Failed to publish Page
                            </Callout.Text>
                        </Callout.Root>
                    </div>
                )}

        </div>
    );
};
