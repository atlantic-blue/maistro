import { Avatar, Button, Card, DropdownMenu, Flex, Heading, Text, TextField } from "@radix-ui/themes"
import React from "react"
import { ApiContext } from "../../../Api/ApiProvider"
import { AuthContext } from "../../../Auth/AuthProvider"
import { SystemUser } from "../../../Api/System/systemUsersRead"
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { appRoutes } from "../../router"
import { ProjectsContext } from "../../../Projects"
import { Project } from "../../../Store/Project"

const RouteAdminUsersList: React.FC = () => {
    const navigate = useNavigate()
    const { user, projects } = React.useContext(ProjectsContext)
    const { api } = React.useContext(ApiContext)
    const [users, setUsers] = React.useState<SystemUser[]>([])
    const [page, setPage] = React.useState<undefined | string>()
    const [limit, setLimit] = React.useState(10)
    const [loading, setLoading] = React.useState(false)
    const [search, setSearch] = React.useState<undefined | string>()

    const fetchUsers = async (input: { limit?: number, page?: string, search?: string }) => {
        if (!user) {
            return
        }

        try {
            setLoading(true)
            const response = await api.system.users.read({
                token: user.getTokenId(),
                limit: input.limit,
                page: input.page,
                search: input.search
            })

            if (response.users) {
                setUsers(response.users)
            }
            if (response.page) {
                setPage(response.page)
            }
        } catch (error) {
            // TODO app level error
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchUsers({
            limit,
            page,
            search,
        })
    }, [user])


    const onNext = () => {
        setSearch("")
        fetchUsers({
            limit,
            page
        })
    }

    const onSearch = () => {
        fetchUsers({
            limit,
            search
        })
    }

    const onGetProfile = (currentUser: SystemUser) => {
        const userId = currentUser.Attributes.find(a => a.Name === "sub")?.Value
        if (!userId) {
            return
        }

        navigate(appRoutes.getAdminUserRoute(userId))
    }

    const onTransferProject = (currentUser: SystemUser, project: Project) => {
        const userId = currentUser.Attributes.find(a => a.Name === "sub")?.Value
        if (!userId) {
            return
        }

        api.system.projects.updateUser({
            token: user.getTokenId(),
            projectId: project.getId(),
            userId
        }).then(() => {
            navigate(appRoutes.getAdminUserRoute(userId))
        })
    }

    return (
        <Flex direction="column" gap="2" mb="6" ml="2" mr="2">
            <Flex direction="row" m="2" justify="center" align="center" gap="1">
                <TextField.Root
                    style={{ minWidth: "300px" }}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Button onClick={onSearch}>
                    <Search style={{ width: "15px" }} />
                </Button>
            </Flex>

            {users
                .filter(currentUser => {
                    const userId = currentUser.Attributes.find(a => a.Name === "sub")?.Value
                    return userId !== user?.getId()
                })
                .map(currentUser => {
                    const userAvatar = currentUser.Attributes.find(a => a.Name === "picture")?.Value
                    const userName = currentUser.Attributes.find(a => a.Name === "name")?.Value
                    const userEmail = currentUser.Attributes.find(a => a.Name === "email")?.Value
                    const userId = currentUser.Attributes.find(a => a.Name === "sub")?.Value

                    return (
                        <Card key={userId} mb="2">
                            <Flex gap="2" direction="row" align="center">
                                <Avatar
                                    src={userAvatar}
                                    alt={userName}
                                    fallback={userName || "N/A"}
                                    size="4"
                                    referrerPolicy="unsafe-url"
                                />

                                <Flex direction="column">
                                    <Flex direction="column" gap="1" align="start">
                                        <Text size="3">{userName}</Text>
                                    </Flex>

                                    <Flex direction="row" gap="1">
                                        <Heading as="h4" size="1">Email:</Heading>
                                        <Text size="1">{userEmail}</Text>
                                    </Flex>

                                    <Flex direction="row" gap="1">
                                        <Heading as="h4" size="1">Joined:</Heading>
                                        <Text size="1">{new Date(currentUser.UserCreateDate).toDateString()}</Text>
                                    </Flex>

                                    <Flex direction="row" gap="1">
                                        <Heading as="h4" size="1">Last Session:</Heading>
                                        <Text size="1">{new Date(currentUser.UserLastModifiedDate).toDateString()}</Text>
                                    </Flex>
                                </Flex>
                            </Flex>

                            <Flex justify="center" align="center" wrap="wrap">
                                <Button
                                    onClick={() => onGetProfile(currentUser)}
                                    variant="surface" style={{ width: "100%" }} m="2"
                                    disabled={userId === user?.getId()}
                                >
                                    See profile
                                </Button>

                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger>
                                        <Button
                                            onClick={() => onGetProfile(currentUser)}
                                            variant="surface" style={{ width: "100%" }} m="2"
                                            disabled={userId === user?.getId()}
                                        >
                                            Transfer Project
                                        </Button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content>
                                        {
                                            Object
                                                .values(projects.getProjects())
                                                .filter(project => project.getUserId() === user.getId())
                                                .map(project => {
                                                    return (
                                                        <Button variant="ghost" size="3" m="2" onClick={() => onTransferProject(currentUser, project)}>
                                                            {project.getName()}
                                                        </Button>
                                                    )
                                                })
                                        }
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </Flex>
                        </Card>
                    )
                })}

            {page ? <Button onClick={onNext} variant="outline">
                Next
            </Button> : null}
        </Flex>
    )
}

export default RouteAdminUsersList