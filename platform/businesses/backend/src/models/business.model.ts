import { BusinessProfile, Service } from "../types/business"

export class BusinessProfileModel implements BusinessProfile {
    public Slug: string
    public BusinessId: string
    public AccountType: string
    public Address: string

    public BusinessName: string
    public BusinessType: string[]
    public Country: string
    public CreatedAt: string
    public Description: string
    public Features: string[]
    public HearAbout: string
    public Industry: string
    public Website: string
    public UserId: string
    public UpdatedAt: string
    public TeamSize: string
    public Services: Service[]
    public Phone: string
    public MarketingOptIn: boolean
    public OnboardingCompleted: boolean
    public OnboardingStep: number
    public AddressDetails: { City: string; Country: string; Postcode: string; FirstLine: string }
    public Email: string
    public Images: { Main: string; Gallery: string[] }

    constructor(input: BusinessProfile) {
        this.Slug = input.Slug
        this.BusinessId = input.BusinessId
        this.AccountType = input.AccountType
        this.Address = input.Address
        this.AddressDetails = input.AddressDetails
        this.Email = input.Email
        this.Images = input.Images
        this.BusinessId = input.BusinessId
        this.BusinessName = input.BusinessName
        this.BusinessType = input.BusinessType
        this.Country = input.Country || ""
        this.CreatedAt = input.CreatedAt
        this.Description = input.Description
        this.Features = input.Features
        this.HearAbout = input.HearAbout
        this.Industry = input.Industry || ""
        this.Website = input.Website
        this.UserId = input.UserId
        this.UpdatedAt = input.UpdatedAt
        this.TeamSize = input.TeamSize || "1"
        this.Slug = input.Slug
        this.Services = input.Services
        this.Phone = input.Phone
        this.MarketingOptIn = input.MarketingOptIn
        this.OnboardingCompleted = input.OnboardingCompleted
        this.OnboardingStep = input.OnboardingStep
    }
}
