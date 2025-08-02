import React from 'react';
import { I18nLanguageConfig } from './i18.config';
import StepWrapper from './StepWrapper';
import { OnboardingFormData } from './types';

interface Step1Props {
  formData: OnboardingFormData;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (_: Partial<OnboardingFormData>) => void;
  resourceStrings: I18nLanguageConfig;
}

/**
 * Business Name & Website
 */
const Step1: React.FC<Step1Props> = ({
  formData,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  updateFormData,
  resourceStrings,
}) => {
  return (
    <StepWrapper
      showBack={false}
      canContinue={formData.businessName.trim().length > 0}
      currentStep={currentStep}
      nextStep={nextStep}
      prevStep={prevStep}
      totalSteps={totalSteps}
      resourceStrings={resourceStrings}
    >
      <div className="text-center">
        <p className="text-gray-500 mb-4">{resourceStrings.common.accountSetup}</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{resourceStrings.step1.title}</h1>
        <p className="text-gray-600 mb-12 max-w-lg mx-auto">{resourceStrings.step1.description}</p>

        <div className="space-y-6 text-left max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {resourceStrings.step1.fields.businessName.label}
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData({ businessName: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3366] focus:border-transparent outline-none rounded-xl"
              placeholder={resourceStrings.step1.fields.businessName.placeholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {resourceStrings.step1.fields.website.label}{' '}
              <span className="text-gray-500">{resourceStrings.common.optional}</span>
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData({ website: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3366] focus:border-transparent outline-none rounded-xl"
              placeholder={resourceStrings.step1.fields.website.placeholder}
            />
          </div>
        </div>
      </div>
    </StepWrapper>
  );
};

export default Step1;
