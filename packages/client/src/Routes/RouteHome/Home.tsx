// https://mixkit.co/free-stock-video/going-down-a-curved-highway-through-a-mountain-range-41576/
import React, { useEffect } from "react"

import { appendColourSchemeToDocument, appendFontSchemeToDocument } from "../../Utils/appendScheme";
import { defaultColorScheme, defaultFontScheme } from "../../PageContext";
import HeaderBurger, { } from "../../Components/Gallery/Header/HeaderBurger/HeaderBurger";
import SectionHeroVideo from "../../Components/Gallery/Section/SectionHero/SectionHeroVideo/SectionHeroVideo";
import { CreateTemplateMaistro } from "../../Templates/TemplateMaistro";

const videoURLS = [
    '/assets/videos/abstract-tunnel-square.mp4',
    '/assets/videos/abstract-tunnel-triangular.mp4',
    '/assets/videos/beach.mp4',
    '/assets/videos/countryside.mp4',
    '/assets/videos/villa.mp4',
]


const RoutesHome: React.FC = () => {
    useEffect(() => {
        appendFontSchemeToDocument(defaultFontScheme)
        appendColourSchemeToDocument(defaultColorScheme)
    }, [])

    return (
        <>
            {CreateTemplateMaistro()[0].content.map(c => {
                return (
                    <c.Component {...c.props} key={c.id} />
                )
            })}
        </>
    )
}

export default RoutesHome
