import React, { useEffect } from "react";
import { randImg } from '@ngneat/falso';
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../Auth/AuthProvider";
import { appRoutes } from "../router";
import SectionHeroBasic from "../../Templates/Section/SectionHero/SectionHeroBasic/SectionHeroBasic";

const RouteLogout: React.FC = () => {
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
                        src: randImg(),
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

export default RouteLogout
