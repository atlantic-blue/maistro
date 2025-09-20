import {
  Card,
  Flex,
  Tabs,
  Text,
  Separator,
  Select,
  MaistroImageUploader,
  Avatar,
} from '@maistro/ui';
import { BusinessProfile, Locale } from '../Businesses/types';
import { businessPageDictionary, toolDescription } from './i18n';
import {
  Calendar,
  ExternalLink,
  Globe,
  Loader,
  Mail,
  MapPin,
  MessageSquare,
  PawPrint,
  PhoneIcon,
  Star,
  Store,
  ImageIcon,
  Settings,
} from 'lucide-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '@maistro/auth';
import { getBusinessProfileById, postBusinessUpdate } from '@/Api/Business';
import { useParams } from 'react-router';
import { cx } from 'class-variance-authority';
import GoogleMap from '@/Components/GoogleMap';
import env from '@/env';
import { getImages } from '@/Api/Images';
import { MaistroImage } from '@/types';
import ImageSelectorGrid from './ImageSelectorGrid';

const profileIcons: Record<string, React.ReactNode> = {
  reviews: <Star className="h-5 w-5" />,
  chats: <MessageSquare className="h-5 w-5" />,
  emails: <Mail className="h-5 w-5" />,
  bookings: <Calendar className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />,
  images: <ImageIcon className="h-5 w-5" />,
};

function LabeledTextarea({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1 block text-xs font-medium text-neutral-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-fuchsia-500"
      />
    </label>
  );
}

const listToStr = (arr?: string[]) => (arr && arr.length ? arr.join(', ') : '');
const strToList = (s: string) =>
  s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

function LabeledInput({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1 block text-xs font-medium text-neutral-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-fuchsia-500"
      />
    </label>
  );
}

type ImageUrls = {
  Optimised: string;
  Low: string;
  Medium: string;
  High: string;
  Original: string;
};

