export type MaistroProduct = 
  | 'websites' 
  | 'funnels' 
  | 'customers' 
  | 'socials' 
  | 'payments' 
  | 'academy';

export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise';

export type ResourceType = 
    | 'websites'
    | 'funnels' 
    | 'customers'
    | 'analytics'
    | 'billing'
    | 'settings'
    | 'admin'
    | 'courses'
    | 'videos'
    | 'payments';

export type ActionType = 
    | 'read'
    | 'write'
    | 'delete'
    | 'admin'
    | 'create'
    | 'update'
    | 'publish'
    | 'manage';

export interface Permission {
    userId: string;
    product: MaistroProduct;
    resource: ResourceType;
    action: ActionType;
    granted: boolean;
    plan?: SubscriptionPlan;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PermissionKey {
    PK: string; // USER#${cognitoUserId}
    SK: string; // PERMISSION#${product}#${resource}#${action}
}

export interface PermissionRequest {
    userId: string;
    product: MaistroProduct;
    resource: ResourceType;
    action: ActionType;
  }

  export interface PermissionResponse {
    granted: boolean;
    reason?: string;
    expiresAt?: string;
    plan?: SubscriptionPlan;
  }
  
export interface MaistroUser {
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    plan: SubscriptionPlan;
    products: MaistroProduct[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
  }
  