import React from "react";
import { Check, X } from "lucide-react";
import StepWrapper from "./StepWrapper";
import { OnboardingFormData, Service } from "./types";
import { I18nLanguageConfig } from "./i18.config";
import { useState } from "react";

// Sample services for different business types
const sampleServices: Record<string, Service[]> = {
  "hair-salon": [
    { name: "Wash & Blow Dry", duration: "30-45 mins", price: 25000 },
    { name: "Cut & Style", duration: "45-60 mins", price: 35000 },
    { name: "Hair Coloring", duration: "1h 30m-2h", price: 65000 },
  ],
  spa: [
    { name: "Relaxing Massage", duration: "60 mins", price: 80000 },
    { name: "Facial Treatment", duration: "45 mins", price: 55000 },
    { name: "Body Scrub", duration: "30 mins", price: 40000 },
  ],
  nails: [
    { name: "Manicure", duration: "30 mins", price: 20000 },
    { name: "Pedicure", duration: "45 mins", price: 25000 },
    { name: "Gel Polish", duration: "20 mins", price: 15000 },
  ],
  barbershop: [
    { name: "Classic Cut", duration: "30 mins", price: 18000 },
    { name: "Beard Trim", duration: "15 mins", price: 12000 },
    { name: "Hot Towel Shave", duration: "45 mins", price: 25000 },
  ],
  "fitness-studio": [
    { name: "Personal Training", duration: "60 mins", price: 60000 },
    { name: "Group Class", duration: "45 mins", price: 15000 },
    { name: "Consultation", duration: "30 mins", price: 30000 },
  ],
};

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
 *  Services Setup
 */
const Step6: React.FC<Step1Props> = ({
  formData,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  updateFormData,
  resourceStrings,
}) => {
  const [customServices, setCustomServices] = useState<Service[]>([]);
  const selectedCategoryServices: Service[] =
    sampleServices[formData.businessType[0]] || [];

  const handleAddCustomField = () => {
    setCustomServices([
      ...customServices,
      { name: "", duration: "", price: 0 },
    ]);
  };
  const handleUpdateCustom = (
    index: number,
    field: keyof Service,
    value: string | number,
  ) => {
    const updated = [...customServices];
    updated[index] = { ...updated[index], [field]: value };
    setCustomServices(updated);
  };

  const handleRemoveCustom = (index: number) => {
    setCustomServices(customServices.filter((_, i) => i !== index));
  };

  const handleSubmitCustomServices = () => {
    const valid = customServices.filter(
      (s) => s.name && s.duration && s.price > 0,
    );
    if (valid.length > 0) {
      updateFormData({
        services: [...formData.services, ...valid],
      });
      setCustomServices([]);
    }
  };

  return (
    <StepWrapper
      canContinue={formData.services.length > 0}
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
          {resourceStrings.step6.title}
        </h1>
        <p className="text-gray-600 mb-8">
          {resourceStrings.step6.description}
        </p>

        <div className="space-y-4 max-w-2xl mx-auto">
          {[
            ...new Set([...selectedCategoryServices, ...formData.services]),
          ].map((service: Service, index: number) => {
            const isSelected: boolean = formData.services.some(
              (s: Service) => s.name === service.name,
            );

            return (
              <div
                key={index}
                onClick={() => {
                  if (isSelected) {
                    updateFormData({
                      services: formData.services.filter(
                        (s: Service) => s.name !== service.name,
                      ),
                    });
                  } else {
                    updateFormData({
                      services: [...formData.services, service],
                    });
                  }
                }}
                className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-[#FF3366] bg-[#FF3366]/5"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500">{service.duration}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">
                      from {resourceStrings.step6.currency} {service.price}
                    </span>
                    {isSelected && (
                      <Check className="w-5 h-5 text-[#FF3366] ml-4 inline-block" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {customServices.length > 0 && (
            <div className="space-y-4">
              {customServices.map((service, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-xl bg-gray-50 relative"
                >
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveCustom(index)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <input
                    className="w-full mb-2 p-3 border rounded-xl"
                    placeholder="Service name"
                    value={service.name}
                    onChange={(e) =>
                      handleUpdateCustom(index, "name", e.target.value)
                    }
                  />
                  <input
                    className="w-full mb-2 p-3 border rounded-xl"
                    placeholder="Duration (e.g. 45 mins)"
                    value={service.duration}
                    onChange={(e) =>
                      handleUpdateCustom(index, "duration", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    className="w-full mb-2 p-3 border rounded-xl"
                    placeholder="Price"
                    value={service.price || ""}
                    onChange={(e) =>
                      handleUpdateCustom(
                        index,
                        "price",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                  />
                </div>
              ))}
              <button
                onClick={handleSubmitCustomServices}
                className="w-full p-3 bg-[#FF3366] text-white rounded-xl hover:bg-[#e02b5c] mt-2"
              >
                {resourceStrings.step6.saveCustomService ||
                  "Add All Custom Services"}
              </button>
            </div>
          )}

          <button
            onClick={handleAddCustomField}
            className="w-full p-4 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 transition-colors"
          >
            {resourceStrings.step6.addCustomService || "Add Custom Service"}
          </button>
        </div>
      </div>
    </StepWrapper>
  );
};

export default Step6;
