import { MaistroUser, SubscriptionTier } from "../types/user";

class UserModel implements MaistroUser {
    public UserId: string;
    public CognitoUserId: string;
    public Email: string;
    public CreatedAt: string;
    public UpdatedAt: string;
    public LastLoginAt: string;
    public Status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    public SubscriptionTier: SubscriptionTier;
    public EmailVerified: boolean;
    public ProductAccess: {
        websites: boolean;
        funnels: boolean;
        customers: boolean;
        socials: boolean;
        chats: boolean;
        academy: boolean;
        bookings: boolean;
    };

    public FirstName?: string;
    public LastName?: string;
    public Avatar?: string;
    public PhoneNumber?: string;
    public PhoneVerified?: boolean;
    public PreferredLanguage?: string;
    public Timezone?: string;

    constructor(maistroUser: MaistroUser) {
        this.UserId = maistroUser.UserId
        this.CognitoUserId = maistroUser.CognitoUserId
        this.Email = maistroUser.Email
        this.CreatedAt = maistroUser.CreatedAt
        this.UpdatedAt = maistroUser.UpdatedAt
        this.LastLoginAt = maistroUser.LastLoginAt
        this.Status = maistroUser.Status
        this.SubscriptionTier = maistroUser.SubscriptionTier
        this.EmailVerified = maistroUser.EmailVerified
        this.ProductAccess = maistroUser.ProductAccess

        this.FirstName = maistroUser.FirstName
        this.LastName = maistroUser.LastName
        this.PhoneNumber = maistroUser.PhoneNumber
        this.PhoneVerified = maistroUser.PhoneVerified
        this.PreferredLanguage = maistroUser.PreferredLanguage
        this.Timezone = maistroUser.Timezone
    }
}

export default UserModel
