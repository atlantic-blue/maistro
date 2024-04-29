import React from "react";
import { faker } from '@faker-js/faker';

import SectionHeroBasic from "../../Templates/Section/SectionHero/SectionHeroBasic/SectionHeroBasic";
import SectionAboutUsSimple from "../../Templates/Section/SectionAboutUs/SectionAboutUsSimple/SectionAboutUsSimple";
import FooterSimple from "../../Templates/Footer/FooterSimple/FooterSimple";
import { AuthContext } from "../../Auth/AuthProvider";

const RouteLogin: React.FC = () => {
    const { logIn } = React.useContext(AuthContext)

    return (
        <>
            <SectionHeroBasic
                {...{
                    title: "Maistro Ai",
                    img: {
                        src: faker.image.urlPicsumPhotos(),
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
