import * as uuid from "uuid"
import React from "react"

import { PageStruct } from "../types";
import { HeaderBurgerItem } from "../Templates/Header/HeaderBurger/HeaderBurger";
import { SectionHeroVideoItem } from "../Templates/Section/SectionHero/SectionHeroVideo/SectionHeroVideo";

// https://mixkit.co/free-stock-video/going-down-a-curved-highway-through-a-mountain-range-41576/
const videoURLS = [
    'https://maistro.website/assets/videos/abstract-tunnel-square.mp4',
    'https://maistro.website/assets/videos/abstract-tunnel-triangular.mp4',
    'https://maistro.website/assets/videos/beach.mp4',
    'https://maistro.website/assets/videos/countryside.mp4',
    'https://maistro.website/assets/videos/villa.mp4',
]

export const CreateTemplateMaistro = (): PageStruct[] => {
    return [
        {
            id: uuid.v4(),
            title: "Maistro",
            description: "Maistro Landing Page",
            path: `/home`,
            contentActive: null,
            content: [
                {
                    ...HeaderBurgerItem,
                    props: {
                        logo: {
                            url: "https://maistro.website/assets/logo.svg",
                        },
                        links: {
                            login: {
                                href: "/login",
                                value: "My Account",
                            }
                        },
                    }
                },
                {
                    ...SectionHeroVideoItem,
                    props: {
                        videoURL: videoURLS[Math.floor(Math.random() * videoURLS.length)],
                        title: "Maistro AI",
                        content: (
                            <div>
                                <div>AI-Powered Ideas in Seconds</div>
                                <div>Start Free & Transform Today!</div>
                            </div>
                        ),
                        buttonText: "Generate",
                        buttonLink: "/login",
                    }
                },
            ],
        }
    ]
}
