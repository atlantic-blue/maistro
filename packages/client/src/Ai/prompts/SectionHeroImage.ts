import { AiImagesCreateInput, AiImagesCreateOutput } from "../../Api/Ai/aiImagesCreate"

interface CreateImagePromptInput {
    projectName: string
    description: string
    targetAudience: string
    emotion: string
    details?: string
}

interface CreateImagePromptOutput {
    src: string,
}

const createImagePrompt = async (
    input: CreateImagePromptInput,
    token: string,
    projectId: string,
    request: (input: AiImagesCreateInput) => Promise<AiImagesCreateOutput>
): Promise<CreateImagePromptOutput> => {
    try {
        const prompt = `
        ${input.details}.
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

export default createImagePrompt