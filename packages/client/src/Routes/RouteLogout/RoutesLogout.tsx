import React, { useEffect } from "react";
import { faker } from '@faker-js/faker';
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../Auth/AuthProvider";
import { appRoutes } from "../router";
import SectionHeroBasic from "../../Components/Gallery/Section/SectionHero/SectionHeroBasic/SectionHeroBasic";

const RoutesLogout: React.FC = () => {
    const navigate = useNavigate();
    const { logOut } = React.useContext(AuthContext);

    const logOutAndNavigate = () => {
        return logOut()
            .then(() => {
                navigate(appRoutes.getHomeRoute());
            });
    };

    useEffect(() => {
        logOutAndNavigate();
    }, []);

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
                            <div>Logging you Out..</div>
                            <div>See you soon!</div>
                        </div>
                    ),
                    cta: "Log Out",
                    ctaOnClick: () => {
                        logOutAndNavigate();
                    }
                }} />
        </>
    );
};

export default RoutesLogout
