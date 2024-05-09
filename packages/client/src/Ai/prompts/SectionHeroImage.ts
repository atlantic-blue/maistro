import { AiImagesCreateInput, AiImagesCreateOutput } from "../../Api/Ai/aiImagesCreate"

interface CreateSectionHeroImagePromptInput {
    projectName: string
    description: string
    targetAudience: string
    emotion: string
}

interface CreateSectionHeroImagePromptOutput {
    src: string,
}

const createSectionHeroImagesPrompt = async (
    input: CreateSectionHeroImagePromptInput,
    token: string,
    projectId: string,
    request: (input: AiImagesCreateInput) => Promise<AiImagesCreateOutput>
): Promise<CreateSectionHeroImagePromptOutput> => {
    try {
        const prompt = `
        ${input.projectName} ${input.description}.
        The tone should be ${input.emotion}.
        Targeted at ${input.targetAudience}.
        `

        const promptAiResponse = await request({
            token,
            projectId,
            data: prompt
        })

        return {
            src: promptAiResponse.src
        }
    } catch (error) {
        // TODO app level error
        console.error(error)

        return {
            src: "",
        }
    }
}

export default createSectionHeroImagesPrompt