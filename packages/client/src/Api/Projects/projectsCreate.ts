import env from "../../env"

interface ProjectsCreateInput {
    name: string
    token: string
}

interface ProjectsCreateOutput {
    id: string
    name: string
}

const projectsCreate = async (
    {
        token,
        name
    }: ProjectsCreateInput,
    url = env.api.projects.create,
    request = fetch,
): Promise<ProjectsCreateOutput> => {
    return request(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            name
        })
    }).then(response => response.json())
}

export {
    projectsCreate
}