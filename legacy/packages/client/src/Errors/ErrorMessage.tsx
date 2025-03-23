import React from "react"
import { Callout } from "@radix-ui/themes"
import IconMinus from "../Components/Icons/Minus/Minus"

const ErrorMessage: React.FC = () => {
    return (
        <Callout.Root color="red" role="alert">
            <Callout.Icon>
                <IconMinus />
            </Callout.Icon>
            <Callout.Text>
                Something went wrong!
            </Callout.Text>
        </Callout.Root>
    )
}

export default ErrorMessage