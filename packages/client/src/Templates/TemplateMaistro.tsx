import * as uuid from "uuid"
import { faker } from '@faker-js/faker';
import React from "react"

import { defaultFontScheme } from "../PageContext";
import { PageStruct } from "../types";
import { HeaderBurgerItem } from "../Components/Gallery/Header/HeaderBurger/HeaderBurger";
import { SectionHeroVideoItem } from "../Components/Gallery/Section/SectionHero/SectionHeroVideo/SectionHeroVideo";

const videoURLS = [
    '/assets/videos/abstract-tunnel-square.mp4',
    '/assets/videos/abstract-tunnel-triangular.mp4',
    '/assets/videos/beach.mp4',
    '/assets/videos/countryside.mp4',
    '/assets/videos/villa.mp4',
]

export const CreateTemplateMaistro = (): PageStruct[] => {
    return [
        {
            id: uuid.v4(),
            path: `/${faker.word.adjective()}`,
            contentActive: null,
            description: "Maistro Landing Page",
            content: [
                {
                    ...HeaderBurgerItem,
                    props: {
                        logo: {
                            url: "/assets/logo.svg",
                        },
                        links: {
                        },
                    }
                },
                {
                    ...SectionHeroVideoItem,
                    props: {
                        videoURL: videoURLS[Math.floor(Math.random() * videoURLS.length)],
                        title: "Maistro",
                        content: (
                            <div>
                                <div>AI-Powered Ideas in Seconds</div>
                                <div>Start Free & Transform Today!</div>
                            </div>
                        ),
                        buttonText: "Generate",
                        buttonLink: "/projects",
                    }
                },
            ],
            fontScheme: defaultFontScheme,
            colourScheme: {
                primary: "#FFC94A",
                secondary: "#453F78",
                accent: "#d9d9d9",
                background: "#F0F0f0",
                neutral: "#e6e6e6",
                text: "#333333",
                palette: [
                    "#FFC94A",
                    "#453F78"
                ]
            },
        }
    ]
}
