import { BusinessMe } from '@/Api/Business';
import { AuthContext } from '@maistro/auth';
import { useContext, useEffect, useState } from 'react';
import { EmptyState } from './EmptyState';
import { baseDictionary } from './i18n';
import { BusinessProfile, Locale } from './types';
import { Loader, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { BusinessCard } from './Card';
import { Card, Flex, Text } from '@maistro/ui';

export const BusinessesPage = ({ language }: { language: Locale }) => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || isLoading || !user) {
      return;
    }
    setIsLoadingData(true);

    BusinessMe(user.getTokenAccess()).then((biz) => {
      setBusinesses(biz);
      setIsLoadingData(false);
    });
  }, [isAuthenticated, isLoading, user]);

  if (isLoadingData) {
    return (
      <Card className="mb-3">
        <Flex align="center" justify="center" className="p-10" direction="column" gap="3">
          <Loader />
          <Text color="gray">{'Cargando...'}</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            {baseDictionary[language].titleYour}
          </h1>
          <p className="mt-1 text-sm text-neutral-600">{baseDictionary[language].subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={'https://customer.maistroapp.com/businesses/onboarding'}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> {baseDictionary[language].newBusiness}
          </Link>
        </div>
      </div>

      {businesses.length === 0 ? (
        <EmptyState language="es" />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((b) => (
            <BusinessCard key={b.BusinessId} biz={b} language={language} />
          ))}
        </div>
      )}
    </div>
  );
};
