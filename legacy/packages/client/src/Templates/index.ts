import { TemplateComponentType, TemplateStruct } from './templateTypes'

import { HeaderBasicItem } from './Header/HeaderBasic'
import { HeaderBurgerItem } from './Header/HeaderBurger'
import { HeaderStickyItem } from './Header/HeaderSticky'

import { SectionHeroBasicItem } from './Section/SectionHero/SectionHeroBasic'
import { SectionHeroImageItem } from './Section/SectionHero/SectionHeroImage'
import { SectionHeroVideoItem } from './Section/SectionHero/SectionHeroVideo/SectionHeroVideo'
import { SectionHeroSlidesItem } from './Section/SectionHero/SectionHeroSlides/SectionHeroSlides'

import { SectionAboutUsBasicItem } from "./Section/SectionAboutUs/SectionAboutUsBasic/SectionAboutUsBasic"

import { SectionServicesBasicItem } from './Section/SectionServices/SectionServicesBasic/SectionServicesBasic'

import { SectionSubscribeBasicItem } from './Section/SectionContact/SectionSubscribeBasic/SectionSubscribeBasic'
import { SectionBlankItem } from './Section/SectionBlank'
import { SectionHeroSubscribeItem } from './Section/SectionHero/SectionHeroSubscribe/SectionHeroSubscribe'
import { SectionTestimonialsBasicItem } from './Section/SectionTestimonials/SectionTestimonialsBasic/SectionTestimonialsBasic'
import { FooterBasicItem } from './Footer/FooterBasic/FooterBasic'
import { SectionProductsBasicItem } from './Section/SectionProducts/SectionProductsBasic/SectionProductsBasic'
import { SectionCheckoutStripeItem } from './Section/SectionCheckout/SectionCheckoutStripe/SectionCheckoutStripe'
import { SectionCheckoutMercadoPagoItem } from './Section/SectionCheckout/SectionCheckoutMercadoPago/SectionCheckoutMercadoPago'
import { SectionShoppingCartsBasicItem } from './Section/SectionShoppingCart/SectionShoppingCartBasic/SectionShoppingCartBasic'
import SectionFulfilmentBasicItem from './Section/SectionFulfilment/SectionFulfilmentBasic'
import { SectionOrderBasicItem } from './Section/SectionOrder/SectionOrderBasic'
import { SectionMapGoogleItem } from './Section/SectionMap/SectionMapGoogle'
import { SectionProductsEnhancedItem } from './Section/SectionProducts/SectionProductsEnhanced/SectionProductsEnhanced'

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
        SectionProductsEnhancedItem,

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
