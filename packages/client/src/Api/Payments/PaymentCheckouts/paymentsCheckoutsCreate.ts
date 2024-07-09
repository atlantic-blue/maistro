import env from "../../../env"
import sanitiseInput from "../../../Utils/sanitiseInput"
import { keysToSnakeCase } from "../../../Utils/toSnakeCase"
import { requestController } from "../../fetch"

interface LineItem {
    quantity: number
    priceData: {
        currency: string
        unitAmount: number
        unitAmountDecimal: string
        productData: {
            name: string
            description: string
            images: string[]
        }
    }
}

export interface PaymentsCheckoutsCreateInput {
    projectId: string
    returnUrl: string
    lineItems: LineItem[]
}

export interface PaymentsCheckoutsCreateOutput {

}

const paymentsCheckoutsCreate = async (
    input: PaymentsCheckoutsCreateInput,
    url = env.api.payments.checkouts.create,
    request = requestController.fetch,
) => {
    return request(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            sanitiseInput(
                keysToSnakeCase(input)
            )
        )
    }).then(response => response.json())
}

export default paymentsCheckoutsCreate
