import React from "react"
import { Card, Container, Flex, Heading, Section, Skeleton, Text } from "@radix-ui/themes"

const RouteBrainstormSkeleton = () => {
    return (
        <Section m="6">
            <Card>
                <Flex justify="center" direction="column" gap="3" align="center">
                    <Container size="1">
                        <Flex direction="column" gap="3">
                            <Text>
                                <Skeleton>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                                    felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
                                    erat, fringilla sed commodo sed, aliquet nec magna.
                                </Skeleton>
                            </Text>

                            <Skeleton>
                                <Text>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                                    felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
                                    erat, fringilla sed commodo sed, aliquet nec magna.
                                </Text>
                            </Skeleton>
                        </Flex>
                    </Container>

                    <Heading m="3" size="5">
                        Generating Content...
                    </Heading>
                </Flex>
            </Card>
        </Section>
    )
}

export default RouteBrainstormSkeleton