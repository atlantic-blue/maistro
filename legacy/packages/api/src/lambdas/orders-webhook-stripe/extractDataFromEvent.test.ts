import { extractDataFromEvent, extractFulfillmentDetails } from "./extractDataFromEvent";
import { checkoutCompletedFixture } from "./checkoutCompletedFixture"

describe("Extract Data ", () => {
    it("should support CheckoutSessionCompletedEvent", () => {
        const event = checkoutCompletedFixture
        const value = extractDataFromEvent(event, {
            date: "2024-08-09T14:30:00.000Z",
            interval: "15:00 - 15:30"
        })
        const expected = {
            projectId: '1f8418a9-527f-4856-b231-e523f6468025',
            orderId: 'bce3495b-3e74-4560-8a27-5f9ea57f18f9',
            paymentIntent: "pi_3QBqPIQjzqJXb0YW0GvpAV9Z",
            returnUrl: "https://sweetsin.maistro.live/order?orderId=bce3495b-3e74-4560-8a27-5f9ea57f18f9",
            customerDetails: {
                address: {
                    city: "Mock city",
                    country: "AU",
                    line1: "160 Mock Street",
                    line2: "",
                    postalCode: "5000",
                    state: "SA",
                },
                email: "mockEmail@gmail.com",
                name: "Mock User Name",
                phone: "+0000000000",
            },
            fulfilment: {
                date: "2024-08-09T14:30:00.000Z",
                interval: "15:00 - 15:30",
            }
        }

        expect(value).toEqual(expected)
    })

    it("it should extract data from Dynamo attributes from the orders table", () => {
        const attributes = {
            fulfillment: {
                M: {
                    date: { S: "2024-08-09T14:30:00.000Z" },
                    interval: { S: "15:00 - 15:30" }
                }
            },
        }

        const value = extractFulfillmentDetails(attributes)
        const expected = {
            date: "2024-08-09T14:30:00.000Z",
            interval: "15:00 - 15:30"
        }

        expect(value).toEqual(expected)
    })
})