import { ColourPalette, ColourScheme, FontFamily, FontScheme } from "../types";

export const appendColourSchemeToDocument = (scheme: ColourScheme) => {
    document.documentElement.style.setProperty(ColourPalette.ACCENT, scheme.accent);
    document.documentElement.style.setProperty(ColourPalette.BACKGROUND, scheme.background);
    document.documentElement.style.setProperty(ColourPalette.NEUTRAL, scheme.neutral);
    document.documentElement.style.setProperty(ColourPalette.PRIMARY, scheme.primary);
    document.documentElement.style.setProperty(ColourPalette.SECONDARY, scheme.secondary);
    document.documentElement.style.setProperty(ColourPalette.TEXT, scheme.text);
}

export const appendFontSchemeToDocument = (scheme: FontScheme) => {
    document.documentElement.style.setProperty(FontFamily.BODY, scheme.body.css);
    document.documentElement.style.setProperty(FontFamily.HEADING, scheme.heading.css);
}
