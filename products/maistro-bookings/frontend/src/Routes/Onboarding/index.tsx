import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Upload, MapPin, Clock, Star, Users, Scissors, Sparkles, Dumbbell, Heart, PawPrint } from 'lucide-react';
import StepWrapper from './StepWrapper';

// Type definitions
interface BusinessCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Service {
  name: string;
  duration: string;
  price: number;
}

interface FormData {
  businessName: string;
  website: string;
  businessType: string;
  accountType: 'independent' | 'team' | '';
  teamSize: string;
  address: string;
  phone: string;
  description: string;
  services: Service[];
  features: string[];
  hearAbout: string;
}

interface StepWrapperProps {
  children: React.ReactNode;
  showBack?: boolean;
  showContinue?: boolean;
  canContinue?: boolean;
}

// Business categories matching the requirements
const businessCategories: BusinessCategory[] = [
  { id: 'hair-salon', name: 'Hair Salon', icon: Scissors },
  { id: 'spa', name: 'Spa', icon: Sparkles },
  { id: 'barbershop', name: 'Barbershop', icon: Scissors },
  { id: 'beauty-clinic', name: 'Beauty Clinic', icon: Heart },
  { id: 'fitness-studio', name: 'Fitness Studio', icon: Dumbbell },
  { id: 'medical-spa', name: 'Medical Spa', icon: Sparkles },
  { id: 'nails', name: 'Nails', icon: Heart },
  { id: 'eyebrows-lashes', name: 'Eyebrows & Lashes', icon: Heart },
  { id: 'massage', name: 'Massage', icon: Sparkles },
  { id: 'waxing', name: 'Waxing Salon', icon: Heart },
  { id: 'tanning', name: 'Tanning Studio', icon: Heart },
  { id: 'pet-grooming', name: 'Pet Grooming', icon: PawPrint },
];

// Sample services for different business types
const sampleServices: Record<string, Service[]> = {
  'hair-salon': [
    { name: 'Wash & Blow Dry', duration: '30-45 mins', price: 25 },
    { name: 'Cut & Style', duration: '45-60 mins', price: 35 },
    { name: 'Hair Coloring', duration: '1h 30m-2h', price: 65 },
  ],
  'spa': [
    { name: 'Relaxing Massage', duration: '60 mins', price: 80 },
    { name: 'Facial Treatment', duration: '45 mins', price: 55 },
    { name: 'Body Scrub', duration: '30 mins', price: 40 },
  ],
  'nails': [
    { name: 'Manicure', duration: '30 mins', price: 20 },
    { name: 'Pedicure', duration: '45 mins', price: 25 },
    { name: 'Gel Polish', duration: '20 mins', price: 15 },
  ],
  'barbershop': [
    { name: 'Classic Cut', duration: '30 mins', price: 18 },
    { name: 'Beard Trim', duration: '15 mins', price: 12 },
    { name: 'Hot Towel Shave', duration: '45 mins', price: 25 },
  ],
  'fitness-studio': [
    { name: 'Personal Training', duration: '60 mins', price: 60 },
    { name: 'Group Class', duration: '45 mins', price: 15 },
    { name: 'Consultation', duration: '30 mins', price: 30 },
  ],
};

