import React from "react"

import ProjectContent from "./Store/ProjectContent"
import { Project } from "./Store/Project"
import { Projects } from "./Store/Projects"
import Page from "./Store/Page"
import { User } from "./Store/User"
import { TemplateComponentType } from "./Templates/templateTypes"
import { Currency } from "./Utils/currency"
import { Item } from "./Store/Order"

export interface UserStruct {
    id: string
    avatar: string
    email: string
    name: string
    tokenAccess: string
    tokenId: string
}

export interface ProjectAssetStruct {
    id: string
    description: string
    src: string
    contentType: string
}

export interface OrderStruct {
    id: string
    shoppingCartId: string
    updatedAt: string
    status: OrderStatus
    items: Item[]
    fulfilment: {
        date: string
        interval: string
    }
}

export interface ProjectStruct {
    id: string
    userId: string
    name: string
    url: string
    logo: string
    email: string
    pages: Record<string, PageStruct>
    assets: Record<string, ProjectAssetStruct>
    content: Record<string, ProjectContentStruct>
    emailLists: Record<string, ProjectEmailListStruct>
    threads: Record<string, ProjectThreadStruct>
    products: Record<string, ProductStruct>
    orders: Record<string, OrderStruct>
    theme: ProjectTheme,
    currency: Currency
}

export interface ProductModifierStruct {
    id: string
    imgSrc: string
    name: string
    description: string
    price: number
}

export interface ProductStruct {
    id: string
    name: string
    description: string
    price: number
    stockQuantity: number
    currency: Currency
    images: string[]
    options: Record<string, string[]>
    modifiers: ProductModifierStruct[]
}

export interface ProjectEmailListStruct {
    id: string,
    projectId: string,

    title: string,
    description: string,
    createdAt: string,
    status: string
}

export interface PageStruct {
    id: string
    projectId: string,

    title: string
    path: string
    description: string
    keywords: string
    contentIds: string[]
}

export interface ProjectContentStruct {
    id: string
    projectId: string
    createdAt: string
    description: string
    template: TemplateComponentType
    categories: string[]
    data: Object | undefined
}

export interface ProjectThreadStruct {
    id: string
    name: string
    projectId: string
    createdAt: string
    updatedAt: string
    messages: ProjectThreadMessage[]
    inputTokens: number
    outputTokens: number
}

export enum ProjectThreadName {
    COPYWRITING = "MAISTRO_COPYWRITING"
}

export enum ProjectThreadMessageRole {
    USER = "user",
    ASSISTANT = "assistant",
    SYSTEM = "system"
}

export interface ProjectThreadMessage {
    timestamp: string
    content: {
        text: string
    }[]
    role: ProjectThreadMessageRole
}

/**
 * Theme
 */

export enum ProjectThemeAccentColour {
    "gray" = "gray",
    "gold" = "gold",
    "bronze" = "bronze",
    "brown" = "brown",
    "yellow" = "yellow",
    "amber" = "amber",
    "orange" = "orange",
    "tomato" = "tomato",
    "red" = "red",
    "ruby" = "ruby",
    "crimson" = "crimson",
    "pink" = "pink",
    "plum" = "plum",
    "purple" = "purple",
    "violet" = "violet",
    "iris" = "iris",
    "indigo" = "indigo",
    "blue" = "blue",
    "cyan" = "cyan",
    "teal" = "teal",
    "jade" = "jade",
    "green" = "green",
    "grass" = "grass",
    "lime" = "lime",
    "mint" = "mint",
    "sky" = "sky"
}

export enum ProjectThemeGrayColour {
    "auto" = "auto",
    "gray" = "gray",
    "mauve" = "mauve",
    "slate" = "slate",
    "sage" = "sage",
    "olive" = "olive",
    "sand" = "sand"
}

export interface ProjectTheme {
    accentColor: ProjectThemeAccentColour
    grayColor: ProjectThemeGrayColour
    appearance: "inherit" | "light" | "dark"
    radius: "none" | "small" | "medium" | "large" | "full"
    scaling: "90%" | "95%" | "100%" | "105%" | "110%"
}

/**
 *  APP
 */
export enum ProjectEmailListMessageType {
    SET_STATUS = "SET_STATUS",
    SET_DESCRIPTION = "SET_DESCRIPTION",
    SET_TITLE = "SET_TITLE",
}

export type ProjectEmailListEvent = {
    type: ProjectEmailListMessageType.SET_STATUS
    data: string
} | {
    type: ProjectEmailListMessageType.SET_DESCRIPTION
    data: string
} | {
    type: ProjectEmailListMessageType.SET_TITLE
    data: string
}

export enum PageContentMessageType {
    SET_DESCRIPTION = "SET_DESCRIPTION",
}

export type PageContentEvent = {
    type: PageContentMessageType.SET_DESCRIPTION
    data: string
}

export enum PageMessageType {
    SET = "SET",

    SET_ID = "SET_ID",
    SET_PATH = "SET_PATH",
    SET_TITLE = "SET_TITLE",
    SET_DESCRIPTION = "SET_DESCRIPTION",

    PUSH_CONTENT_IDS = "PUT_CONTENT_IDS",
    SET_CONTENT_IDS = "SET_CONTENT_IDS",
    DELETE_CONTENT_IDS = "DELETE_CONTENT_IDS",

    NOTIFY_CONTENT_UPDATED = "NOTIFY_CONTENT_UPDATED",
}

