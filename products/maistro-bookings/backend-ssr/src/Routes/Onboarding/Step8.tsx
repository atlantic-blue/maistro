import React from 'react';
import { Star } from 'lucide-react';
import { I18nLanguageConfig } from './i18.config';
import { Link } from 'react-router';

interface Step1Props {
  resourceStrings: I18nLanguageConfig;
  isSubmitted: boolean;
}

/**
 *  Success/Completion
 */
const Step8: React.FC<Step1Props> = ({ resourceStrings, isSubmitted }) => {
  return (
    <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-24 h-24 bg-gradient-to-r from-[#FF3366] to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <Star className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{resourceStrings.step8.title}</h1>
        <p className="text-gray-600 mb-8">{resourceStrings.step8.description}</p>

        {isSubmitted ? (
          <button className="bg-[#FF3366] text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors rounded-xl">
            <Link to={'https://customer.maistroapp.com/businesses'}>
              {resourceStrings.step8.ctaButton}
            </Link>
          </button>
        ) : (
          <div>Creando Perfil...</div>
        )}

        <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">
            {resourceStrings.step8.nextSteps.title}
          </h3>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            {resourceStrings.step8.nextSteps.items.map((item) => {
              return <li key={item}>• {item}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Step8;
