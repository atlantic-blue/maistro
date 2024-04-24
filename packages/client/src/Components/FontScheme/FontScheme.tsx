import React, { useEffect, useState } from 'react';

import * as styles from "./FontScheme.scss"
import { Box, Heading, Select, Text } from '@radix-ui/themes';

interface FamilyFont {
    name: string
    family: string
    css: string
    description: string
}

const familyFont: Record<string, FamilyFont> = {
    Roboto: {
        name: "Roboto",
        family: "Roboto",
        css: `"Roboto", sans-serif`,
        description: "Offers a mechanical skeleton and the forms are largely geometric. At the same time, the font features friendly and open curves. While some grotesks distort their letterforms to force a rigid rhythm, Roboto doesn’t compromise, allowing letters to be settled into their natural width.",
    },
    "Open Sans": {
        name: "Open Sans",
        family: "Open+Sans",
        css: `"Open Sans", sans-serif`,
        description: "It's neutral but friendly. It's excellent for both titles and paragraphs and is known for its readability on desktops and mobile devices alike.",
    },
    Lato: {
        name: "Lato",
        family: "Lato",
        css: `"Lato", sans-serif`,
        description: `Lato is a sanserif type­face family designed in the Summer 2010 by Warsaw-based designer Łukasz Dziedzic. Lato means "Summer" in Polish.`,
    },
    Montserrat: {
        name: "Montserrat",
        description: " Inspired by the old posters and signs in the traditional Montserrat neighborhood of Buenos Aires, this font has a lot of personality and can be used for both text and display use.",
        family: "Montserrat",
        css: `"Montserrat", sans-serif`,
    },
    Merriweather: {
        name: "Merriweather",
        family: "Merriweather",
        css: `"Merriweather", sans-serif`,
        description: "A serif font that's designed to be readable on screens. It features a very large x-height, slightly condensed letterforms, mild diagonal stress, sturdy serifs, and open forms.",
    },
    "Playfair Display": {
        name: "Playfair Display",
        family: "Playfair+Display",
        css: `"Playfair Display", sans-serif`,
        description: "With its high contrast and distinctive style, it’s suitable for headlines and titles. It draws inspiration from the 18th century and the time of enlightenment.",
    },
    Raleway: {
        name: "Raleway",
        family: "Raleway",
        css: `"Raleway", sans-serif`,
        description: "An elegant, sans-serif typeface family intended for headings and other large size usage. It also supports a wide range of languages",
    },
}

export const getFontFamilyHref = (fontFamily: string) => {
    return (
        `https://fonts.googleapis.com/css2?family=${fontFamily}:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap`
    )
}

const createFontLoader = () => {
    const downloaded: FamilyFont[] = []
    return (fontFamily: FamilyFont) => {
        if (downloaded.includes(fontFamily)) {
            return
        }

        const link = document.createElement('link');
        link.href = getFontFamilyHref(fontFamily.family);
        link.rel = 'stylesheet';
        link.crossOrigin = "anonymous"

        document.head.appendChild(link);
        downloaded.push(fontFamily)
    }
};

const loadFont = createFontLoader()

interface FontDesignProps {
    onChange(data: {
        heading: FamilyFont;
        body: FamilyFont;
    }): void
}

const FontDesign: React.FC<FontDesignProps> = ({
    onChange
}) => {
    const [headingFont, setHeadingFont] = useState<FamilyFont>(familyFont.Merriweather);
    const [bodyFont, setBodyFont] = useState<FamilyFont>(familyFont.Roboto);

    useEffect(() => {
        loadFont(headingFont)
        loadFont(bodyFont)
        onChange({
            heading: headingFont,
            body: bodyFont
        })
    }, [headingFont, bodyFont])

    return (
        <Box className={styles.container}>
            <Box className={styles.display}>
                <Heading as="h2" style={{ fontFamily: headingFont.css }}>
                    {headingFont.name} - Heading Example
                </Heading>
                <Text as="p" style={{ fontFamily: bodyFont.css }}>
                    This is a <strong>{bodyFont.name}</strong> body text example. {bodyFont.description}
                </Text>
            </Box>

            <Box className={styles.form}>
                <Box className={styles.formSection}>
                    <Text as="label" size="2">
                        Select Heading Font
                    </Text>
                    <Select.Root
                        size="2"
                        defaultValue={familyFont["Roboto"].name}
                        onValueChange={(value) => setHeadingFont(familyFont[value])}
                    >
                        <Select.Trigger />
                        <Select.Content>
                            {Object.keys(familyFont).map((option, index) => (
                                <Select.Item
                                    key={index}
                                    value={option}>
                                    {familyFont[option].name}
                                </Select.Item>
                            ))}
                            <Select.Item value="orange">Orange</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Box>

                <Box className={styles.formSection}>
                    <Text as="label" size="2">
                        Select Body Font
                    </Text>
                    <Select.Root
                        size="2"
                        defaultValue={familyFont["Roboto"].name}
                        onValueChange={(value) => setBodyFont(familyFont[value])}
                    >
                        <Select.Trigger />
                        <Select.Content>
                            {Object.keys(familyFont).map((option, index) => (
                                <Select.Item
                                    key={index}
                                    value={option}>
                                    {familyFont[option].name}
                                </Select.Item>
                            ))}
                            <Select.Item value="orange">Orange</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Box>
            </Box>
        </Box>
    );
};

export default FontDesign;