export type PageEvent = {
    type: PageMessageType.SET
    data: PageStruct
} | {
    type: PageMessageType.SET_PATH
    data: string
} | {
    type: PageMessageType.SET_TITLE
    data: string
} | {
    type: PageMessageType.SET_ID
    data: string
} | {
    type: PageMessageType.SET_CONTENT_IDS | PageMessageType.PUSH_CONTENT_IDS | PageMessageType.DELETE_CONTENT_IDS
    data: string[]
} | {
    type: PageMessageType.SET_DESCRIPTION
    data: string
} | {
    type: PageMessageType.NOTIFY_CONTENT_UPDATED
}

export enum ProjectAssetMessageType {
    SET_ID = "SET_ID",
    SET_DESCRIPTION = "SET_DESCRIPTION",
    SET_SRC = "SET_SRC",
    SET_EXTENSION = "SET_EXTENSION",
}

export type ProjectAssetEvent = {
    type: ProjectAssetMessageType.SET_ID
    data: string
} | {
    type: ProjectAssetMessageType.SET_DESCRIPTION
    data: string
} | {
    type: ProjectAssetMessageType.SET_SRC
    data: string
} | {
    type: ProjectAssetMessageType.SET_EXTENSION
    data: string
}

// Project Thread
export enum ProjectThreadMessageType {
    PUSH_MESSAGE = "PUSH_MESSAGE",
}

export type ProjectThreadEvent = {
    type: ProjectThreadMessageType.PUSH_MESSAGE
    data: {
        message: ProjectThreadMessage
        inputTokens: number,
        outputTokens: number,
    }
}

export enum ProjectMessageType {
    SET = "SET",

    SET_NAME = "SET_NAME",
    SET_URL = "SET_URL",

    SET_PAGE = "SET_PAGE",
    DELETE_PAGE = "DELETE_PAGE",

    SET_ASSET = "SET_ASSET",
    DELETE_ASSET = "DELETE_ASSET",

    SET_CONTENT = "SET_CONTENT",
    DELETE_CONTENT = "DELETE_CONTENT",

    SET_EMAIL_LIST = "SET_EMAIL_LIST",
    DELETE_EMAIL_LIST = "DELETE_EMAIL_LIST",

    SET_AI_THREAD = "SET_AI_THREAD",
    DELETE_AI_THREAD = "DELETE_AI_THREAD",

    SET_PRODUCT = "SET_PRODUCT",
    DELETE_PRODUCT = "DELETE_PRODUCT",

    SET_ORDER = "SET_ORDER",
    DELETE_ORDER = "DELETE_ORDER",

    SET_THEME = "SET_THEME",
    SET_CURRENCY = "SET_CURRENCY",
}

export type ProjectEvent = {
    type: ProjectMessageType.SET
    data: ProjectStruct
} | {
    type: ProjectMessageType.SET_PAGE
    data: PageStruct
} | {
    type: ProjectMessageType.DELETE_PAGE
    data: string
} | {
    type: ProjectMessageType.SET_ASSET
    data: ProjectAssetStruct
} | {
    type: ProjectMessageType.DELETE_ASSET
    data: string
} | {
    type: ProjectMessageType.SET_CONTENT
    data: ProjectContentStruct
} | {
    type: ProjectMessageType.DELETE_CONTENT
    data: string
} | {
    type: ProjectMessageType.SET_EMAIL_LIST
    data: ProjectEmailListStruct
} | {
    type: ProjectMessageType.DELETE_EMAIL_LIST
    data: string
} | {
    type: ProjectMessageType.SET_AI_THREAD
    data: ProjectThreadStruct
} | {
    type: ProjectMessageType.DELETE_AI_THREAD
    data: string
} | {
    type: ProjectMessageType.SET_PRODUCT
    data: ProductStruct
} | {
    type: ProjectMessageType.DELETE_PRODUCT
    data: string
} | {
    type: ProjectMessageType.SET_ORDER
    data: OrderStruct
} | {
    type: ProjectMessageType.DELETE_ORDER
    data: string
} | {
    type: ProjectMessageType.SET_NAME
    data: string
} | {
    type: ProjectMessageType.SET_URL
    data: string
} | {
    type: ProjectMessageType.SET_THEME
    data: ProjectTheme
} | {
    type: ProjectMessageType.SET_CURRENCY
    data: Currency
}

/**
 * Product
 */
export enum ProductMessageType {
    SET = "SET"
}

export type ProductEvent = {
    type: ProductMessageType.SET
    data: ProductStruct
}

/**
 * Order
 */
export enum OrderStatus {
    CREATED = "CREATED",
    PAYMENT_ACCEPTED = "PAYMENT_ACCEPTED",
    CHECKOUT_COMPLETED = "CHECKOUT_COMPLETED",

    ACKNOWLEDGED = "ACKNOWLEDGED",
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    COMPLETED = "COMPLETED",
}

export enum OrderMessageType {
    SET = "SET"
}

export type OrderEvent = {
    type: OrderMessageType.SET
    data: OrderStruct
}

export enum ProjectsMessageType {
    SET_PROJECT = "SET_PROJECT",
    GET_PROJECT = "GET_PROJECT",
    DELETE_PROJECT = "DELETE_PROJECT",
}

export type ProjectsEvent = {
    type: ProjectsMessageType.SET_PROJECT
    data: ProjectStruct
} | {
    type: ProjectsMessageType.DELETE_PROJECT
    data: string
}

export interface ProjectsState {
    projects: Projects
    user: User
}

export interface ProjectState {
    project: Project
}

export interface PageState {
    page: Page
}

export interface PageContentState {
    pageContent: ProjectContent
}

export interface AppState {
    user: unknown
}