export default function Onboarding(): React.ReactNode {
  const totalSteps: number = 8;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    website: '',
    businessType: '',
    accountType: '',
    teamSize: '',
    address: '',
    phone: '',
    description: '',
    services: [],
    features: [],
    hearAbout: '',
  });
  
  const updateFormData = (updates: Partial<FormData>): void => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = (): void => {
    if (currentStep < totalSteps - 1) {
      // Skip team size step if independent
      if (currentStep === 2 && formData.accountType === 'independent') {
        setCurrentStep(currentStep + 2);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      // Skip team size step if independent
      if (currentStep === 4 && formData.accountType === 'independent') {
        setCurrentStep(currentStep - 2);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  // Step 1: Business Name & Website
  if (currentStep === 0) {
    return (
      <StepWrapper
        showBack={false}
        canContinue={formData.businessName.trim().length > 0}
        currentStep={currentStep}
        nextStep={nextStep}
        prevStep={prevStep}
        totalSteps={totalSteps}
        >
        <div className="text-center">
          <p className="text-gray-500 mb-4">Account setup</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">What's your business name?</h1>
          <p className="text-gray-600 mb-12 max-w-lg mx-auto">
            This is the brand name your clients will see. Your billing and legal name can be added later.
          </p>
          
          <div className="space-y-6 text-left max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Business name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ businessName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3366] focus:border-transparent outline-none"
                placeholder="Enter your business name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Website <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ website: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3366] focus:border-transparent outline-none"
                placeholder="www.yoursite.com"
              />
            </div>
          </div>
        </div>
      </StepWrapper>
    );
  }

  // Step 2: Business Category Selection
  if (currentStep === 1) {
    return (
      <StepWrapper
      currentStep={currentStep}
        nextStep={nextStep}
        prevStep={prevStep}
        totalSteps={totalSteps}
      canContinue={!!formData.businessType}
      >
        <div>
          <p className="text-gray-500 mb-4">Account setup</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Select categories that best describe your business</h1>
          <p className="text-gray-600 mb-12">Choose your primary service type</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessCategories.map((category: BusinessCategory) => {
              const IconComponent = category.icon;
              const isSelected: boolean = formData.businessType === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => updateFormData({ businessType: category.id })}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected 
                      ? 'border-[#FF3366] bg-[#FF3366]/5' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <IconComponent className={`w-8 h-8 mb-3 ${isSelected ? 'text-[#FF3366]' : 'text-gray-600'}`} />
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                </button>
              );
            })}
          </div>
        </div>
      </StepWrapper>
    );
  }

  // Step 3: Account Type
  if (currentStep === 2) {
    return (
      <StepWrapper
        canContinue={!!formData.accountType}
        currentStep={currentStep}
        nextStep={nextStep}
        prevStep={prevStep}
        totalSteps={totalSteps}
        >
        <div>
          <p className="text-gray-500 mb-4">Account setup</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Select account type</h1>
          <p className="text-gray-600 mb-12">This will help us set up your account correctly</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={() => updateFormData({ accountType: 'independent' })}
              className={`p-8 rounded-xl border-2 transition-all duration-200 ${
                formData.accountType === 'independent'
                  ? 'border-[#FF3366] bg-[#FF3366]/5'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Users className="w-8 h-8 mb-4 mx-auto text-gray-600" />
              <h3 className="font-medium text-gray-900">I'm an independent</h3>
            </button>
            
            <button
              onClick={() => updateFormData({ accountType: 'team' })}
              className={`p-8 rounded-xl border-2 transition-all duration-200 ${
                formData.accountType === 'team'
                  ? 'border-[#FF3366] bg-[#FF3366]/5'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Users className="w-8 h-8 mb-4 mx-auto text-gray-600" />
              <h3 className="font-medium text-gray-900">I have a team</h3>
            </button>
          </div>
        </div>
      </StepWrapper>
    );
  }

  // Step 4: Team Size (only if they selected 'team')
  if (currentStep === 3) {
    return (
      <StepWrapper
        canContinue={!!formData.teamSize}
        currentStep={currentStep}
        nextStep={nextStep}
        prevStep={prevStep}
        totalSteps={totalSteps}
        >
        <div>
          <p className="text-gray-500 mb-4">Account setup</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-12">What's your team size</h1>
          
          <div className="space-y-4 max-w-md mx-auto">
            {['2-5 people', '6-10 people', '11+ people'].map((size: string) => (
              <button
                key={size}
                onClick={() => updateFormData({ teamSize: size })}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  formData.teamSize === size
                    ? 'border-[#FF3366] bg-[#FF3366]/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              We'll help you set up staff profiles and schedules to organize your team efficiently.
            </p>
          </div>
        </div>
      </StepWrapper>
    );
  }

  // Step 5: Business Location
  if (currentStep === 4) {
    return (
      <StepWrapper
      canContinue={!!formData.address && !!formData.phone}
      currentStep={currentStep}
        nextStep={nextStep}
        prevStep={prevStep}
        totalSteps={totalSteps}
      >
        <div>
          <p className="text-gray-500 mb-4">Account setup</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Set your venue's physical location</h1>
          <p className="text-gray-600 mb-8">Add your primary business location so your clients can easily find you.</p>
          
          <div className="space-y-6 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Business Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3366] focus:border-transparent outline-none"
                placeholder="Enter your business address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3366] focus:border-transparent outline-none"
                placeholder="+44 20 1234 5678"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Business Description</label>
              <textarea
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData({ description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3366] focus:border-transparent outline-none resize-none"
                placeholder="Tell clients about your business, atmosphere, and what makes you special..."
              />
            </div>
          </div>
        </div>
      </StepWrapper>
    );
  }

  // Step 6: Services Setup
  if (currentStep === 5) {
    const selectedCategoryServices: Service[] = sampleServices[formData.businessType] || [];
    
    return (
      <StepWrapper
        canContinue={formData.services.length > 0}
        currentStep={currentStep}
        nextStep={nextStep}
        prevStep={prevStep}
        totalSteps={totalSteps}
        >
        <div>
          <p className="text-gray-500 mb-4">Account setup</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Add your services</h1>
          <p className="text-gray-600 mb-8">Select the services you offer. You can customize these later.</p>
          
          <div className="space-y-4 max-w-2xl mx-auto">
            {selectedCategoryServices.map((service: Service, index: number) => {
              const isSelected: boolean = formData.services.some((s: Service) => s.name === service.name);
              
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (isSelected) {
                      updateFormData({
                        services: formData.services.filter((s: Service) => s.name !== service.name)
                      });
                    } else {
                      updateFormData({
                        services: [...formData.services, service]
                      });
                    }
                  }}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-[#FF3366] bg-[#FF3366]/5'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-sm text-gray-500">{service.duration}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">from £{service.price}</span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-[#FF3366] ml-4 inline-block" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 transition-colors">
              + Add custom service
            </button>
          </div>
        </div>
      </StepWrapper>
    );
  }

  // Step 7: Business Features
  if (currentStep === 6) {
    const features: string[] = [
      'Pet-friendly',
      'Eco-conscious',
      'Wheelchair accessible',
      'Free parking',
      'Free WiFi',
      'Card payments',
      'Gift vouchers',
      'Online booking',
    ];
    
    return (
      <StepWrapper
        currentStep={currentStep}
        nextStep={nextStep}
        prevStep={prevStep}
        totalSteps={totalSteps}
        canContinue={true}>
        <div>
          <p className="text-gray-500 mb-4">Account setup</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Business features</h1>
          <p className="text-gray-600 mb-8">Select any special features or amenities your business offers.</p>
          
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {features.map((feature: string) => {
              const isSelected: boolean = formData.features.includes(feature);
              
              return (
                <button
                  key={feature}
                  onClick={() => {
                    if (isSelected) {
                      updateFormData({
                        features: formData.features.filter((f: string) => f !== feature)
                      });
                    } else {
                      updateFormData({
                        features: [...formData.features, feature]
                      });
                    }
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-[#FF3366] bg-[#FF3366]/5'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900">{feature}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#FF3366] float-right" />}
                </button>
              );
            })}
          </div>
        </div>
      </StepWrapper>
    );
  }

  // Step 8: Success/Completion
  if (currentStep === 7) {
    return (
      <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your business is set up!</h1>
          <p className="text-gray-600 mb-8">
            Enjoy 14 days free of using Maistro Bookings. Start accepting bookings right away!
          </p>
          
          <button
            onClick={() => alert('Redirecting to dashboard...')}
            className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Go to Dashboard
          </button>
          
          <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Next steps:</h3>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Upload your business photos</li>
              <li>• Set your operating hours</li>
              <li>• Customize your booking page</li>
              <li>• Invite your team members</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
}