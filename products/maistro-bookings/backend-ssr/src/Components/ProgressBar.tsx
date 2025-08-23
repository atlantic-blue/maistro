import React from 'react';
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = (props): React.ReactElement => (
  <div className="w-full bg-gray-200 h-1 mb-8">
    <div
      className="bg-[#FF3366] h-1 transition-all duration-300"
      style={{ width: `${((props.currentStep + 1) / props.totalSteps) * 100}%` }}
    />
  </div>
);

export default ProgressBar;
