import React from "react"

import PageContent from "./Store/PageContent"
import { Project } from "./Store/Project"
import { Projects } from "./Store/Projects"
import Page from "./Store/Page"
import { User } from "./Store/User"

export enum ContentCategory {
    HEADER = "HEADER",
    FOOTER = "FOOTER",
    HERO = "HERO",
    ABOUT = "ABOUT",
    SERVICES = "SERVICES",
    TEXT = "TEXT",
    CONTACT = "CONTACT"
}

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

export interface ProjectStruct {
    id: string
    title: string
    pages: Record<string, PageStruct>
    assets: Record<string, ProjectAssetStruct>
    colourScheme: ColourScheme
    fontScheme: FontScheme
}

export interface PageStruct {
    id: string
    title: string
    path: string
    description: string
    content: ContentStruct[]
    contentActive: ContentStruct | null
    colourScheme: ColourScheme
    fontScheme: FontScheme
}

export interface ContentStruct {
    id: string
    description: string
    categories: ContentCategory[]

    classNames: string[]
    props: any
    Component: React.FC | string
}

/**
 * Colours
 */
export interface ColourScheme {
    /**
     * This is the main color that represents the brand
     * or the most dominant color in the website's palette. 
     * It's used for major call-to-action (CTA) buttons, 
     * links, and headlines to draw attention.
     */
    primary: string,

    /**
     * Supports the primary color and is used for secondary buttons, 
     * highlights, and information boxes. 
     * The secondary color should complement the primary color.
     */
    secondary: string,

    /**
     * Lighter shade of the primary color
     * These are additional colors used sparingly to accentuate
     * or highlight parts of the website.
     * They can be used for icons,
     * info graphics, or to highlight key information.
     */
    accent: string,

    /**
     * A fixed light grey
     * These are usually neutral colors that
     * don't compete with the primary and secondary colors.
     */
    background: string,


    /**
     * A fixed dark grey for text
     * Besides the obvious black or white,
     * you might have specific colors for headings,
     * subheadings, and body text that fit within
     * the overall color scheme.
     */
    text: string,

    /**
     * Lighter shade of the secondary color
     * These include shades of gray, beige,
     * or off-white used for text, background,
     * borders, and shadows.
     * They help create hierarchy and contrast in the design.
     */
    neutral: string,

    palette: string[]
}

export enum ColourPalette {
    ACCENT = '--color-accent',
    BACKGROUND = '--color-background',
    NEUTRAL = '--color-neutral',
    PRIMARY = '--color-primary',
    SECONDARY = '--color-secondary',
    TEXT = '--color-text'
}


/**
 * Font
 */
export interface FamilyFont {
    name: string
    family: string
    css: string
    description?: string
}

export interface FontScheme {
    heading: FamilyFont
    body: FamilyFont
}

export enum FontFamily {
    HEADING = "--font-family-heading",
    BODY = "--font-family-body"
}

/**
 *  APP
 */
export enum PageContentMessageType {
    SET_ID = "SET_ID",
    SET_DESCRIPTION = "SET_DESCRIPTION",
    SET_COMPONENT = "SET_COMPONENT",
    SET_PROPS = "SET_PROPS",
    SET_CATEGORIES = "SET_CATEGORIES",
}

export type PageContentEvent = {
    type: PageContentMessageType.SET_ID
    data: string
} | {
    type: PageContentMessageType.SET_DESCRIPTION
    data: string
} | {
    type: PageContentMessageType.SET_COMPONENT
    data: React.FC
} | {
    type: PageContentMessageType.SET_PROPS
    data: unknown
} | {
    type: PageContentMessageType.SET_CATEGORIES
    data: ContentCategory[]
}

export enum PageMessageType {
    SET_ID = "SET_ID",
    SET_PATH = "SET_PATH",
    SET_TITLE = "SET_TITLE",
    SET_DESCRIPTION = "SET_DESCRIPTION",

    SET_CONTENT = "SET_CONTENT",
    PUT_CONTENT = "PUT_CONTENT",
    SET_CONTENT_ACTIVE = "SET_CONTENT_ACTIVE",

    SET_COLOUR_SCHEME = "SET_COLOUR_SCHEME",
    SET_FONT_SCHEME = "SET_FONT_SCHEME",

    NOTIFY_CONTENT_UPDATED = "NOTIFY_CONTENT_UPDATED",
}

export type PageEvent = {
    type: PageMessageType.SET_PATH
    data: string
} | {
    type: PageMessageType.SET_TITLE
    data: string
} | {
    type: PageMessageType.SET_ID
    data: string
} | {
    type: PageMessageType.SET_DESCRIPTION
    data: string
} | {
    type: PageMessageType.SET_CONTENT | PageMessageType.PUT_CONTENT
    data: PageContent[]
} | {
    type: PageMessageType.SET_CONTENT_ACTIVE
    data: PageContent | null
} | {
    type: PageMessageType.SET_COLOUR_SCHEME
    data: ColourScheme
} | {
    type: PageMessageType.SET_FONT_SCHEME
    data: FontScheme
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

export enum ProjectMessageType {
    SET_TITLE = "SET_TITLE",

    SET_PAGE = "SET_PAGE",
    READ_PAGE = "READ_PAGE", // TODO do we need this?
    DELETE_PAGE = "DELETE_PAGE",

    SET_ASSET = "SET_ASSET",
    DELETE_ASSET = "DELETE_ASSET",

    SET_COLOUR_SCHEME = "SET_COLOUR_SCHEME",
    SET_FONT_SCHEME = "SET_FONT_SCHEME",
}

export type ProjectEvent = {
    type: ProjectMessageType.SET_PAGE
    data: PageStruct
} | {
    type: ProjectMessageType.READ_PAGE
    data: string
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
    type: ProjectMessageType.SET_COLOUR_SCHEME
    data: ColourScheme
} | {
    type: ProjectMessageType.SET_FONT_SCHEME
    data: FontScheme
} | {
    type: ProjectMessageType.SET_TITLE
    data: string
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
    pageContent: PageContent
}

export interface AppState {
    user: unknown
}

