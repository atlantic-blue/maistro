import React from "react"

import { CreateTemplateMaistro } from "../../PageTemplates/TemplateMaistro";
import { AuthContext } from "../../Auth/AuthProvider";
import HeaderBurger from "../../Templates/Header/HeaderBurger/HeaderBurger";
import SectionHeroVideo from "../../Templates/Section/SectionHero/SectionHeroVideo/SectionHeroVideo";

// https://mixkit.co/free-stock-video/going-down-a-curved-highway-through-a-mountain-range-41576/
const videoURLS = [
    'https://maistro.website/assets/videos/abstract-tunnel-square.mp4',
    'https://maistro.website/assets/videos/abstract-tunnel-triangular.mp4',
    'https://maistro.website/assets/videos/beach.mp4',
    'https://maistro.website/assets/videos/countryside.mp4',
    'https://maistro.website/assets/videos/villa.mp4',
]

const RoutesHome: React.FC = () => {
    const { logIn } = React.useContext(AuthContext)
    return (
        <>
            <HeaderBurger
                {...{
                    logo: {
                        url: "https://maistro.website/assets/logo.svg",
                    },
                    links: [
                        {
                            href: "/login",
                            name: "My Account",
                        }
                    ]
                }}
            />
            <SectionHeroVideo
                {...{
                    videoURL: videoURLS[Math.floor(Math.random() * videoURLS.length)],
                    title: "Maistro AI",
                    content: (
                        <div>
                            <div>AI-Powered Ideas in Seconds</div>
                            <div>Start Free & Transform Today!</div>
                        </div>
                    ),
                    buttonText: "Generate",
                    buttonOnClick: logIn,
                }}
            />
        </>
    )
}

export default RoutesHome
