import { LoadableComponent } from "@loadable/component"
import React from "react"

export enum TemplateCategory {
    HEADER = "HEADER",
    HERO = "HERO",
    TEXT = "TEXT",
    SUBSCRIBE = "SUBSCRIBE",
    TESTIMONIALS = "TESTIMONIALS",
    ABOUT = "ABOUT",
    SERVICES = "SERVICES",
    // CONTACT = "CONTACT",
    FOOTER = "FOOTER",

    PRODUCT = "PRODUCT",
    CHECKOUT = "CHECKOUT",
    SHOPPING_CART = "SHOPPING_CART",
    FULFILLMENT = "FULFILLMENT",
    ORDER = "ORDER",

    MAP = "MAP",
    BANNER = "BANNER",

    REVIEWS = "REVIEWS"
}

export enum TemplateComponentType {
    NONE = "NONE",
    HEADER_BASIC = "HEADER_BASIC",
    HEADER_BURGER = "HEADER_BURGER",
    HEADER_STICKY = "HEADER_STICKY",

    SECTION_BLANK = "SECTION_BLANK",

    HERO_BASIC = "HERO_BASIC",
    HERO_IMAGE = "HERO_IMAGE",
    HERO_SLIDES = "HERO_SLIDES",
    HERO_VIDEO = "HERO_VIDEO",
    HERO_SUBSCRIBE = "HERO_SUBSCRIBE",

    TESTIMONIALS_BASIC = "TESTIMONIALS_BASIC",

    ABOUT_US_BASIC = "ABOUT_US_BASIC",

    SERVICE_BASIC = "SERVICE_BASIC",

    FOOTER_BASIC = "FOOTER_BASIC",

    SUBSCRIBE_BASIC = "SUBSCRIBE_BASIC",

    PRODUCTS_BASIC = "PRODUCTS_BASIC",
    PRODUCTS_ENHANCED = "PRODUCTS_ENHANCED",

    CHECKOUT_STRIPE = "CHECKOUT_STRIPE",
    CHECKOUT_MERCADO_PAGO = "CHECKOUT_MERCADO_PAGO",

    SHOPPING_CART_BASIC = "SHOPPING_CART_BASIC",

    FULFILLMENT_BASIC = "FULFILLMENT_BASIC",

    ORDER_BASIC = "ORDER_BASIC",

    MAP_GOOGLE = "MAP_GOOGLE",

    REVIEWS_BASIC = "REVIEWS_BASIC",
}

export interface TemplateStruct<Props = {}> {
    name: TemplateComponentType
    description: string
    categories: TemplateCategory[]
    classNames: string[]
    props: Props
    Component?: React.FC<any> | LoadableComponent<any>,
    getComponent?: () => LoadableComponent<any>
}
