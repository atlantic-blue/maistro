import React from "react"
import { Box, Button, Card, Flex, Heading, Separator, Text } from "@radix-ui/themes"
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../../templateTypes"

interface Product {
    title: string
    description: string
    imgSrc: string
    price: string
    currency: string
    cta: string
}

export interface SectionProductsBasicProps {
    products: Product[]
}

const Product: React.FC<Product> = (props) => {
    return (
        <Box width="300px" minHeight="380px">
            <Card size="2" variant="surface">
                <Flex mb="2" position="relative">
                    <img
                        src={props.imgSrc}
                        alt={props.title}
                        style={{
                            display: 'block',
                            objectFit: 'cover',
                            width: '100%',
                            height: 200,
                            backgroundColor: 'var(--gray-5)',
                        }}
                    />
                </Flex>
                <Flex mb="2" justify="between">
                    <Box>
                        <Heading size="4">
                            {props.title}
                        </Heading>
                    </Box>
                    <Text size="6" weight="bold">
                        {props.currency}{props.price}
                    </Text>
                </Flex>

                <Flex mb="1">
                    <Text as="p" size="2" mb="10px">
                        {props.description}
                    </Text>
                </Flex>

                <Flex justify="end">
                    <Button size="2">
                        {props.cta}
                    </Button>
                </Flex>
            </Card>
        </Box>
    )
}

const SectionProductsBasic: React.FC<SectionProductsBasicProps> = (props) => {
    return (
        <Flex direction="column" justify='center' align="center" mb="2">
            <Flex wrap="wrap" m="2" gap="3" align="stretch" justify="center">
                {props.products?.map(product => {
                    return (
                        <Product
                            key={`${product.title}-${Date.now()}`}
                            {...product}
                        />
                    )
                })}
            </Flex>
        </Flex>
    )
}

export const SectionProductsBasicItem: TemplateStruct<SectionProductsBasicProps> = {
    name: TemplateComponentType.PRODUCTS_BASIC,
    Component: SectionProductsBasic,
    categories: [TemplateCategory.PRODUCT],
    description: "Product Basic",
    classNames: [
        // ...Object.values(styles),
        // ...Object.values(ButtonStyles),
    ],
    props: {
        products: [
            {
                title: "Brownies",
                description: "The art and technique of arranging type to make written language legible, readable and appealing when displayed.",
                currency: "$",
                price: "123",
                imgSrc: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxM3x8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                cta: "Add to cart"
            },
            {
                title: "Macaroons",
                description: "The art and technique of arranging type to make written language legible, readable and appealing when displayed.",
                currency: "$",
                price: "123",
                imgSrc: "https://images.unsplash.com/photo-1558326567-98ae2405596b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                cta: "Add to cart"
            },
            {
                title: "Tart",
                description: "The art and technique of arranging type to make written language legible, readable and appealing when displayed.",
                currency: "$",
                price: "123",
                imgSrc: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxM3x8ZGVzc2VydHN8ZW58MHx8fHwxNzIwMzEzMjk5fDA&ixlib=rb-4.0.3&q=85",
                cta: "Add to cart"
            },
            {
                title: "Pie",
                description: "The art and technique of arranging type to make written language legible, readable and appealing when displayed.",
                currency: "$",
                price: "123",
                imgSrc: "https://images.unsplash.com/photo-1560180474-e8563fd75bab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNHx8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                cta: "Add to cart"
            }
        ],
    },
}

export default SectionProductsBasic