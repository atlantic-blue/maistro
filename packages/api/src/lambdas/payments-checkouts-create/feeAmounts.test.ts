import Stripe from "stripe"
import { calculateFeeAmount } from "./feeAmounts"

describe("fee amounts", () => {
    it("calculates fee amount", () => {
        const input: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 2,
                price_data: {
                    currency: "gbp",
                    unit_amount: 100,
                    unit_amount_decimal: "25"
                }
            }
        ]

        const feePercentage = 2
        const output = calculateFeeAmount(input, feePercentage)
        const expected = 4.01

        expect(output).toBe(expected)
    })

    it("calculates multiple entries", () => {
        const input: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "gbp",
                    unit_amount: 10,
                }
            },
            {
                quantity: 2,
                price_data: {
                    currency: "gbp",
                    unit_amount: 5,
                }
            }
        ]

        const feePercentage = 1
        const output = calculateFeeAmount(input, feePercentage)
        const expected = 0.2

        expect(output).toBe(expected)
    })

    it("breaks over null price_data", () => {
        const input: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "gbp",
                    unit_amount: 10,
                }
            },
            {
                quantity: 2,
            }
        ]

        const feePercentage = 1
        const output = calculateFeeAmount(input, feePercentage)
        const expected = 0.1

        expect(output).toBe(expected)
    })

    it("has a default quantity", () => {
        const input: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                price_data: {
                    currency: "gbp",
                    unit_amount: 10,
                }
            },
        ]

        const feePercentage = 1
        const output = calculateFeeAmount(input, feePercentage)
        const expected = 0.1

        expect(output).toBe(expected)
    })
})