import React from "react";
import { Check } from "lucide-react";
import StepWrapper from "./StepWrapper";
import { OnboardingFormData } from "./types";
import { I18nLanguageConfig } from "./i18.config";

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
 *  Business Features
 */
const Step7: React.FC<Step1Props> = ({
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
      currentStep={currentStep}
      nextStep={nextStep}
      prevStep={prevStep}
      totalSteps={totalSteps}
      canContinue={true}
      resourceStrings={resourceStrings}
    >
      <div>
        <p className="text-gray-500 mb-4">
          {resourceStrings.common.accountSetup}
        </p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {resourceStrings.step7.title}
        </h1>
        <p className="text-gray-600 mb-8">
          {resourceStrings.step7.description}
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {resourceStrings.step7.features.map((feature: string) => {
            const isSelected: boolean = formData.features.includes(feature);

            return (
              <button
                key={feature}
                onClick={() => {
                  if (isSelected) {
                    updateFormData({
                      features: formData.features.filter(
                        (f: string) => f !== feature,
                      ),
                    });
                  } else {
                    updateFormData({
                      features: [...formData.features, feature],
                    });
                  }
                }}
                className={`flex items-center justify-around p-4 rounded-xl border transition-all duration-200 text-left ${
                  isSelected
                    ? "border-[#FF3366] bg-[#FF3366]/5"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <span className="text-sm font-medium text-gray-900">
                  {feature}
                </span>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#FF3366] float-right" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </StepWrapper>
  );
};

export default Step7;
