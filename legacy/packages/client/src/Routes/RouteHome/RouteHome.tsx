import React from "react"

import { AuthContext } from "../../Auth/AuthProvider";
import HeaderBurger from "../../Templates/Header/HeaderBurger/HeaderBurger";
import SectionHeroVideo from "../../Templates/Section/SectionHero/SectionHeroVideo/SectionHeroVideo";
import SectionAboutUsBasic from "../../Templates/Section/SectionAboutUs/SectionAboutUsBasic/SectionAboutUsBasic";
import SectionServicesBasic from "../../Templates/Section/SectionServices/SectionServicesBasic/SectionServicesBasic";
import FooterBasic from "../../Templates/Footer/FooterBasic/FooterBasic";
import CreateProjectFlow from "./Components/CreateProjectFlow/CreateProjectFlow";
import HeaderBasic from "../../Templates/Header/HeaderBasic/HeaderBasic";
import { ResourceStringsContext } from "../../ResourceStrings/ResourceStringsProvider";
import PricingPage from "../../Payments/PricingPage/PricingPage";

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
    const {
        data,
        language
    } = React.useContext(ResourceStringsContext)

    return (
        <>
            <HeaderBasic
                {...{
                    logo: {
                        url: "https://maistro.website/assets/logo.svg",
                        slogan: "Maistro"
                    },
                    links: [
                        {
                            onClick: logIn,
                            name: "Login",
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
                    content: (
                        <CreateProjectFlow />
                    ),
                }}
            />

            <SectionAboutUsBasic
                {...{
                    title: "Revolutionising Web Design with AI",
                    content: "Maistro is an innovative platform that leverages advanced AI technology to simplify the website creation process. Whether you’re a small business owner, freelancer, or entrepreneur, Maistro empowers you to build stunning websites with ease and efficiency.",
                }}
            />

            <PricingPage />

            <SectionServicesBasic
                {...{
                    services: [
                        {
                            title: 'Describe Your Vision',
                            description: 'Provide a brief description of your business and the type of website you need. Our AI will handle the rest.',
                            imageUrl: 'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNHx8RGVzY3JpYmUlMjBZb3VyJTIwVmlzaW9ufGVufDB8fHx8MTcxNjQyNTg2OXww&ixlib=rb-4.0.3&q=85'
                        },
                        {
                            title: 'Customise Your Design',
                            description: 'Choose from AI-generated templates and customise them to reflect your brand’s unique identity.',
                            imageUrl: 'https://maistro.live/1498d438-d0d1-703a-53f2-d1b674fce02f/2ce95ac4-d947-4164-b97c-b70f18d9b33b/assets/ai-images/652cbae7-b606-4332-a257-f2dff85433b9.png'
                        },
                        {
                            title: 'Launch with Confidence',
                            description: 'Publish your fully responsive website with a single click and start engaging with your audience.',
                            imageUrl: 'https://maistro.live/1498d438-d0d1-703a-53f2-d1b674fce02f/2ce95ac4-d947-4164-b97c-b70f18d9b33b/assets/ai-images/e159aa31-e538-46cc-ac30-2325ef7be797.png'
                        },
                    ]
                }}
            />
            <FooterBasic
                {...{
                    name: "Maistro",
                }}
            />
        </>
    )
}

export default RoutesHome
