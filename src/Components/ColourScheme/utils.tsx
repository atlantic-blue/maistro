type RGB = [
    number,
    number,
    number
];
type HSV = {
    h: number;
    s: number;
    v: number
};
type HSL = {
    h: number;
    s: number;
    l: number;
};

const getRandomHexColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const hexToRgb = (hex: string): RGB => {
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return [r, g, b];
};

const rgbToHsv = (r: number, g: number, b: number): HSV => {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, v = max;
    let d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s, v };
};

const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b]
        .map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
}

const hsvToRgb = (h: number, s: number, v: number): RGB => {
    let r: number, g: number, b: number;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
        default: r = 0, g = 0, b = 0; // Added to satisfy TypeScript's need for initialization
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

function hexToHSL(H: string): HSL {
    let r = 0, g = 0, b = 0;
    if (H.length === 4) {
        r = parseInt(H[1] + H[1], 16);
        g = parseInt(H[2] + H[2], 16);
        b = parseInt(H[3] + H[3], 16);
    } else if (H.length === 7) {
        r = parseInt(H[1] + H[2], 16);
        g = parseInt(H[3] + H[4], 16);
        b = parseInt(H[5] + H[6], 16);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(360 * h), s: Math.round(100 * s), l: Math.round(100 * l) };
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

const adjustHue = (hex: string, amount: number): string => {
    let [r, g, b] = hexToRgb(hex);
    let { h, s, v } = rgbToHsv(r, g, b);
    h = (h + amount) % 360;
    if (h < 0) h += 360;
    [r, g, b] = hsvToRgb(h / 360, s, v);
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
};


export const generateMatchingHexColors = (): { primaryColor: string; secondaryColor: string } => {
    const primaryColor = getRandomHexColor();
    const secondaryColor = adjustHue(primaryColor, 30); // Adjust by 30 degrees on the color wheel
    return { primaryColor, secondaryColor };
};

const blendRgb = (rgb1: RGB, rgb2: RGB, ratio: number) => {
    const r = Math.round(rgb1[0] * (1 - ratio) + rgb2[0] * ratio);
    const g = Math.round(rgb1[1] * (1 - ratio) + rgb2[1] * ratio);
    const b = Math.round(rgb1[2] * (1 - ratio) + rgb2[2] * ratio);
    return [r, g, b];
};

type ColorSchemeType = 'complementary' | 'analogous' | 'triadic' | 'tetradic';

export const createColorPalette = (baseColor: string, schemeType: ColorSchemeType): string[] => {
    const { h, s, l } = hexToHSL(baseColor);
    let palette: HSL[] = [];

    switch (schemeType) {
        case 'complementary':
            palette = [
                { h, s, l },
                { h: (h + 180) % 360, s, l },
                { h, s: Math.min(100, s + 10), l: Math.max(0, l - 10) }, // Lighter variation
                { h: (h + 180) % 360, s: Math.max(0, s - 10), l: Math.min(100, l + 10) } // Darker variation of complementary
            ];
            break;
        case 'analogous':
            palette = [
                { h, s, l },
                { h: (h + 30) % 360, s, l },
                { h: (h + 60) % 360, s, l },
                { h: (h + 90) % 360, s, l }
            ];
            break;
        case 'triadic':
            palette = [
                { h, s, l },
                { h: (h + 120) % 360, s, l },
                { h: (h + 240) % 360, s, l },
                { h, s: Math.min(100, s + 20), l: Math.max(0, l - 20) } // A variation of the base color
            ];
            break;
        case 'tetradic':
            // Two complementary color pairs
            palette = [
                { h, s, l },
                { h: (h + 60) % 360, s, l }, // Adjacent color
                { h: (h + 180) % 360, s, l }, // Complementary color
                { h: (h + 240) % 360, s, l } // Complementary to the adjacent color
            ];
            break;
    }

    return palette.map(({ h, s, l }) => hslToHex(h, s, l));
}

export const createBlendedColourPalette = (primaryColor?: string, secondaryColor?: string) => {
    let primary = primaryColor
    let secondary = secondaryColor
    if (!primaryColor || !secondaryColor) {
        const { primaryColor, secondaryColor } = generateMatchingHexColors()
        primary = primaryColor
        secondary = secondaryColor
    }

    if (!primary || !secondary) {
        return []
    }

    const primaryRgb = hexToRgb(primary)
    const secondaryRgb = hexToRgb(secondary)
    const paletteRatios = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1]

    return paletteRatios
        .map(ratio => blendRgb(primaryRgb, secondaryRgb, ratio))
        .map(rgbColour => rgbToHex(rgbColour[0], rgbColour[1], rgbColour[2]))
}


// For simplicity, we'll just darken and lighten the primary color
export const lighten = (color: string, percent: number): string => {
    const num = parseInt(color.replace("#", ""), 16)
    const amount = Math.round(2.55 * percent)
    const R = (num >> 16) + amount
    const B = (num >> 8 & 0x00FF) + amount
    const G = (num & 0x0000FF) + amount

    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
};