export function BusinessProfilePage({ language }: { language: Locale }) {
  const { businessId } = useParams();
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [isSavingData, setIsSavingData] = useState(false);
  const [images, setImages] = useState<MaistroImage[]>([]);
  const [isImagesLoading, setImagesLoading] = useState(false);

  const setNestedField = (key: string, nested: string, value: string | string[]) => {
    setBusiness((biz) => {
      if (!biz) {
        return biz;
      }

      return {
        ...biz,
        [key]: {
          // @ts-ignore
          ...biz[key],
          [nested]: value,
        },
      };
    });
  };

  const setField = <K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) =>
    setBusiness((biz) => {
      if (!biz) {
        return biz;
      }

      return { ...biz, [key]: value };
    });

  useEffect(() => {
    if (!isAuthenticated || isLoading || !user || !businessId) {
      return;
    }

    getBusinessProfileById(businessId).then((biz) => {
      setBusiness(biz);
    });
  }, [isAuthenticated, isLoading, user, businessId]);

  const refresh = () => {
    if (!business || !user) return;
    setImagesLoading(true);
    getImages({
      Limit: 10,
      OwnerId: business.BusinessId,
      token: user.getTokenAccess(),
      url: env.api.images.getImages,
    })
      .then((res) => setImages(res.images))
      .finally(() => setImagesLoading(false));
  };

  const ownerId = business?.BusinessId ?? null;
  useEffect(() => {
    if (!ownerId || !user) return;

    let cancelled = false;
    setImagesLoading(true);
    getImages({
      Limit: 10,
      OwnerId: ownerId,
      token: user.getTokenAccess(),
      url: env.api.images.getImages,
    })
      .then((res) => {
        if (!cancelled) setImages(res.images);
      })
      .finally(() => {
        if (!cancelled) setImagesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  const handleSave = async () => {
    if (!business || !user) {
      return;
    }

    try {
      setIsSavingData(true);
      await postBusinessUpdate(user.getTokenAccess(), business.BusinessId, {
        accountType: business.AccountType,
        address: business.Address,
        businessName: business.BusinessName,
        businessType: business.BusinessType,
        description: business.Description,
        features: business.Features,
        hearAbout: business.HearAbout,
        phone: business.Phone,
        services: business.Services,
        teamSize: business.TeamSize,
        website: business.Website,
        addressDetails: {
          city: business?.AddressDetails?.City,
          country: business?.AddressDetails?.Country,
          firstLine: business?.AddressDetails?.FirstLine,
          postcode: business?.AddressDetails?.Postcode,
        },
        email: business.Email,
        images: {
          main: business?.Images?.Main,
          gallery: business?.Images?.Gallery,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSavingData(false);
    }
  };

  if (!business || isLoading || !user) {
    return (
      <Card className="mb-3">
        <Flex align="center" justify="center" className="p-10" direction="column" gap="3">
          <Loader />
          <Text>Cargando...</Text>
        </Flex>
      </Card>
    );
  }

  const publicUrl = `https://maistroapp.com/b/${business.Slug}`;
  const tools: { key: string; href: string; isLive: boolean }[] = [
    {
      key: 'website',
      href: `https://website.maistroapp.com/b/${business.BusinessId}`,
      isLive: false,
    },
    {
      key: 'images',
      href: `https://website.maistroapp.com/b/${business.BusinessId}`,
      isLive: false,
    },
    {
      key: 'reviews',
      href: `https://reviews.maistroapp.com/b/${business.BusinessId}`,
      isLive: false,
    },
    {
      key: 'bookings',
      href: `https://bookings.maistroapp.com/b/${business.BusinessId}`,
      isLive: false,
    },
    { key: 'chats', href: `https://chats.maistroapp.com/b/${business.BusinessId}`, isLive: false },
    {
      key: 'emails',
      href: `https://emails.maistroapp.com/b/${business.BusinessId}`,
      isLive: false,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
          <h3 className="mb-3 text-base font-semibold text-neutral-900">{business.BusinessName}</h3>
          {business.Description ? (
            <p className="text-sm text-neutral-700" style={{ whiteSpace: 'break-spaces' }}>
              {business.Description}
            </p>
          ) : (
            <p className="text-sm text-neutral-500 italic">—</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-700">
            {business.Address && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {business?.AddressDetails?.FirstLine}
              </span>
            )}
            {business.Phone && (
              <span className="inline-flex items-center gap-1">
                <PhoneIcon className="h-4 w-4" /> {business.Phone}
              </span>
            )}
            {business.Features?.slice(0, 4).map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <PawPrint className="h-4 w-4" /> {f}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h4 className="mb-2 text-sm font-semibold text-neutral-900">Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-neutral-800 hover:underline"
            >
              <Store className="h-4 w-4" /> {businessPageDictionary[language].publicProfile}
            </a>
            {business.Website && (
              <a
                href={business.Website}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-neutral-800 hover:underline"
              >
                <Globe className="h-4 w-4" /> {business.Website}
              </a>
            )}
          </div>
        </div>
      </div>

      <Tabs.Root defaultValue="products">
        <div className="mb-4 flex gap-2 rounded-xl border border-neutral-200 bg-white p-1">
          <Tabs.List className="flex w-full gap-1">
            <Tabs.Trigger
              value="products"
              className="flex-1 rounded-lg px-3 py-2 text-sm data-[state=active]:bg-neutral-100"
            >
              {businessPageDictionary[language].products}
            </Tabs.Trigger>
            <Tabs.Trigger
              value="info"
              className="flex-1 rounded-lg px-3 py-2 text-sm data-[state=active]:bg-neutral-100"
            >
              {businessPageDictionary[language].info}
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        {/* Overview */}
        <Tabs.Content value="products">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(({ key, href }) => {
              const toolInfo = (toolDescription[language] as any)[key];
              return (
                <div
                  key={key}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-rose-500 to-orange-400" />
                  <div className="mt-3 flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-neutral-100">
                      {profileIcons[key]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">
                        {businessPageDictionary[language].toolLabels[key]}
                      </div>
                      <p className="mt-1 text-sm text-neutral-600">{toolInfo}</p>
                      <div className="mt-3">
                        <a
                          href={href}
                          target="_blank"
                          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                        >
                          {businessPageDictionary[language].open}
                          <ExternalLink className="h-4 w-4 opacity-70" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Tabs.Content>

        <Tabs.Content value="info">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <LabeledInput
                label={businessPageDictionary[language].fields.BusinessName}
                value={business.BusinessName}
                onChange={(v) => setField('BusinessName', v)}
              />
              <LabeledInput
                label={businessPageDictionary[language].fields.Website}
                value={business.Website || ''}
                onChange={(v) => setField('Website', v)}
              />
              <LabeledInput
                label={businessPageDictionary[language].fields.Phone}
                value={business.Phone || ''}
                onChange={(v) => setField('Phone', v)}
              />

              <LabeledTextarea
                className="md:col-span-2"
                label={businessPageDictionary[language].fields.Description}
                value={business.Description || ''}
                onChange={(v) => setField('Description', v)}
              />

              <LabeledInput
                label={businessPageDictionary[language].fields.Features}
                value={listToStr(business.Features as string[])}
                onChange={(v) => setField('Features', strToList(v))}
              />
              <LabeledInput
                label={businessPageDictionary[language].fields.BusinessType}
                value={listToStr(business.BusinessType as string[])}
                onChange={(v) => setField('BusinessType', strToList(v))}
              />

              <label className={cx('block')}>
                <span className="mb-1 block text-xs font-medium text-neutral-700">
                  Tipo de cuenta
                </span>
                <Select.Root
                  defaultValue={business.AccountType}
                  onValueChange={(value) => {
                    setField('AccountType', value);
                  }}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Group>
                      <Select.Item value="team">Equipo</Select.Item>
                      <Select.Item value="independent">Independiente</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </label>

              {business.AccountType === 'team' ? (
                <LabeledInput
                  label={businessPageDictionary[language].fields.TeamSize}
                  value={String(business.TeamSize || '')}
                  onChange={(v) => setField('TeamSize', v)}
                />
              ) : null}
            </div>

            <Separator my="3" size="4" />

            <Flex direction="column" gap="1">
              <LabeledInput
                label={businessPageDictionary[language].fields.AddressFirstLine}
                value={business?.AddressDetails?.FirstLine || ''}
                onChange={(v) => setNestedField('AddressDetails', 'FirstLine', v)}
              />

              <LabeledInput
                label={businessPageDictionary[language].fields.AddressCity}
                value={business?.AddressDetails?.City || ''}
                onChange={(v) => setNestedField('AddressDetails', 'City', v)}
              />

              <LabeledInput
                label={businessPageDictionary[language].fields.AddressCountry}
                value={business?.AddressDetails?.Country || ''}
                onChange={(v) => setNestedField('AddressDetails', 'Country', v)}
              />

              <LabeledInput
                label={businessPageDictionary[language].fields.AddressPostcode}
                value={business?.AddressDetails?.Postcode || ''}
                onChange={(v) => setNestedField('AddressDetails', 'Postcode', v)}
              />

              <GoogleMap
                address={{
                  city: business?.AddressDetails?.City,
                  country: business?.AddressDetails?.Country,
                  firstLine: business?.AddressDetails?.FirstLine,
                  postcode: business?.AddressDetails?.Postcode,
                }}
                zoom="15"
              />
            </Flex>

            <ImageSelectorGrid
              images={images}
              selectedUrls={[
                business?.Images?.Main,
                ...(Array.isArray(business?.Images?.Gallery) ? business?.Images?.Gallery : []),
              ].filter(Boolean)}
              onRefresh={refresh}
              onChange={(selected) => {
                const mainImage = selected[0];
                const gallery = selected.slice(1);

                console.log(mainImage, gallery);

                setBusiness((biz) => {
                  if (!biz) {
                    return biz;
                  }

                  return {
                    ...biz,
                    Images: {
                      Main: mainImage,
                      Gallery: gallery,
                    },
                  };
                });
              }}
            />

            <MaistroImageUploader
              urls={{
                getPresignedUrl: env.api.images.getPresignedUrl,
                resize: env.api.images.resizeImages,
              }}
              token={user.getTokenAccess()}
              ownerId={business.BusinessId}
              ownerType="business"
              maxFileMB={5}
            />

            <div className="mt-5">
              {isSavingData ? (
                <Loader />
              ) : (
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-900"
                >
                  <Settings className="h-4 w-4" /> {businessPageDictionary[language].saveChanges}
                </button>
              )}
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
