import loadable from '@loadable/component';
import { randImg, randSentence } from '@ngneat/falso';

import { TemplateStruct, TemplateCategory, TemplateComponentType } from '../../../templateTypes';
import * as styles from "./SectionHeroImage.scss"
import * as animationStyles from "../../../Styles/animation.scss"
import { SectionHeroProps } from '../SectionHeroTypes';
import SectionHeroImage from './SectionHeroImage';

export const SectionHeroImageItem: TemplateStruct<SectionHeroProps> = {
    name: TemplateComponentType.HERO_IMAGE,
    Component: SectionHeroImage,
    // getComponent: () => loadable(() => import(/* webpackChunkName: "SectionHeroImage" */ "./SectionHeroImage")),
    classNames: [
        ...Object.values(styles),
        ...Object.values(animationStyles)
    ],
    categories: [TemplateCategory.HERO],
    description: "Hero Image",
    props: {
        title: "Captivating Experiences Await",
        content: "Join us on our journey.",
        img: {
            src: randImg(),
            alt: randSentence(),
        },
        cta: "Discover More",
        ctaLink: "#home"
    },
}
