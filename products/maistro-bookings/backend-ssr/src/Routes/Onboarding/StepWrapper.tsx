import React from "react";
import ProgressBar from "../../Components/ProgressBar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { I18nLanguageConfig } from "./i18.config";

interface StepWrapperProps {
  children: React.ReactNode;
  showBack?: boolean;
  showContinue?: boolean;
  canContinue?: boolean;
  currentStep: number;
  totalSteps: number;
  prevStep: () => void;
  nextStep: () => void;
  resourceStrings: I18nLanguageConfig;
}

const StepWrapper: React.FC<StepWrapperProps> = ({
  children,
  showBack = true,
  showContinue = true,
  canContinue = true,
  totalSteps,
  currentStep,
  prevStep,
  nextStep,
  resourceStrings,
}) => (
  <div className="min-h-screen bg-[#FFF8F6] flex flex-col">
    <div className="p-6">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          {showBack && (
            <button
              onClick={prevStep}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {!showBack && <div />}

          <div className="flex gap-4">
            <button className="px-4 py-2 text-gray-600 hover:bg-white rounded-lg transition-colors rounded-xl">
              {resourceStrings.common.close}
            </button>
            {showContinue && (
              <button
                onClick={nextStep}
                disabled={!canContinue}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors rounded-xl ${
                  canContinue
                    ? "bg-[#FF3366] text-white hover:bg-[#F66085]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentStep === totalSteps - 1
                  ? resourceStrings.common.done
                  : resourceStrings.common.continue}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  </div>
);

export default StepWrapper;
