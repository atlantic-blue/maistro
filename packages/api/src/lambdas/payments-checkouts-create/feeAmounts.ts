import Stripe from "stripe"

const calculateFeeAmount = (
    input: Stripe.Checkout.SessionCreateParams.LineItem[],
    feePercentage: number
) => {
    const total = input.reduce((acc, next) => {
        const quantity = next.quantity || 1
        if (!next.price_data) {
            return acc
        }

        const unit_amount = next.price_data?.unit_amount || 0
        const unit_amount_decimal = Number(`0.${next.price_data?.unit_amount_decimal}`) || 0
        const itemPrice = unit_amount + unit_amount_decimal

        const total = itemPrice * quantity
        return acc + total
    }, 0)

    const fee = (total * (feePercentage / 100)).toFixed(2)
    return Number(fee)
}

export {
    calculateFeeAmount
}