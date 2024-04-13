import React from "react";
import { faker } from '@faker-js/faker';
import { useNavigate } from "react-router-dom";

import { appRoutes } from "../router";
import SectionHeroBasic from "../../Components/Gallery/Section/SectionHero/SectionHeroBasic/SectionHeroBasic";
import SectionAboutUsSimple from "../../Components/Gallery/Section/SectionAboutUs/SectionAboutUsSimple/SectionAboutUsSimple";
import FooterSimple from "../../Components/Gallery/Footer/FooterSimple/FooterSimple";
import { AuthContext } from "../../Auth/AuthProvider";

const RoutesLogin: React.FC = () => {
    const { logIn, isAuthenticated, user } = React.useContext(AuthContext)
    const navigate = useNavigate()

    const onLogin = async () => {
        await logIn().then(() => {
            navigate(appRoutes.getProjectsRoute())
        })
    };

    const onSeeProjects = () => {
        navigate(appRoutes.getProjectsRoute())
    }

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
                            {isAuthenticated && user && user.getName() && (
                                <div>
                                    Let's build something together {user.getName()}.
                                </div>
                            )}
                        </div>
                    ),
                    cta: isAuthenticated ? "See Projects" : "Log In",
                    ctaOnClick: () => {
                        if (!isAuthenticated) {
                            onLogin()
                        } else {
                            onSeeProjects()
                        }
                    }
                }}
            />

            <SectionAboutUsSimple />
            <FooterSimple name="Maistro Ai" />
        </>
    );
};

export default RoutesLogin
