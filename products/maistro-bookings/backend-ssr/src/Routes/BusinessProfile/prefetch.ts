import { getBusinessProfileBySlug } from "../../Api/BusinessProfile";
import { BusinessProfile } from "../Dahsboard/types";

export const businessProfilePrefetch = async(businessSlug: string): Promise<BusinessProfile> => {
    // const businessProfile = await getBusinessProfileBySlug(businessSlug)
    // console.log({businessProfile})
    const businessProfile = {
    Slug: 'julio-el-barber-6b15',
    BusinessId: '6b15f2e4-fc4e-42b7-8c91-1bc45558bdfb',
    AccountType: 'independent',
    Address: 'barber',
    BusinessName: 'julio el barber',
    BusinessType: [ 'hair-salon', 'beauty-clinic', 'fitness-studio' ],
    CompanyName: '',
    CompanySize: '',
    Country: '',
    CreatedAt: '2025-08-26T00:25:19.198Z',
    Description: 'awefasdfasdf',
    Features: [ 'Acepta mascotas', 'Accesible para sillas de ruedas' ],
    HearAbout: '',
    Industry: '',
    Website: 'barber.com',
    UserId: '8ce16986-e63d-49b7-8f5b-1c0164829e53',
    UpdatedAt: '2025-08-26T00:25:19.198Z',
    TeamSize: '',
    Services: [ ],
    Phone: '232323',
    MarketingOptIn: false,
    OnboardingCompleted: true,
    OnboardingStep: 0
  } as any

    return businessProfile
}
