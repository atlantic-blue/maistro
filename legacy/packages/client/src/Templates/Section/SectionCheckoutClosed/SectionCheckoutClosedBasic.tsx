import { Button, Dialog, Flex } from "@radix-ui/themes"
import React from "react"
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../templateTypes"

interface SectionCheckoutClosedBasicProps {
    "data-hydration-id"?: string
    title: string
    content: string
}

const SectionCheckoutClosedBasic: React.FC<SectionCheckoutClosedBasicProps> = (props) => {
    return (
        <div data-hydration-id={props["data-hydration-id"]}>
            <Dialog.Root>
                <Dialog.Trigger>
                    <Button>Edit profile</Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="450px">
                    <Dialog.Description size="2" mb="4">
                        {props.content}
                    </Dialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                Continue
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </div>
    )
}

export const SectionCheckoutClosedBasicItem: TemplateStruct<SectionCheckoutClosedBasicProps> = {
    name: TemplateComponentType.SUBSCRIBE_BASIC,
    description: "A basic contact form for user inquiries.",
    Component: SectionCheckoutClosedBasic,
    categories: [TemplateCategory.SUBSCRIBE],
    props: {
        title: "",
        content: "We are currently not accepting orders"
    },
    classNames: []
};
