import React, { useState } from 'react';

import { ColourScheme } from '../../types';
import { defaultColorScheme } from '../../PageContext';
import IconRandom from '../Icons/Random/Random';

import { generateMatchingHexColors, lighten } from './utils';

import * as styles from "./ColourScheme.scss"
import { Box, Button, Heading } from '@radix-ui/themes';

const createColourScheme = (primaryColor: string, secondaryColor: string): ColourScheme => {
    return {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: lighten(primaryColor, 30),
        background: '#f0f0f0',
        neutral: lighten(secondaryColor, 20),
        text: '#333333',
        palette: [
            primaryColor,
            lighten(primaryColor, 20),
            lighten(secondaryColor, -20),
            secondaryColor,
        ]
    }
}

const recommendedColourSchemes: ColourScheme[] = [
    createColourScheme("#FF204E", "#00224D"),
    createColourScheme("#EFBC9B", "#9CAFAA"),
    createColourScheme("#124176", "#FFC374"),
    createColourScheme("#27374D", "#DDE6ED"),
    createColourScheme("#884A39", "#F9E0BB"),

    createColourScheme("#A75D5C", "#FFC3A1"),
    createColourScheme("#071952", "#97FEED"),
    createColourScheme("#070047", "#FF5F9E"),
    createColourScheme("#FFC94A", "#453F78"),
    createColourScheme("#FFBB5C", "#C63D2F"),
]

interface ColorSchemeProps {
    colourScheme: ColourScheme
    onChange: (colourScheme: ColourScheme) => void
}

const Palette: React.FC<{ colorScheme: ColourScheme }> = ({ colorScheme }) => {
    return (
        <div className={styles.palette}>
            {colorScheme.palette.map((color, index) => (
                <div key={index} className={styles.paletteColour} style={{ backgroundColor: color }}></div>
            ))}
        </div>
    )
}

const ColorScheme: React.FC<ColorSchemeProps> = ({ colourScheme, onChange }) => {
    const scheme = colourScheme?.primary ? colourScheme : defaultColorScheme
    const initialColours = colourScheme.primary ? { primaryColor: colourScheme.primary, secondaryColor: colourScheme.secondary } : generateMatchingHexColors()

    const [primaryColor, setPrimaryColor] = useState(initialColours.primaryColor);
    const [secondaryColor, setSecondaryColor] = useState(initialColours.secondaryColor);
    const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');
    const [textColor, setTextColor] = useState('#333333');

    const [colorScheme, setColorScheme] = useState<ColourScheme>(scheme);
    const [history, setHistory] = useState<ColourScheme[]>([])

    const onSetColours = () => {
        const { primaryColor, secondaryColor } = generateMatchingHexColors()
        setPrimaryColor(primaryColor)
        setSecondaryColor(secondaryColor)
    }

    const onHistoryClick = (colorScheme: ColourScheme) => {
        setPrimaryColor(colorScheme.primary)
        setSecondaryColor(colorScheme.secondary)
    }

    React.useEffect(() => {
        const colourScheme: ColourScheme = {
            primary: primaryColor,
            secondary: secondaryColor,
            accent: lighten(primaryColor, 30),
            background: backgroundColor,
            neutral: lighten(secondaryColor, 20),
            text: textColor,
            palette: [
                primaryColor,
                lighten(primaryColor, 20),
                lighten(secondaryColor, -20),
                secondaryColor,
            ]
        }

        setColorScheme(colourScheme);
        onChange(colourScheme)
    }, [primaryColor, secondaryColor, backgroundColor, textColor])

    React.useEffect(() => {
        setHistory(prev => {
            return [
                ...prev,
                colorScheme
            ].slice(0, 11)
        })
    }, [primaryColor, secondaryColor])

    return (
        <Box className={styles.main}>
            <Box className={styles.selection}>
                <Box className={styles.selectionOption}>
                    <input className={styles.selectionColor} type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                    <div>Primary</div>
                </Box>
                <Box className={styles.selectionOption}>
                    <input className={styles.selectionColor} type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                    <div>Secondary</div>
                </Box>
                <Box className={styles.selectionOption}>
                    <input className={styles.selectionColor} type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
                    <div>Background</div>
                </Box>
                <Box className={styles.selectionOption}>
                    <input className={styles.selectionColor} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                    <div>Text</div>
                </Box>
            </Box>
            <Button
                className={styles.button}
                onClick={onSetColours}>
                <IconRandom className={styles.buttonIcon} />
                <span>Randomize</span>
            </Button>
            <Box className={styles.palette}>
                <Palette colorScheme={colorScheme} />
            </Box>
            <Heading as="h4">Recommended</Heading>
            <Box className={styles.history}>
                {recommendedColourSchemes.map(colorScheme => {
                    return (
                        <div key={`recommendedColourSchemes-${colorScheme.primary}`} onClick={() => onHistoryClick(colorScheme)}>
                            <Palette colorScheme={colorScheme} />
                        </div>
                    )
                })}
            </Box>
            {history.length > 1 && <div>History</div>}
            <Box className={styles.history}>
                {history.map(colorScheme => {
                    return (
                        <div key={`history-${colorScheme.primary}`} onClick={() => onHistoryClick(colorScheme)}>
                            <Palette colorScheme={colorScheme} />
                        </div>
                    )
                }).slice(1)}
            </Box>
        </Box>
    );
};

export default ColorScheme;