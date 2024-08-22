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
import { SectionAboutUsBasicItem } from "./Section/SectionAboutUs/SectionAboutUsBasic/SectionAboutUsBasic"

import { SectionServicesAccordionItem } from './Section/SectionServices/SectionServicesAccordion/SectionServicesAccordion'
import { SectionServicesBasicItem } from './Section/SectionServices/SectionServicesBasic/SectionServicesBasic'
import { SectionServicesIconsItem } from './Section/SectionServices/SectionServicesIcons/SectionServicesIcons'

import { SectionContactWithMapItem } from './Section/SectionContact/SectionContactWithMap/SectionContactWithMap'
import { SectionContactDetailedItem } from './Section/SectionContact/SectionContactDetailed/SectionContactDetailed'
import { SectionContactInteractiveItem } from './Section/SectionContact/SectionContactInteractive/SectionContactInteractive'

import { FooterDetailedItem } from './Footer/FooterDetailed/FooterDetailed'
import { FooterInteractiveItem } from './Footer/FooterInteractive/FooterInteractive'
import { FooterWithNavigationItem } from './Footer/FooterWithNavigation/FooterWithNavigation'
import { SectionSubscribeBasicItem } from './Section/SectionContact/SectionSubscribeBasic/SectionSubscribeBasic'
import { SectionBlankItem } from './Section/SectionBlank'
import { SectionHeroSubscribeItem } from './Section/SectionHero/SectionHeroSubscribe/SectionHeroSubscribe'
import { SectionTestimonialsBasicItem } from './Section/SectionTestimonials/SectionTestimonialsBasic/SectionTestimonialsBasic'
import { FooterBasicItem } from './Footer/FooterBasic/FooterBasic'
import { SectionProductsBasicItem } from './Section/SectionProduct/SectionProductBasic/SectionProductBasic'
import { SectionCheckoutStripeItem } from './Section/SectionCheckout/SectionCheckoutStripe/SectionCheckoutStripe'
import { SectionCheckoutMercadoPagoItem } from './Section/SectionCheckout/SectionCheckoutMercadoPago/SectionCheckoutMercadoPago'
import { SectionShoppingCartsBasicItem } from './Section/SectionShoppingCart/SectionShoppingCartBasic/SectionShoppingCartBasic'
import SectionFulfilmentBasicItem from './Section/SectionFulfilment/SectionFulfilmentBasic'
import { SectionOrderBasicItem } from './Section/SectionOrder/SectionOrderBasic'
import { SectionMapGoogleItem } from './Section/SectionMap/SectionMapGoogle'

export const GetTemplates = (): Record<TemplateComponentType, TemplateStruct<{}>> => {
    const templatesRecord: Record<string, TemplateStruct<{}>> = {}
    const templatesList: TemplateStruct<{}>[] = [
        HeaderBurgerItem,
        SectionHeroImageItem,
        SectionBlankItem,
        SectionSubscribeBasicItem,

        HeaderBasicItem,
        HeaderBurgerItem,
        HeaderStickyItem,

        SectionHeroBasicItem,
        SectionHeroVideoItem,
        SectionHeroSlidesItem,
        SectionHeroSubscribeItem,

        SectionTestimonialsBasicItem,

        SectionAboutUsBasicItem,
        // SectionAboutUsTeamItem,
        // SectionAboutUsDetailedItem,
        // SectionAboutUsInteractiveItem,

        SectionServicesBasicItem,
        // SectionServicesAccordionItem,
        // SectionServicesDetailedItem,
        // SectionServicesIconsItem,


        SectionProductsBasicItem,
        // SectionContactWithMapItem,
        // SectionContactDetailedItem,
        // SectionContactInteractiveItem,

        SectionCheckoutStripeItem,
        SectionCheckoutMercadoPagoItem,

        SectionShoppingCartsBasicItem,

        FooterBasicItem,
        // FooterDetailedItem,
        // FooterWithNavigationItem,
        // FooterInteractiveItem,

        SectionFulfilmentBasicItem,

        SectionOrderBasicItem,

        SectionMapGoogleItem,
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
