import parseJson from "./parseJson"

const input =`


    \`\`\`
{
    [TemplateCategory.HEADER]: {
        template: TemplateComponentType.HEADER_BURGER,
        description: "Header Burger",
        data: {
            logo: {
                url: "https://images.unsplash.com/photo-1518791845296-ec4075447b78?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8c29mdHdhcmUlMjBwcm90b3R5cGV8ZW58MHx8fHwxNzE2MzM2MjcwfDA&ixlib=rb-4.0.3&q=85",
                slogan: "Empowering Your Vision"
            },
            links: [
                {
                    name: "Home",
                    href: "/",
                    description: "Home page",
                },
                {
                    name: "About",
                    href: "#about",
                    description: "About page",
                },
                {
                    name: "Contact",
                    href: "#contact",
                    description: "contact page",
                },
            ]
        }
    },
    [TemplateCategory.HERO]: {
        template: TemplateComponentType.HERO_IMAGE,
        description: "Hero Image",
        data: {
            img: {
                src: "https://images.unsplash.com/photo-1518791845296-ec4075447b78?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8c29mdHdhcmUlMjBwcm90b3R5cGV8ZW58MHx8fHwxNzE2MzM2MjcwfDA&ixlib=rb-4.0.3&q=85",
                alt: "Main hero image"
            },
            title: "Unlock Your Potential",
            content: "Experience the difference with us.",
            cta: "Get Started",
        },
    },
    [TemplateCategory.TESTIMONIALS]: {
        template: TemplateComponentType.TESTIMONIALS_BASIC,
        description: "",
        data: {
            name: "John Doe",
            testimonial: "I've never felt so empowered in my life!",
            pictureUrl: "https://images.unsplash.com/photo-1532622785990-d2c36a76f5a6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxM3x8d2hpdGUlMjBib2FyZHxlbnwwfHx8fDE3MTYzMzYxMjZ8MA&ixlib=rb-4.0.3&q=85",
        },
    },
    [TemplateCategory.SERVICES]: {
        template: TemplateComponentType.SERVICE_BASIC,
        description: "",
        data: {
            services: [
                {
                    title: 'Unlock Your Potential',
                    description: 'Experience the difference with us.',
                    imageUrl: 'https://images.unsplash.com/photo-1518791845296-ec4075447b78?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8c29mdHdhcmUlMjBwcm90b3R5cGV8ZW58MHx8fHwxNzE2MzM2MjcwfDA&ixlib=rb-4.0.3&q=85'
                },
                {
                    title: 'Empower Your Vision',
                    description: 'Empowering Your Vision',
                    imageUrl: 'https://images.unsplash.com/photo-1532622785990-d2c36a76f5a6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxM3x8d2hpdGUlMjBib2FyZHxlbnwwfHx8fDE3MTYzMzYxMjZ8MA&ixlib=rb-4.0.3&q=85'
                },
            ]
        },
    },
    [TemplateCategory.FOOTER]: {
        template: TemplateComponentType.FOOTER_BASIC,
        description: "",
        data: {
            name: "Maistro",
            links: [
                {
                    name: "Home",
                    href: "/",
                    isExternal: false,
                    description: "Home page",
                },
                {
                    name: "About",
                    href: "/about",
                    isExternal: false,
                    description: "About page",
                },
                {
                    name: "Contact",
                    href: "/contact",
                    isExternal: false,
                    description: "contact page",
                },
            ],
            mediaLinks: [
                {
                    name: "Facebook",
                    imgSrc: "",
                    href: "/",
                    isExternal: true,
                    description: "Facebook",
                },
                {
                    name: "Instagram",
                    imgSrc: "",
                    href: "/",
                    isExternal: true,
                    description: "Instagram",
                },
                {
                    name: "TikTok",
                    imgSrc: "",
                    href: "/",
                    isExternal: true,
                    description: "TikTok",
                },
            ]
        },
    }
}
\`\`\`
`

describe("parseJSON", () => {
    it("should parse output from upstream", () => {
        const response = parseJson(input)

        console.log({ response })
    })
})