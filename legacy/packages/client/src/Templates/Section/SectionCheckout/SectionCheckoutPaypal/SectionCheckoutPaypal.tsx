import { Flex } from "@radix-ui/themes"
import React from "react"
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../../templateTypes"
import { PayPalButtons, PayPalScriptProvider, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

interface SectionCheckoutPaypalProps {
    "data-hydration-id"?: string
}

const SectionCheckoutPaypal: React.FC<SectionCheckoutPaypalProps> = (props) => {
    const initialOptions: ReactPayPalScriptOptions = {
        clientId: "YOUR_CLIENT_ID",
        // Add other options as needed
        // merchantId: "",
    };

    return (
        <Flex
            direction="column" justify='center' align="center" mb="2"
            data-hydration-id={props["data-hydration-id"]}
        >
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons />
            </PayPalScriptProvider>
        </Flex>
    )
}

export const SectionCheckoutPaypalItem: TemplateStruct<SectionCheckoutPaypalProps> = {
    name: TemplateComponentType.CHECKOUT_STRIPE,
    Component: SectionCheckoutPaypal,
    categories: [TemplateCategory.CHECKOUT],
    description: "Checkout Paypal",
    classNames: [

    ],
    props: {}
}
export default SectionCheckoutPaypal
