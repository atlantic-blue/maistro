import loadable from "@loadable/component";
import { randImg, randSentence } from '@ngneat/falso';

import { SectionHeroProps } from "../SectionHeroTypes";

import { TemplateStruct, TemplateCategory, TemplateComponentType } from "../../../templateTypes";
import * as animationStyles from "../../../Styles/animation.scss"

import * as styles from "./SectionHeroBasic.scss";
import SectionHeroBasic from "./SectionHeroBasic";

export const SectionHeroBasicItem: TemplateStruct<SectionHeroProps> = {
    name: TemplateComponentType.HERO_BASIC,
    description: "Hero Basic",
    categories: [TemplateCategory.HERO],
    Component: SectionHeroBasic,
    // getComponent: () => loadable(() => import(/* webpackChunkName: "SectionHeroBasic" */ "./SectionHeroBasic")),
    classNames: [
        ...Object.values(styles),
        ...Object.values(animationStyles)
    ],
    props: {
        title: "Landing Page.",
        content: "Discover our services and offerings.",
        cta: "Get Started",
        ctaLink: "#home",
        img: {
            src: randImg(),
            alt: randSentence(),
        }
    }
}
