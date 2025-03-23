import React, { useState, useContext } from 'react';
import { Avatar, Box, Button, Card, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import EditorData, { EditorDataType } from './EditorData';
import { ProjectsContext } from "../../Projects";
import { useParams } from "react-router-dom";
import { SectionProductsEnhancedProps } from '../../Templates/Section/SectionProducts/SectionProductsEnhanced/SectionProductsEnhanced';
import { ProductStruct } from '../../Templates/types';

interface EditorProps {
    onSaveData: (props: SectionProductsEnhancedProps) => void;
    onUploadFile: (file: File) => Promise<string>;
    children: React.ReactNode;
}

const ProductEnhancedEditor: React.FC<SectionProductsEnhancedProps & EditorProps> = (props) => {
    const { projects } = useContext(ProjectsContext);
    const { projectId } = useParams();
    const project = projects.getProjectById(projectId || "");

    const [state, setState] = useState<SectionProductsEnhancedProps>(props);

    const onSave = () => {
        props.onSaveData({
            ...state,
            projectId: projectId || "",
        });
    };

    const handleProductChange = (index: number, field: keyof ProductStruct, value: any) => {
        const updatedProducts = [...state.products];
        updatedProducts[index] = { ...updatedProducts[index], [field]: value };
        setState(prev => ({ ...prev, products: updatedProducts }));
    };

    const handleRemoveProduct = (index: number) => {
        const updatedProducts = state.products.filter((_, i) => i !== index);
        setState(prev => ({ ...prev, products: updatedProducts }));
    };

    return (
        <>
            <Flex gap="3" mt="4" justify="end" mb="2">
                <Button onClick={onSave}>Save</Button>
            </Flex>
            <Flex direction="column" gap="3">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="soft">
                            Select Product
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <Flex align="start" gap="3" direction="column">
                            {Object.values(project.getProducts())
                                .filter(p => !state.products.find(sp => sp.id === p.getId()))
                                .map(product => (
                                    <DropdownMenu.Item
                                        key={product.getId()}
                                        onClick={() => {
                                            setState(prev => ({
                                                ...prev,
                                                products: [
                                                    ...prev.products,
                                                    {
                                                        id: product.getId(),
                                                        name: product.getName(),
                                                        description: product.getDescription(),
                                                        price: product.getPrice(),
                                                        currency: product.getCurrency(),
                                                        images: product.getImages(),
                                                        stockQuantity: product.getStockQuantity(),
                                                        updatedAt: new Date().toISOString(),
                                                        modifiers: product.getModifiers(),
                                                    }
                                                ]
                                            }));
                                        }}
                                    >
                                        <Flex align="center" gap="1">
                                            <Avatar
                                                size="2"
                                                src={product.getImages()[0]}
                                                alt={product.getName()}
                                                fallback={product.getName()}
                                            />
                                            <Text>{product.getName()}</Text>
                                        </Flex>
                                    </DropdownMenu.Item>
                                ))}
                        </Flex>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                <Box>
                    {state.products?.map((product, index) => (
                        <Card mb="2" key={product.id}>
                            <EditorData
                                disabled
                                type={EditorDataType.TEXT}
                                name="Name"
                                value={product.name}
                                onChange={() => { }}
                            />

                            <EditorData
                                type={EditorDataType.TEXT}
                                name="Description"
                                value={product.description}
                                onChange={(data) => handleProductChange(index, 'description', data)}
                            />

                            <EditorData
                                type={EditorDataType.TEXT}
                                name="Price"
                                value={product.price.toString()}
                                onChange={(data) => handleProductChange(index, 'price', Number(data))}
                            />

                            <Flex gap="2" align="center" wrap="wrap" justify="center">
                                {product.images.map((image, imgIndex) => (
                                    <Avatar
                                        size={imgIndex === 0 ? "7" : "5"}
                                        key={image}
                                        src={image}
                                        alt={product.name}
                                        fallback={"Not Available"}
                                        onClick={() => {
                                            const newImages = [...product.images];
                                            [newImages[0], newImages[imgIndex]] = [newImages[imgIndex], newImages[0]];
                                            handleProductChange(index, 'images', newImages);
                                        }}
                                    />
                                ))}
                            </Flex>

                            <Flex justify="end" m="2">
                                <Button
                                    size="1"
                                    variant="ghost"
                                    onClick={() => handleRemoveProduct(index)}
                                >
                                    Remove Product
                                </Button>
                            </Flex>
                        </Card>
                    ))}
                </Box>
            </Flex>
            {props.children}

            <Flex gap="3" mt="4" justify="end">
                <Button onClick={onSave}>Save</Button>
            </Flex>
        </>
    );
};

export default ProductEnhancedEditor;