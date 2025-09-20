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

export interface UpdateBusinessFormData {
  businessName: string;
  website: string;
  businessType: string[];
  accountType: 'independent' | 'team' | '';
  teamSize: string;
  address: string;
  phone: string;
  addressDetails: {
    city: string;
    country: string;
    postcode: string;
    firstLine: string;
  };
  email: string;
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

    async getBusinessProfileByUserId(userId?: string): Promise<BusinessProfile[]| null> {
        if(!userId) {
            return null
        }

        const profiles = await this.dbRepository.getBusinessProfileByUserId(userId)
        if(!profiles) {
            return null
        }

        const businessProfiles = profiles.map(profile => new BusinessProfileModel(profile))
        return businessProfiles
    }

    async createBusinessProfile(
        onboardingData: OnboardingFormData,
        userId: string,
        userEmail: string
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
            Email: userEmail,
            BusinessName: onboardingData.businessName,
            Website: onboardingData.website,
            BusinessType: onboardingData.businessType,
            AccountType: onboardingData.accountType,
            TeamSize: onboardingData.teamSize,
            Address: onboardingData.address,
            AddressDetails: {
                FirstLine: onboardingData.address,
                City: "",
                Country: "",
                Postcode: "",
            },
            Phone: onboardingData.phone,
            Description: onboardingData.description,
            Services: onboardingData.services,
            Features: onboardingData.features,
            HearAbout: onboardingData.hearAbout,
        };

        await this.dbRepository.updateBusinessProfile(businessProfile)

        return businessProfile
    }

    async updateBusinessProfile(
        data: UpdateBusinessFormData,
        businessId: string,
        userId: string,
    ): Promise<BusinessProfile | null> {
        const timestamp = new Date().toISOString();

        const currentData = await this.getBusinessProfileByBusinessId(businessId)
        if(!currentData) {
            return null
        }

        // // TODO enable with admin roles!
        // if(currentData.UserId !== userId) {
        //     console.log("userId missmatch!")
        //     return null
        // }

        const businessProfile: BusinessProfile = {
            UserId: currentData.UserId,
            BusinessId: currentData.BusinessId,
            Slug: currentData.Slug,
            CreatedAt: currentData.CreatedAt,
            OnboardingCompleted: currentData.OnboardingCompleted,
            OnboardingStep: currentData.OnboardingStep,
            MarketingOptIn: currentData.MarketingOptIn,
            UpdatedAt: timestamp,

            BusinessName: data.businessName,
            Website: data.website,
            BusinessType: data.businessType,
            AccountType: data.accountType,
            TeamSize: data.teamSize,
            Address: data.address,
            Phone: data.phone,
            Description: data.description,
            Services: data.services,
            Features: data.features,
            HearAbout: data.hearAbout,
            AddressDetails: {
                FirstLine: data.addressDetails.firstLine,
                City: data.addressDetails.city,
                Country: data.addressDetails.country,
                Postcode: data.addressDetails.postcode,
            },
            Email: data.email,
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