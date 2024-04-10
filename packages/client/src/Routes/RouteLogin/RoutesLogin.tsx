import React from "react";
import { faker } from '@faker-js/faker';
import { useAuth0 } from "@auth0/auth0-react";
import { appRoutes } from "../router";
import SectionHeroBasic from "../../Components/Gallery/Section/SectionHero/SectionHeroBasic/SectionHeroBasic";
import SectionAboutUsSimple from "../../Components/Gallery/Section/SectionAboutUs/SectionAboutUsSimple/SectionAboutUsSimple";
import FooterSimple from "../../Components/Gallery/Footer/FooterSimple/FooterSimple";

export const RoutesLogin: React.FC = () => {
    const { loginWithRedirect } = useAuth0();

    const onLogin = () => {
        loginWithRedirect({ appState: { returnTo: appRoutes.getProjectsRoute() } });
    };

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
                            <div>Ai Powered Ideas in Seconds</div>
                        </div>
                    ),
                    cta: "Log In",
                    ctaOnClick: () => {
                        onLogin();
                    }
                }}
            />

            <SectionAboutUsSimple />
            <FooterSimple name="Maistro Ai" />
        </>
    );
};
