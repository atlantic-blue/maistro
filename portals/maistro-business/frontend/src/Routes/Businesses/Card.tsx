import { ExternalLink, Globe, MapPin, PawPrint, PhoneIcon, Settings, Store } from 'lucide-react';
import { BusinessProfile, Locale } from './types';
import { baseDictionary } from './i18n';
import { appRoutes } from '../appRoutes';
import { Link } from 'react-router';

const formatDate = (iso?: string, locale: Locale = 'es') => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(d);
};

export function BusinessCard({
  biz: b,
  language: language,
}: {
  biz: BusinessProfile;
  language: Locale;
}) {
  const maistroBusinessDashboard = appRoutes.getBusiness(b.BusinessId);
  const publicUrl = `https://maistroapp.com/b/${b.Slug}`;
  const hasWebsite = Boolean(b.Website);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Barra acento superior */}
      <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-rose-500 to-orange-400" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-neutral-100">
              <Store className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-neutral-900">{b.BusinessName}</h3>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-neutral-500">
              {baseDictionary[language].updated(formatDate(b.UpdatedAt ?? b.CreatedAt, language))}
            </div>
          </div>
        </div>

        {b.Description && (
          <p className="mt-3 line-clamp-2 text-sm text-neutral-700">{b.Description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
          {b.Address && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {b.Address}
            </span>
          )}
          {b.Phone && (
            <span className="inline-flex items-center gap-1">
              <PhoneIcon className="h-4 w-4" /> {b.Phone}
            </span>
          )}
          {b.Features?.slice(0, 3).map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              <PawPrint className="h-4 w-4" /> {f}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {hasWebsite && (
            <a
              href={b.Website}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
            >
              <Globe className="h-4 w-4" /> {baseDictionary[language].visitWebsite}
              <ExternalLink className="h-4 w-4 opacity-70" />
            </a>
          )}

          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
          >
            <Store className="h-4 w-4" /> {baseDictionary[language].publicProfile}
            <ExternalLink className="h-4 w-4 opacity-70" />
          </a>

          <Link
            to={maistroBusinessDashboard}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-900"
          >
            <Settings className="h-4 w-4" /> {baseDictionary[language].editSettings}
          </Link>
        </div>
      </div>
    </div>
  );
}
