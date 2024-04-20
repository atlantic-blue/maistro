import env from "../../env"

interface ProjectsReadInput {
    projectId: string
    token: string
    name: string
    url: string
}

const projectsUpdateById = async (
    {
        projectId,
        token,

        name,
        url
    }: ProjectsReadInput,
    apiUrl = env.api.projects.update,
    request = fetch,
): Promise<void> => {
    return request(`${apiUrl}/${projectId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            name,
            url
        })
    }).then(response => response.json())
}

export {
    projectsUpdateById
}