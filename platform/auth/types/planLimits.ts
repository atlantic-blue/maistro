import { SubscriptionPlan } from "./main";

export interface PlanLimitsWebsites { 
    maxSites: number; 
    customDomain: boolean; 
    analytics: boolean 
};

export interface PlanLimitsFunnels { 
    maxFunnels: number; 
    maxSteps: number; 
    analytics: boolean 
};

export interface PlanLimitsCustomers { 
    maxContacts: number; 
    automation: boolean; 
    analytics: boolean 
};

export interface PlanLimitsAcademy { 
    maxCourses: number; 
    videoStorage: string; 
    analytics: boolean 
};

export const PLAN_LIMITS: Record<SubscriptionPlan, {
    websites: PlanLimitsWebsites;
    funnels: PlanLimitsFunnels
    customers: PlanLimitsCustomers
    academy: PlanLimitsAcademy
  }> = {
    free: {
      websites: { maxSites: 1, customDomain: false, analytics: false },
      funnels: { maxFunnels: 2, maxSteps: 5, analytics: false },
      customers: { maxContacts: 100, automation: false, analytics: false },
      academy: { maxCourses: 0, videoStorage: '0GB', analytics: false }
    },
    basic: {
        websites: { maxSites: 1, customDomain: false, analytics: false },
        funnels: { maxFunnels: 2, maxSteps: 5, analytics: false },
        customers: { maxContacts: 100, automation: false, analytics: false },
        academy: { maxCourses: 0, videoStorage: '0GB', analytics: false }
    },
    pro: {
      websites: { maxSites: 10, customDomain: true, analytics: true },
      funnels: { maxFunnels: 25, maxSteps: 20, analytics: true },
      customers: { maxContacts: 5000, automation: true, analytics: true },
      academy: { maxCourses: 10, videoStorage: '10GB', analytics: true }
    },
    enterprise: {
      websites: { maxSites: -1, customDomain: true, analytics: true }, // -1 = unlimited
      funnels: { maxFunnels: -1, maxSteps: -1, analytics: true },
      customers: { maxContacts: -1, automation: true, analytics: true },
      academy: { maxCourses: -1, videoStorage: '100GB', analytics: true }
    }
  };
