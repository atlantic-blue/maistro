import React from "react";
import { Scissors, Sparkles, Dumbbell, Heart, Cake } from "lucide-react";

import StepWrapper from "./StepWrapper";
import { OnboardingFormData } from "./types";
import { I18nLanguageConfig } from "./i18.config";

interface BusinessCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const businessCategories: BusinessCategory[] = [
  { id: "fashion", name: "Hair Salon", icon: Scissors },
  { id: "wellness", name: "Spa", icon: Heart },
  { id: "gastronomy", name: "Barbershop", icon: Cake },
  { id: "sports", name: "Beauty Clinic", icon: Dumbbell },
  { id: "other", name: "Fitness Studio", icon: Sparkles },
];

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
 * Business Category Selection
 */
const Step2: React.FC<Step1Props> = ({
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
      canContinue={formData.businessType.length > 0}
      resourceStrings={resourceStrings}
    >
      <div>
        <p className="text-gray-500 mb-4">
          {resourceStrings.common.accountSetup}
        </p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {resourceStrings.step2.title}
        </h1>
        <p className="text-gray-600 mb-12">
          {resourceStrings.step2.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessCategories.map((category: BusinessCategory) => {
            const IconComponent = category.icon;
            const isSelected: boolean = formData.businessType.includes(
              category.id,
            );
            const updatedBusinessType = isSelected
              ? formData.businessType.filter((id) => id !== category.id)
              : [...formData.businessType, category.id];

            return (
              <button
                key={category.id}
                onClick={() =>
                  updateFormData({ businessType: updatedBusinessType })
                }
                className={`p-6 rounded-xl border transition-all duration-200 text-left ${
                  isSelected
                    ? "border-[#FF3366] bg-[#FF3366]/5"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <IconComponent
                  className={`w-8 h-8 mb-3 ${isSelected ? "text-[#FF3366]" : "text-gray-600"}`}
                />
                <h3 className="font-medium text-gray-900">
                  {resourceStrings.step2.categories[category.id]}
                </h3>
              </button>
            );
          })}
        </div>
      </div>
    </StepWrapper>
  );
};

export default Step2;
