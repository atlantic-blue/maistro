import env from "../../env"
import { Project } from "../../Store/Project"
import { requestController } from "../fetch"
import { projectUpload } from "./projectUpload"

const createRobotsFile = (sitemap: string) => `
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /

Sitemap: ${sitemap}
`

const createSitemapFile = (project: Project) => {
    const pagesReferences = Object.values(project.getPages()).map(page => {
        return (`
<url>
<loc>https://${project.getUrl()}/${page.getPath() === "index" ? "" : page.getPath()}</loc>
<lastmod>${new Date().toISOString()}</lastmod>
</url>
`)
    })

    return `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!--  created with Maistro https://maistro.website  -->
${pagesReferences.join("\n")}
</urlset>
`
}

interface PostSitemapInput {
    token: string
    project: Project
}

const postSitemap = (
    {
        token,
        project,
    }: PostSitemapInput,
    url = env.api.file.create,
    request = requestController.fetch
) => {
    const sitemapFileName = "sitemap.xml"
    return [
        projectUpload({
            token,
            projectId: project.getId(),
            fileName: "sitemap.xml",
            fileContent: createSitemapFile(project),
            fileType: "text/xml",
            path: "",
        }),
        projectUpload({
            token,
            projectId: project.getId(),
            fileName: "robots.txt",
            fileContent: createRobotsFile(`https://${project.getUrl()}/${sitemapFileName}`),
            fileType: "text/plain",
            path: "",
        })
    ]
}

export default postSitemap
