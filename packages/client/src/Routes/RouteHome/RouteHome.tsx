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
                        slogan: "Maistro"
                    },
                    links: [
                        {
                            href: "/login",
                            name: "My Account",
                            description: "Log in to your account"
                        }
                    ]
                }}
            />
            <SectionHeroVideo
                {...{
                    video: {
                        src: videoURLS[Math.floor(Math.random() * videoURLS.length)],
                        alt: "Get started with Maistro",
                    },
                    title: "Maistro AI",
                    content: (
                        <div>
                            <div>AI-Powered Ideas in Seconds</div>
                            <div>Start Free & Transform Today!</div>
                        </div>
                    ),
                    cta: "Generate",
                    ctaOnClick: logIn,
                }}
            />
        </>
    )
}

export default RoutesHome
