import React from "react";
import { Users } from "lucide-react";
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
 *  Account Type
 */
const Step3: React.FC<Step1Props> = ({
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
      canContinue={!!formData.accountType}
      currentStep={currentStep}
      nextStep={nextStep}
      prevStep={prevStep}
      totalSteps={totalSteps}
      resourceStrings={resourceStrings}
    >
      <div>
        <p className="text-gray-500 mb-4">
          {resourceStrings.common.accountSetup}
        </p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {resourceStrings.step3.title}
        </h1>
        <p className="text-gray-600 mb-12">
          {resourceStrings.step3.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button
            onClick={() => updateFormData({ accountType: "independent" })}
            className={`p-8 rounded-xl border-2 transition-all duration-200 ${
              formData.accountType === "independent"
                ? "border-[#FF3366] bg-[#FF3366]/5"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <Users className="w-8 h-8 mb-4 mx-auto text-gray-600" />
            <h3 className="font-medium text-gray-900">
              {resourceStrings.step3.options.independent}
            </h3>
          </button>

          <button
            onClick={() => updateFormData({ accountType: "team" })}
            className={`p-8 rounded-xl border-2 transition-all duration-200 ${
              formData.accountType === "team"
                ? "border-[#FF3366] bg-[#FF3366]/5"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <Users className="w-8 h-8 mb-4 mx-auto text-gray-600" />
            <h3 className="font-medium text-gray-900">
              {resourceStrings.step3.options.team}
            </h3>
          </button>
        </div>
      </div>
    </StepWrapper>
  );
};

export default Step3;
