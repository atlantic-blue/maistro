import { AiContentsCreateInput, AiContentsCreateOutput } from "../../Api/Ai/aiContentsCreate"

interface CreateSectionHeroPromptInput {
    projectName: string
    description: string
    benefits: string
    targetAudience: string
    cta: string
    emotion: string
}

interface CreateSectionHeroPromptOutput {
    title: string,
    content: string,
    cta: string,
}

const createSectionHeroPrompt = async (
    input: CreateSectionHeroPromptInput,
    token: string,
    projectId: string,
    request: (input: AiContentsCreateInput) => Promise<AiContentsCreateOutput>
): Promise<CreateSectionHeroPromptOutput> => {
    try {
        const prompt = `
        Create a JSON structured as {"title", "content", "cta"}
        for a landing page promoting the product ${input.projectName}.
        The product is described as ${input.description}
        The product enables ${input.benefits}.
        Targeted at ${input.targetAudience}.
        The CTA want to take the following action ${input.cta}
        
        Write a compelling, 1 sentence title,
        a 1 sentence content subtitle, 
        and a 1 sentence call-to-action (CTA).
        Keep sentences short.
        The tone should be ${input.emotion}.
        Only provide one JSON response with the entries "title", "content", and "cta".
        `
        const promptAiResponse = await request({
            token,
            projectId,
            data: prompt
        })

        return JSON.parse(promptAiResponse.output.trim().replace(/^```|```$/g, '').trim()) as CreateSectionHeroPromptOutput
    } catch (error) {
        // TODO app level error
        console.error(error)

        return {
            title: "",
            content: "",
            cta: "",
        }
    }
}

export default createSectionHeroPrompt