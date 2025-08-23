import React, { useEffect, useState } from 'react';
import { OnboardingFormData } from './types';
import i18nConfig from './i18.config';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';
import Step8 from './Step8';
import { AuthContext } from '@maistro/auth';
import env from '../../env';
import onboardUser from '../../Api/Onboarding';

interface OnboardingProps {
  language: 'en' | 'es' | 'fr';
}

const Onboarding: React.FC<OnboardingProps> = (props): React.ReactNode => {
  const { isAuthenticated, isLoading, user } = React.useContext(AuthContext);

  const [language] = useState<OnboardingProps['language']>(props.language);
  const resourceStrings = i18nConfig[language];
  const totalSteps: number = 8;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<OnboardingFormData>({
    businessName: '',
    website: '',
    businessType: [],
    accountType: '',
    teamSize: '',
    address: '',
    phone: '',
    description: '',
    services: [],
    features: [],
    hearAbout: '',
  });

  const processOnboardUser = async () => {
    const token = user?.getTokenAccess();
    if (!token) {
      return;
    }

    try {
      await onboardUser(env.api.onboarding, token, formData);
      setIsSubmitted(true);
    } catch (error) {
      // TODO
      console.log({ error });
    }
  };

  useEffect(() => {
    if (isLoading || !isAuthenticated || currentStep !== 7) {
      return;
    }

    processOnboardUser();
  }, [currentStep]);

  const updateFormData = (updates: Partial<OnboardingFormData>): void => {
    setFormData((prev) => ({ ...prev, ...updates }));
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

  switch (currentStep) {
    case 0:
      return (
        <Step1
          currentStep={currentStep}
          formData={formData}
          nextStep={nextStep}
          prevStep={prevStep}
          totalSteps={totalSteps}
          updateFormData={updateFormData}
          resourceStrings={resourceStrings}
        />
      );
    case 1:
      return (
        <Step2
          currentStep={currentStep}
          formData={formData}
          nextStep={nextStep}
          prevStep={prevStep}
          totalSteps={totalSteps}
          updateFormData={updateFormData}
          resourceStrings={resourceStrings}
        />
      );
    case 2:
      return (
        <Step3
          currentStep={currentStep}
          formData={formData}
          nextStep={nextStep}
          prevStep={prevStep}
          totalSteps={totalSteps}
          updateFormData={updateFormData}
          resourceStrings={resourceStrings}
        />
      );
    case 3:
      return (
        <Step4
          currentStep={currentStep}
          formData={formData}
          nextStep={nextStep}
          prevStep={prevStep}
          totalSteps={totalSteps}
          updateFormData={updateFormData}
          resourceStrings={resourceStrings}
        />
      );
    case 4:
      return (
        <Step5
          currentStep={currentStep}
          formData={formData}
          nextStep={nextStep}
          prevStep={prevStep}
          totalSteps={totalSteps}
          updateFormData={updateFormData}
          resourceStrings={resourceStrings}
        />
      );
    case 5:
      return (
        <Step6
          currentStep={currentStep}
          formData={formData}
          nextStep={nextStep}
          prevStep={prevStep}
          totalSteps={totalSteps}
          updateFormData={updateFormData}
          resourceStrings={resourceStrings}
        />
      );
    case 6:
      return (
        <Step7
          currentStep={currentStep}
          formData={formData}
          nextStep={nextStep}
          prevStep={prevStep}
          totalSteps={totalSteps}
          updateFormData={updateFormData}
          resourceStrings={resourceStrings}
        />
      );
    case 7:
      return <Step8 resourceStrings={resourceStrings} isSubmitted={isSubmitted} />;

    default:
      return null;
  }
};

export default Onboarding;
