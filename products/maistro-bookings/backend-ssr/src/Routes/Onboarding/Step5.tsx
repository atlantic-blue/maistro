import React from 'react';
import StepWrapper from './StepWrapper';
import { OnboardingFormData } from './types';
import { I18nLanguageConfig } from './i18.config';

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
 *  Business Location
 */
const Step5: React.FC<Step1Props> = ({
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
      canContinue={!!formData.address && !!formData.phone}
      currentStep={currentStep}
      nextStep={nextStep}
      prevStep={prevStep}
      totalSteps={totalSteps}
      resourceStrings={resourceStrings}
    >
      <div>
        <p className="text-gray-500 mb-4">{resourceStrings.common.accountSetup}</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{resourceStrings.step5.title}</h1>
        <p className="text-gray-600 mb-8">{resourceStrings.step5.description}</p>

        <div className="space-y-6 max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {resourceStrings.step5.fields.address.label}
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData({ address: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3366] focus:border-transparent outline-none"
              placeholder={resourceStrings.step5.fields.address.placeholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {resourceStrings.step5.fields.phone.label}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData({ phone: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3366] focus:border-transparent outline-none"
              placeholder={resourceStrings.step5.fields.phone.placeholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {resourceStrings.step5.fields.description.label}
            </label>
            <textarea
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateFormData({ description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3366] focus:border-transparent outline-none resize-none"
              placeholder={resourceStrings.step5.fields.description.placeholder}
            />
          </div>
        </div>
      </div>
    </StepWrapper>
  );
};

export default Step5;
