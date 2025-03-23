import React, { useEffect } from "react";
import { useQuery } from "react-query";
import classNames from "classnames";
import { Button, Callout, Flex } from "@radix-ui/themes";
import { postProject } from "../../../../../Api/Project/postProject";
import { withHttps } from "../../../../../Utils/url";

import { Project } from "../../../../../Store/Project";
import PageStore from "../../../../../Store/Page";
import { filter } from "rxjs/operators";

import * as styles from "./SubmitProject.scss";
import { PageMessageType } from "../../../../../types";

interface SubmitProjectProps {
    token: string
    userId: string
    project: Project,
    page?: PageStore,
    request?: (input: { project: Project, userId: string }) => Promise<void>
}

export const SubmitProject: React.FC<SubmitProjectProps> = ({
    token,
    project,
    userId,
    page,
    request = postProject
}) => {
    const [viewLink, setViewLink] = React.useState<null | string>(null);
    const { isError, isLoading, refetch } = useQuery({
        enabled: false,
        queryKey: "SubmitProject",
        queryFn: async () => {
            return await request({
                token,
                project,
                userId
            });
        }
    });

    useEffect(() => {
        const subscription = page?.event$.pipe(
            filter(
                event => {
                    return (
                        event.type === PageMessageType.SET_CONTENT_IDS ||
                        event.type === PageMessageType.PUSH_CONTENT_IDS
                    )
                })).subscribe(() => {
                    setViewLink(null)
                })

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    const onPublish = () => {
        refetch()
            .then(() => {
                setViewLink(project.getUrl());
            });
    };

    const onSeeProject = () => {
        window.open(withHttps(project.getUrl()), "_blank");
    };

    return (
        <Flex gap="2" align="center" justify="center" wrap="wrap">
            <Button
                size="1"
                loading={isLoading}
                className={classNames({
                    [styles.loading]: isLoading,
                    [styles.success]: viewLink,
                    [styles.error]: isError,
                })} onClick={onPublish}>
                Publish
            </Button>

            <Button
                size="1"
                variant="outline"
                onClick={onSeeProject}>
                See Project
            </Button>

            {/* TODO use a toaster */}
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

        </Flex>
    );
};
