import { BusinessProfileModel } from "../models/business.model";
import { BusinessesProfileRepository } from "../repositories/businesses.repository";
import { BusinessProfile } from "../types/business";

export class BusinessesProfileService {
    private dbRepository: BusinessesProfileRepository

    constructor(businessesProfileRepository: BusinessesProfileRepository) {
        this.dbRepository = businessesProfileRepository
    }

    async getBusinessProfileBySlug(slug?: string): Promise<BusinessProfile| null> {
        if(!slug) {
            return null
        }

        const profile = await this.dbRepository.getBusinessProfileBySlug(slug)
        if(!profile) {
            return null
        }

        const businessProfile = new BusinessProfileModel(profile)
        return businessProfile
    }
}