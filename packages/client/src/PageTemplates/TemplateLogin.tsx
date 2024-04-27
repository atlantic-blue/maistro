import * as uuid from "uuid"
import React from "react"
import { faker } from '@faker-js/faker';

import { defaultFontScheme } from "../PageContext";
import { PageStruct } from "../types";
import { SectionHeroBasicItem } from "../Components/Gallery/Section/SectionHero/SectionHeroBasic/SectionHeroBasic";
import { FooterSimpleItem } from "../Components/Gallery/Footer/FooterSimple/FooterSimple";
import { SectionAboutUsSimpleItem } from "../Components/Gallery/Section/SectionAboutUs/SectionAboutUsSimple/SectionAboutUsSimple";


export const CreateTemplateLogin = (): PageStruct[] => {
    return [
        {
            id: uuid.v4(),
            title: "Login",
            description: "Login Page",
            path: `/login`,
            contentActive: null,
            content: [
                {
                    ...SectionHeroBasicItem,
                    props: {
                        title: "Login Page.",
                        img: {
                            src: faker.image.urlPicsumPhotos(),
                            alt: "img",
                        },
                        content: (
                            <div>
                                <div>AI-Powered Ideas in Seconds</div>
                            </div>
                        ),
                        cta: "Log In"
                    }
                },
                {
                    ...SectionAboutUsSimpleItem,
                    props: {

                    }
                },
                {
                    ...FooterSimpleItem,
                    props: {
                        name: "My Awesome Company"
                    }
                }
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
