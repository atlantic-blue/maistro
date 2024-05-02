import { TemplateComponentType, TemplateStruct } from './templateTypes'

import { HeaderBasicItem } from './Header/HeaderBasic/HeaderBasic'
import { HeaderBurgerItem } from './Header/HeaderBurger/HeaderBurger'
import { HeaderStickyItem } from './Header/HeaderSticky/HeaderSticky'

import { SectionHeroBasicItem } from './Section/SectionHero/SectionHeroBasic/SectionHeroBasic'
import { SectionHeroImageItem } from './Section/SectionHero/SectionHeroImage/SectionHeroImage'
import { SectionHeroVideoItem } from './Section/SectionHero/SectionHeroVideo/SectionHeroVideo'
import { SectionHeroSlidesItem } from './Section/SectionHero/SectionHeroSlides/SectionHeroSlides'

import { SectionAboutUsTeamItem } from './Section/SectionAboutUs/SectionAboutUsTeam/SectionAboutUsTeam'
import { SectionAboutUsDetailedItem } from './Section/SectionAboutUs/SectionAboutUsDetailed/SectionAboutUsDetailed'
import { SectionAboutUsInteractiveItem } from './Section/SectionAboutUs/SectionAboutUsInteractive/SectionAboutUsInteractive'
import { SectionAboutUsSimpleItem } from "./Section/SectionAboutUs/SectionAboutUsSimple/SectionAboutUsSimple"

import { SectionServicesBasicItem } from './Section/SectionServices/SectionServicesBasic/SectionServicesBasic'
import { SectionServicesAccordionItem } from './Section/SectionServices/SectionServicesAccordion/SectionServicesAccordion'
import { SectionServicesDetailedItem } from './Section/SectionServices/SectionServicesDetailed/SectionServicesDetailed'
import { SectionServicesIconsItem } from './Section/SectionServices/SectionServicesIcons/SectionServicesIcons'

import { SectionContactWithMapItem } from './Section/SectionContact/SectionContactWithMap/SectionContactWithMap'
import { SectionContactDetailedItem } from './Section/SectionContact/SectionContactDetailed/SectionContactDetailed'
import { SectionContactInteractiveItem } from './Section/SectionContact/SectionContactInteractive/SectionContactInteractive'

import { FooterSimpleItem } from './Footer/FooterSimple/FooterSimple'
import { FooterDetailedItem } from './Footer/FooterDetailed/FooterDetailed'
import { FooterInteractiveItem } from './Footer/FooterInteractive/FooterInteractive'
import { FooterWithNavigationItem } from './Footer/FooterWithNavigation/FooterWithNavigation'
import { SectionSubscribeBasicItem } from './Section/SectionContact/SectionSubscribeBasic/SectionSubscribeBasic'

export const GetTemplates = (): Record<TemplateComponentType, TemplateStruct> => {
    const templatesRecord: Record<string, TemplateStruct> = {}
    const templatesList: TemplateStruct[] = [
        HeaderBurgerItem,
        SectionHeroBasicItem,
        SectionSubscribeBasicItem,

        HeaderBasicItem,
        HeaderBurgerItem,
        // HeaderDropDownItem,
        HeaderStickyItem,

        SectionHeroImageItem,
        // SectionHeroVideoItem,
        // SectionHeroSlidesItem,

        // SectionAboutUsSimpleItem,
        // SectionAboutUsTeamItem,
        // SectionAboutUsDetailedItem,
        // SectionAboutUsInteractiveItem,

        // SectionServicesBasicItem,
        // SectionServicesAccordionItem,
        // SectionServicesDetailedItem,
        // SectionServicesIconsItem,


        // SectionContactWithMapItem,
        // SectionContactDetailedItem,
        // SectionContactInteractiveItem,

        // FooterSimpleItem,
        // FooterDetailedItem,
        // FooterWithNavigationItem,
        // FooterInteractiveItem,
    ]

    templatesList.forEach(template => {
        templatesRecord[template.name] = template
    })

    return templatesRecord
}

const templates = GetTemplates()

export {
    templates
}
