import React from "react";
import { randImg } from '@ngneat/falso';

import SectionHeroBasic from "../../Templates/Section/SectionHero/SectionHeroBasic/SectionHeroBasic";
import SectionAboutUsSimple from "../../Templates/Section/SectionAboutUs/SectionAboutUsBasic/SectionAboutUsBasic";
import FooterSimple from "../../Templates/Footer/FooterBasic/FooterBasic";
import { AuthContext } from "../../Auth/AuthProvider";

const RouteLogin: React.FC = () => {
    const { logIn } = React.useContext(AuthContext)

    return (
        <>
            <SectionHeroBasic
                {...{
                    title: "Maistro Ai",
                    img: {
                        src: randImg(),
                        alt: "img",
                    },
                    content: (
                        <div>
                            <div>Ai Powered Ideas in Seconds!</div>
                        </div>
                    ),
                    cta: "Log In",
                    ctaOnClick: logIn
                }}
            />

            <SectionAboutUsSimple />
            <FooterSimple name="Maistro Ai" />
        </>
    );
};

export default RouteLogin
