import Stripe from "stripe";

// https://docs.stripe.com/currencies#zero-decimal
// TODO: calculate minimum based on currency
const calculateFeeAmount = (
    input: Stripe.Checkout.SessionCreateParams.LineItem[],
    feePercentage: number,
) => {
    const total = input.reduce((acc, next) => {
        const quantity = next.quantity || 1;
        if (!next.price_data) {
            return acc;
        }

        const unit_amount = (next.price_data?.unit_amount || 0);
        const total = unit_amount * quantity;
        return acc + total;
    }, 0);


    const fee = Number((total * feePercentage) / 100).toFixed(0)
    console.log({ total, fee })
    return Number(fee) > 50 ? Number(fee) : 0;
};

export { calculateFeeAmount };
