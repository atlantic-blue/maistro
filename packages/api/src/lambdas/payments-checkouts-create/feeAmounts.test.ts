import Stripe from "stripe"
import { calculateFeeAmount } from "./feeAmounts"

describe("fee amounts", () => {
    it("calculates fee amount", () => {
        const input: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 2,
                price_data: {
                    currency: "gbp",
                    unit_amount: 1000,
                }
            }
        ]

        const feePercentage = 2
        const output = calculateFeeAmount(input, feePercentage)
        const expected = 0

        expect(output).toBe(expected)
    })

    it("calculates multiple entries", () => {
        const input: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "gbp",
                    unit_amount: 1000,
                }
            },
            {
                quantity: 2,
                price_data: {
                    currency: "gbp",
                    unit_amount: 5000,
                }
            }
        ]

        const feePercentage = 1
        const output = calculateFeeAmount(input, feePercentage)
        const expected = 110

        expect(output).toBe(expected)
    })

    it("breaks over null price_data", () => {
        const input: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "gbp",
                    unit_amount: 1000,
                }
            },
            {
                quantity: 2,
            }
        ]

        const feePercentage = 1
        const output = calculateFeeAmount(input, feePercentage)
        const expected = 0

        expect(output).toBe(expected)
    })

    it("has a default quantity", () => {
        const input: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                price_data: {
                    currency: "gbp",
                    unit_amount: 20000,
                }
            },
        ]

        const feePercentage = 1
        const output = calculateFeeAmount(input, feePercentage)
        const expected = 200

        expect(output).toBe(expected)
    })
})