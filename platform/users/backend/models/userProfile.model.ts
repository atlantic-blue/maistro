import { MaistroUser, Service, UserProfile } from "../types/user";

class UserProfileModel implements UserProfile {
    public UserId: MaistroUser["UserId"];
    public CompanyName?: string;
    public Industry?: string;
    public CompanySize?: string;
    public Country?: string;
    public OnboardingCompleted: boolean;
    public OnboardingStep: number;
    public MarketingOptIn: boolean;
    public CreatedAt: string;
    public UpdatedAt: string;
    public BusinessName: string;
    public Website: string;
    public BusinessType: string[];
    public AccountType: 'independent' | 'team' | string;
    public TeamSize: string;
    public Address: string;
    public Phone: string;
    public Description: string;
    public Services: Service[];
    public Features: string[];
    public HearAbout: string;

    constructor(userProfile: UserProfile) {
        this.UserId = userProfile.UserId
        this.AccountType = userProfile.AccountType
        this.Address = userProfile.Address
        this.BusinessName = userProfile.BusinessName
        this.BusinessType = userProfile.BusinessType
        this.CompanyName = userProfile.CompanyName
        this.CompanySize = userProfile.CompanySize
        this.Country = userProfile.CompanySize
        this.CreatedAt = userProfile.CreatedAt
        this.Description = userProfile.Description
        this.Features = userProfile.Features
        this.HearAbout = userProfile.HearAbout
        this.Industry = userProfile.Industry
        this.OnboardingCompleted = userProfile.OnboardingCompleted
        this.OnboardingStep = userProfile.OnboardingStep
        this.MarketingOptIn = userProfile.MarketingOptIn
        this.UpdatedAt = userProfile.UpdatedAt
        this.Website = userProfile.Website
        this.TeamSize = userProfile.TeamSize
        this.Phone = userProfile.Phone
        this.Services = userProfile.Services
    }
}

export default UserProfileModel