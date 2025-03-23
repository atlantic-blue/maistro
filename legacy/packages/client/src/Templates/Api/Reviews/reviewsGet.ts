import { ReviewsStruct } from "../../types"

interface ReviewsGetInput {
    projectId: string
}

interface ReviewsGetOutput {
    data?: ReviewsStruct,
    errors?: Array<{ description: string }>
}

export const ReviewsGet = async (input: ReviewsGetInput): Promise<ReviewsGetOutput> => {
    return await fetch(`https://api.maistro.website/payments/shopping-carts/${input.ReviewsId}`, {
        method: "GET",
    })
        .then(response => response.json())
        .then((response: ReviewsStruct[]) => {
            if (!response) {
                return {
                    errors: [
                        {
                            description: "Unable to get shopping cart"
                        }
                    ]
                }
            }

            const cart = response.filter(r => r.id === input.ReviewsId)[0]

            return {
                data: cart
            }
        })
        .catch(e => {
            return {
                errors: [
                    {
                        description: "Unable to get shopping cart"
                    }
                ]
            }
        })
}
