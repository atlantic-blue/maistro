// https://mixkit.co/free-stock-video/going-down-a-curved-highway-through-a-mountain-range-41576/
import React, { useEffect } from "react"
import { faker } from '@faker-js/faker';


import SectionHeroBasic from "../../Components/Gallery/Section/SectionHero/SectionHeroBasic/SectionHeroBasic"
import { appendColourSchemeToDocument, appendFontSchemeToDocument } from "../../Utils/appendScheme";
import { defaultColorScheme, defaultFontScheme } from "../../PageContext";
import HeaderBurger from "../../Components/Gallery/Header/HeaderBurger/HeaderBurger";
import SectionHeroVideo from "../../Components/Gallery/Section/SectionHero/SectionHeroVideo/SectionHeroVideo";

const videoURLS = [
    '/assets/videos/abstract-tunnel-square.mp4',
    '/assets/videos/abstract-tunnel-triangular.mp4',
    '/assets/videos/beach.mp4',
    '/assets/videos/countryside.mp4',
    '/assets/videos/villa.mp4',
]


const RoutesHome: React.FC = () => {

    useEffect(() => {
        appendFontSchemeToDocument(defaultFontScheme)
        appendColourSchemeToDocument(defaultColorScheme)
    }, [])

    return (
        <div>
            <HeaderBurger
                {
                ...{
                    logo: {
                        url: "/assets/logo.svg",
                        slogan: ""
                    },
                    links: {}
                }
                }
            />
            <SectionHeroVideo
                {...{
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
                }}
            />
        </div>
    )
}

export default RoutesHome
