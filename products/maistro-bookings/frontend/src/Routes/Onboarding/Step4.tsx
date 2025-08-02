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
 *  Team Size (only if they selected 'team')
 */
const Step4: React.FC<Step1Props> = ({
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
      canContinue={!!formData.teamSize}
      currentStep={currentStep}
      nextStep={nextStep}
      prevStep={prevStep}
      totalSteps={totalSteps}
      resourceStrings={resourceStrings}
    >
      <div>
        <p className="text-gray-500 mb-4">{resourceStrings.common.accountSetup}</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-12">{resourceStrings.step4.title}</h1>

        <div className="space-y-4 max-w-md mx-auto">
          {resourceStrings.step4.teamSizes.map((size: string) => (
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
            {resourceStrings.step4.helpText}
          </p>
        </div>
      </div>
    </StepWrapper>
  );
};

export default Step4;
