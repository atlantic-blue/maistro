import env from '@/env';
import { Plus, Store } from 'lucide-react';
import { Locale } from './types';
import { baseDictionary } from './i18n';
import { Button } from '@maistro/ui';
import { Link } from 'react-router';

export function EmptyState({ language: locale }: { language: Locale }) {
  const d = baseDictionary[locale];
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-neutral-100">
          <Store className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900">{d.emptyTitle}</h3>
        <p className="mt-1 text-sm text-neutral-600">{d.emptyBody}</p>
        <Link to={'https://customer.maistroapp.com/businesses/onboarding'}>
          <Button className="mt-4 inline-flex items-center gap-2 rounded-xlpx-3 py-2 text-sm font-semibold bg-[#FF3366] text-white hover:bg-[#F66085]">
            <Plus className="h-4 w-4" /> {d.emptyCta}
          </Button>
        </Link>
      </div>
    </div>
  );
}
