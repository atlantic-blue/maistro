import { BusinessProfile } from "../types/business"

export class BusinessProfileModel implements BusinessProfile {
    public slug = ""
    public id = ""

    constructor(input: BusinessProfile) {
        this.slug = input.slug
        this.id = input.id
    }
}
