import { v4 as uuidv4 } from 'uuid';

import { BusinessProfileModel } from "../models/business.model";
import { BusinessesProfileRepository } from "../repositories/businesses.repository";
import { BusinessProfile, Service } from "../types/business";

export interface OnboardingFormData {
  businessName: string;
  website: string;
  businessType: string[];
  accountType: 'independent' | 'team' | '';
  teamSize: string;
  address: string;
  phone: string;
  description: string;
  services: Service[];
  features: string[];
  hearAbout: string;
}

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

    async getBusinessProfileByBusinessId(businessId?: string): Promise<BusinessProfile| null> {
        if(!businessId) {
            return null
        }

        const profile = await this.dbRepository.getBusinessProfileByBusinessId(businessId)
        if(!profile) {
            return null
        }

        const businessProfile = new BusinessProfileModel(profile)
        return businessProfile
    }

    async getBusinessProfileByUserId(userId?: string): Promise<BusinessProfile| null> {
        if(!userId) {
            return null
        }

        const profile = await this.dbRepository.getBusinessProfileByUserId(userId)
        if(!profile) {
            return null
        }

        const businessProfile = new BusinessProfileModel(profile)
        return businessProfile
    }

    async updateBusinessProfile(
        onboardingData: OnboardingFormData,
        userId: string
    ): Promise<BusinessProfile> {
        const timestamp = new Date().toISOString();
        const businessId = uuidv4()

        const businessProfile: BusinessProfile = {
            UserId: userId,
            BusinessId: businessId,
            OnboardingCompleted: true,
            OnboardingStep: 0,
            MarketingOptIn: false,
            CreatedAt: timestamp,
            UpdatedAt: timestamp,
            Slug: this.generateSlug(onboardingData.businessName, businessId),
            BusinessName: onboardingData.businessName,
            Website: onboardingData.website,
            BusinessType: onboardingData.businessType,
            AccountType: onboardingData.accountType,
            TeamSize: onboardingData.teamSize,
            Address: onboardingData.address,
            Phone: onboardingData.phone,
            Description: onboardingData.description,
            Services: onboardingData.services,
            Features: onboardingData.features,
            HearAbout: onboardingData.hearAbout,
        };

        await this.dbRepository.updateBusinessProfile(businessProfile)

        return businessProfile
    }

    private generateSlug(businessName: string, businessId: string): string {
        let baseSlug = (typeof businessName === "string" ? businessName : "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")  // remove invalid chars
            .replace(/\s+/g, "-")          // spaces -> dashes
            .replace(/-+/g, "-");          // collapse multiple dashes

        if (!baseSlug) {
            baseSlug = "business";
        }

        const uniqueId = businessId.slice(0, 4);
        return `${baseSlug}-${uniqueId}`;
    }
}