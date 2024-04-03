import React from "react";

import { ColourScheme, FontScheme, PageState } from "./types";
import Page from "./Store/Page";

export const defaultColorScheme: ColourScheme = {
    primary: "#FFC94A",
    secondary: "#453F78",
    text: "#333333",
    background: "#f0f0f0",
    accent: "#d9d9d9",
    neutral: "#e6e6e6",
    palette: []
}


export const defaultFontScheme: FontScheme = {
    heading: {
        name: "Merriweather",
        family: "Merriweather",
        css: `"Merriweather", sans-serif`,
        description: "A serif font that's designed to be readable on screens. It features a very large x-height, slightly condensed letterforms, mild diagonal stress, sturdy serifs, and open forms.",
    },
    body: {
        name: "Roboto",
        family: "Roboto",
        css: `"Roboto", sans-serif`,
        description: "Offers a mechanical skeleton and the forms are largely geometric. At the same time, the font features friendly and open curves. While some grotesks distort their letterforms to force a rigid rhythm, Roboto doesn’t compromise, allowing letters to be settled into their natural width.",
    },
}

export const PageContext = React.createContext<PageState>({
    page: new Page({
        id: "",
        path: "/",
        content: [],
        description: "",
        contentActive: null,
        fontScheme: defaultFontScheme,
        colourScheme: defaultColorScheme,
    })
})
