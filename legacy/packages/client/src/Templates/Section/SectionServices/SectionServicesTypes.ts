interface Service {
    title: string,
    description: string,
    imageUrl: string,
}

export interface SectionServicesProps {
    "data-hydration-id"?: string
    services: Service[]
}
