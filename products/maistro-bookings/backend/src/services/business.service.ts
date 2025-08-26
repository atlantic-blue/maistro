import { BusinessProfileModel } from "../models/publicBusiness.model";
import { BusinessProfileRepository } from "../repositories/business.repository";
import { BusinessProfile } from "../types/business";

export class BusinessProfileService {
    private businessProfileRepository: BusinessProfileRepository

    constructor(businessProfileRepository: BusinessProfileRepository) {
        this.businessProfileRepository = businessProfileRepository
    }

    async getBusinessProfileBySlug(slug?: string): Promise<BusinessProfile| null> {
        if(!slug) {
            return null
        }

        const profile = await this.businessProfileRepository.getBusinessProfileBySlug(slug)
        if(!profile) {
            return null
        }

        const businessProfile = new BusinessProfileModel(profile)
        return businessProfile
    }
}