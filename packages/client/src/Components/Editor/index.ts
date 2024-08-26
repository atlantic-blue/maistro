import { TemplateComponentType } from "../../Templates/templateTypes";
import AboutUsBasicEditor from "./AboutUsBasicEditor";
import SectionCheckoutStripeEditor from "./CheckoutStripeEditor";
import SectionCheckoutMercadoPagoEditor from "./CheckoutMercadoPagoEditor";
import FooterBasicEditor from "./FooterBasicEditor";
import HeaderBasicEditor from "./HeaderBasicEditor";
import HeroBasicEditor from "./HeroBasicEditor";
import HeroSlidesEditor from "./HeroSlidesEditor";
import HeroSubscribeEditor from "./HeroSubscribeEditor";
import HeroVideoEditor from "./HeroVideoEditor";
import SectionProductsEditor from "./ProductsBasicEditor";
import SectionBlankEditor from "./SectionBlankEditor";
import ServicesBasicEditor from "./ServicesBasicEditor";
import SectionShoppingCartBasicEditor from "./ShoppingCartBasicEditor";
import TestimonialsBasicEditor from "./TestimonialsBasicEditor";
import SectionMapGoogleEditor from "./SectionMapGoogleEditor";

const editors: Record<TemplateComponentType, React.FC<any>> = {
    [TemplateComponentType.HEADER_BASIC]: HeaderBasicEditor,
    [TemplateComponentType.HEADER_BURGER]: HeaderBasicEditor,
    [TemplateComponentType.HEADER_STICKY]: HeaderBasicEditor,

    [TemplateComponentType.HERO_BASIC]: HeroBasicEditor,
    [TemplateComponentType.HERO_IMAGE]: HeroBasicEditor,
    [TemplateComponentType.HERO_SLIDES]: HeroSlidesEditor,
    [TemplateComponentType.HERO_VIDEO]: HeroVideoEditor,
    [TemplateComponentType.HERO_SUBSCRIBE]: HeroSubscribeEditor,

    [TemplateComponentType.ABOUT_US_BASIC]: AboutUsBasicEditor,

    [TemplateComponentType.TESTIMONIALS_BASIC]: TestimonialsBasicEditor,

    [TemplateComponentType.SERVICE_BASIC]: ServicesBasicEditor,

    [TemplateComponentType.FOOTER_BASIC]: FooterBasicEditor,

    [TemplateComponentType.SECTION_BLANK]: SectionBlankEditor,

    [TemplateComponentType.PRODUCTS_BASIC]: SectionProductsEditor,

    [TemplateComponentType.CHECKOUT_STRIPE]: SectionCheckoutStripeEditor,
    [TemplateComponentType.CHECKOUT_MERCADO_PAGO]: SectionCheckoutMercadoPagoEditor,

    [TemplateComponentType.SHOPPING_CART_BASIC]: SectionShoppingCartBasicEditor,

    [TemplateComponentType.MAP_GOOGLE]: SectionMapGoogleEditor,
}

export default editors
