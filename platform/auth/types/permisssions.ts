import { ActionType, MaistroProduct, ResourceType, SubscriptionPlan } from "./main";

export const DEFAULT_PERMISSIONS: Record<SubscriptionPlan, Array<{
    product: MaistroProduct;
    resource: ResourceType;
    action: ActionType;
    granted: boolean;
  }>> = {
    free: [
      // Websites - Free access
      { product: 'websites', resource: 'websites', action: 'read', granted: true },
      { product: 'websites', resource: 'websites', action: 'create', granted: true },
      { product: 'websites', resource: 'websites', action: 'update', granted: true },
      { product: 'websites', resource: 'analytics', action: 'read', granted: false },
      
      // Funnels - Free access
      { product: 'funnels', resource: 'funnels', action: 'read', granted: true },
      { product: 'funnels', resource: 'funnels', action: 'create', granted: true },
      { product: 'funnels', resource: 'analytics', action: 'read', granted: false },
      
      // Customers - Free access
      { product: 'customers', resource: 'customers', action: 'read', granted: true },
      { product: 'customers', resource: 'customers', action: 'create', granted: true },
      { product: 'customers', resource: 'analytics', action: 'read', granted: false },
      
      // Socials - Free access
      { product: 'socials', resource: 'analytics', action: 'read', granted: false },
      
      // Payments - Read only
      { product: 'payments', resource: 'payments', action: 'read', granted: true },
      { product: 'payments', resource: 'billing', action: 'read', granted: true },
      { product: 'payments', resource: 'payments', action: 'create', granted: false },
      
      // Academy - Free access
      { product: 'academy', resource: 'courses', action: 'read', granted: true },
      { product: 'academy', resource: 'videos', action: 'read', granted: true },
    ],

    basic: [
        // Websites - Basic access
        { product: 'websites', resource: 'websites', action: 'read', granted: true },
        { product: 'websites', resource: 'websites', action: 'create', granted: true },
        { product: 'websites', resource: 'websites', action: 'update', granted: true },
        { product: 'websites', resource: 'analytics', action: 'read', granted: false },
        
        // Funnels - Basic access
        { product: 'funnels', resource: 'funnels', action: 'read', granted: true },
        { product: 'funnels', resource: 'funnels', action: 'create', granted: true },
        { product: 'funnels', resource: 'analytics', action: 'read', granted: false },
        
        // Customers - Basic access
        { product: 'customers', resource: 'customers', action: 'read', granted: true },
        { product: 'customers', resource: 'customers', action: 'create', granted: true },
        { product: 'customers', resource: 'analytics', action: 'read', granted: false },
        
        // Socials - Basic access
        { product: 'socials', resource: 'analytics', action: 'read', granted: false },
        
        // Payments - Read only
        { product: 'payments', resource: 'payments', action: 'read', granted: true },
        { product: 'payments', resource: 'billing', action: 'read', granted: true },
        { product: 'payments', resource: 'payments', action: 'create', granted: false },
        
        // Academy - Basic access
        { product: 'academy', resource: 'courses', action: 'read', granted: true },
        { product: 'academy', resource: 'videos', action: 'read', granted: true },
      ],
    
    pro: [
      // Websites - Full access
      { product: 'websites', resource: 'websites', action: 'read', granted: true },
      { product: 'websites', resource: 'websites', action: 'create', granted: true },
      { product: 'websites', resource: 'websites', action: 'update', granted: true },
      { product: 'websites', resource: 'websites', action: 'delete', granted: true },
      { product: 'websites', resource: 'websites', action: 'publish', granted: true },
      { product: 'websites', resource: 'analytics', action: 'read', granted: true },
      
      // Funnels - Full access
      { product: 'funnels', resource: 'funnels', action: 'read', granted: true },
      { product: 'funnels', resource: 'funnels', action: 'create', granted: true },
      { product: 'funnels', resource: 'funnels', action: 'update', granted: true },
      { product: 'funnels', resource: 'funnels', action: 'delete', granted: true },
      { product: 'funnels', resource: 'funnels', action: 'publish', granted: true },
      { product: 'funnels', resource: 'analytics', action: 'read', granted: true },
      
      // Customers - Full access
      { product: 'customers', resource: 'customers', action: 'read', granted: true },
      { product: 'customers', resource: 'customers', action: 'create', granted: true },
      { product: 'customers', resource: 'customers', action: 'update', granted: true },
      { product: 'customers', resource: 'customers', action: 'delete', granted: true },
      { product: 'customers', resource: 'analytics', action: 'read', granted: true },
      
      // Socials - Full access
      { product: 'socials', resource: 'analytics', action: 'read', granted: true },
      { product: 'socials', resource: 'settings', action: 'manage', granted: true },
      
      // Payments - Full access
      { product: 'payments', resource: 'payments', action: 'read', granted: true },
      { product: 'payments', resource: 'payments', action: 'create', granted: true },
      { product: 'payments', resource: 'payments', action: 'update', granted: true },
      { product: 'payments', resource: 'billing', action: 'read', granted: true },
      { product: 'payments', resource: 'billing', action: 'manage', granted: true },
      
      // Academy - Full access
      { product: 'academy', resource: 'courses', action: 'read', granted: true },
      { product: 'academy', resource: 'courses', action: 'create', granted: true },
      { product: 'academy', resource: 'videos', action: 'read', granted: true },
      { product: 'academy', resource: 'videos', action: 'create', granted: true },
    ],
    
    enterprise: [
      // All products - Full access including admin
      { product: 'websites', resource: 'websites', action: 'read', granted: true },
      { product: 'websites', resource: 'websites', action: 'create', granted: true },
      { product: 'websites', resource: 'websites', action: 'update', granted: true },
      { product: 'websites', resource: 'websites', action: 'delete', granted: true },
      { product: 'websites', resource: 'websites', action: 'publish', granted: true },
      { product: 'websites', resource: 'analytics', action: 'read', granted: true },

      { product: 'funnels', resource: 'funnels', action: 'read', granted: true },
      { product: 'funnels', resource: 'funnels', action: 'create', granted: true },
      { product: 'funnels', resource: 'funnels', action: 'update', granted: true },
      { product: 'funnels', resource: 'funnels', action: 'delete', granted: true },
      { product: 'funnels', resource: 'funnels', action: 'publish', granted: true },
      { product: 'funnels', resource: 'analytics', action: 'read', granted: true },
      
      { product: 'customers', resource: 'customers', action: 'read', granted: true },
      { product: 'customers', resource: 'customers', action: 'create', granted: true },
      { product: 'customers', resource: 'customers', action: 'update', granted: true },
      { product: 'customers', resource: 'customers', action: 'delete', granted: true },
      { product: 'customers', resource: 'analytics', action: 'read', granted: true },
      
      { product: 'socials', resource: 'analytics', action: 'read', granted: true },
      { product: 'socials', resource: 'analytics', action: 'admin', granted: true },
      { product: 'socials', resource: 'settings', action: 'manage', granted: true },
      
      { product: 'payments', resource: 'payments', action: 'read', granted: true },
      { product: 'payments', resource: 'payments', action: 'create', granted: true },
      { product: 'payments', resource: 'payments', action: 'update', granted: true },
      { product: 'payments', resource: 'payments', action: 'delete', granted: true },
      { product: 'payments', resource: 'billing', action: 'read', granted: true },
      { product: 'payments', resource: 'billing', action: 'manage', granted: true },
      
      { product: 'academy', resource: 'courses', action: 'read', granted: true },
      { product: 'academy', resource: 'courses', action: 'create', granted: true },
      { product: 'academy', resource: 'courses', action: 'update', granted: true },
      { product: 'academy', resource: 'courses', action: 'delete', granted: true },
      { product: 'academy', resource: 'videos', action: 'read', granted: true },
      { product: 'academy', resource: 'videos', action: 'create', granted: true },
      { product: 'academy', resource: 'videos', action: 'update', granted: true },
      { product: 'academy', resource: 'videos', action: 'delete', granted: true },
    ]
  };
  