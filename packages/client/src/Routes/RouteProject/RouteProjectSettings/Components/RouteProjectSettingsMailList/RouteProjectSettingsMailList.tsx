import React, { useEffect } from "react"
import { filter } from "rxjs/operators"
import { Box, Button, Callout, Card, Flex, Heading, Section, Skeleton, Table, Text, TextField } from "@radix-ui/themes"

import { ApiContext } from "../../../../../Api/ApiProvider"
import { ProjectsContext } from "../../../../../Projects"

import { Project } from "../../../../../Store/Project"
import RouteProjectSettingsMailListCreate from "./RouteProjectSettingsMailListCreate"
import { ProjectEmailListStruct, ProjectMessageType } from "../../../../../types"
import useObservable from "../../../../../Utils/Hooks/UseObservable"

import { EmailEntriesReadOutput } from "../../../../../Api/EmailEntries/emailEntriesReadById"
import * as styles from "./RouteProjectSettingsMailList.scss"

interface RouteProjectSettingsMailListProps {
    project: Project
}

const RouteProjectSettingsMailList: React.FC<RouteProjectSettingsMailListProps> = (props) => {
    const { user } = React.useContext(ProjectsContext)
    const { api } = React.useContext(ApiContext)
    const [emailEntries, setEmailEntries] = React.useState<EmailEntriesReadOutput["data"]>([])
    const [emailEntriesCount, setEmailEntriesCount] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(false)

    useEffect(() => {
        setIsLoading(true)
        api.email.lists.read({
            token: user.getTokenId()
        })
            .then(emailLists => {
                let list: ProjectEmailListStruct | null = null

                if (!Array.isArray(emailLists)) {
                    return list
                }

                emailLists?.forEach((emailList) => {
                    if (emailList.projectId === props.project.getId()) {
                        props.project.event$.next({
                            type: ProjectMessageType.SET_EMAIL_LIST,
                            data: emailList
                        })
                        list = emailList
                    }
                })

                return list
            }).then((emailList: ProjectEmailListStruct | null) => {
                if (!emailList) {
                    return
                }

                api.email.entries
                    .readById({
                        emailListId: emailList.id,
                        token: user.getTokenId(),
                    })
                    .then(response => {
                        setEmailEntriesCount(response.totalCount)
                        setEmailEntries(response.data)
                    })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [props.project.getId()])


    useObservable(
        props.project.event$
            .pipe(
                filter(
                    e => (
                        e.type === ProjectMessageType.SET_EMAIL_LIST &&
                        e.data.projectId === props.project.getId()
                    )
                )
            )
    )

    if (!Object.keys(props.project.getEmailLists()).length) {
        return <RouteProjectSettingsMailListCreate project={props.project} />
    }

    const emailList = Object.values(props.project.getEmailLists())[0]

    if (isLoading) {
        return (
            <Card>
                <Flex gap="3" direction="column" justify="center" align="center">

                    <Skeleton className={styles.section} />
                </Flex>
            </Card>
        )
    }

    return (
        <Card>
            <Flex gap="2" direction="column" justify="center" align="center">
                <Heading align="center">{emailList.getTitle()}</Heading>
                <Text as="p" size="1" align="center">
                    Created on {new Date(emailList.getCreatedAt()).toUTCString()}
                </Text>
                <Text as="p" align="center">
                    {emailList.getDescription()}
                </Text>

                <Section size="1">
                    <Callout.Root>
                        <Callout.Text>
                            Subscribers {emailEntriesCount}
                        </Callout.Text>
                    </Callout.Root>
                </Section>

                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {emailEntries.map(entry => {
                            return (
                                <Table.Row key={entry.id}>
                                    <Table.RowHeaderCell>{entry.name}</Table.RowHeaderCell>
                                    <Table.Cell>{entry.email}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table.Root>
            </Flex>
        </Card>
    )
}

export default RouteProjectSettingsMailList