import React from "react"

import { CreateTemplateMaistro } from "../../Templates/TemplateMaistro";
import { AuthContext } from "../../Auth/AuthProvider";
import HeaderBurger from "../../Components/Gallery/Header/HeaderBurger/HeaderBurger";
import SectionHeroVideo from "../../Components/Gallery/Section/SectionHero/SectionHeroVideo/SectionHeroVideo";

// https://mixkit.co/free-stock-video/going-down-a-curved-highway-through-a-mountain-range-41576/
const videoURLS = [
    '/assets/videos/abstract-tunnel-square.mp4',
    '/assets/videos/abstract-tunnel-triangular.mp4',
    '/assets/videos/beach.mp4',
    '/assets/videos/countryside.mp4',
    '/assets/videos/villa.mp4',
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
                    links: {
                        login: {
                            href: "/login",
                            value: "My Account",
                        }
                    },
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
