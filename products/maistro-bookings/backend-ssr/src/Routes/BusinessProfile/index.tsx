import React from "react";
import { Button, Card, Separator } from "@maistro/ui";
import {
  MapPin,
  Clock,
  Star,
  Share2,
  Heart,
  ChevronRight,
  Globe,
} from "lucide-react";

import Header from "../../Components/Header";
import { useRouteData } from "../../State/DataRoute.context";
import { RouteName } from "../appRoutes";
import {
  BusinessProfile,
  BusinessProfileExtended,
  MaistroImage,
} from "../../types/BusinessProfile";
import Stars from "./Components/Stars";
import BusinsessProfileServices from "./Components/Services";
import BusinessProfileAbout from "./Components/About";
import BusinessProfileReviews from "./Components/Reviews";
import BusinessProfileNearby from "./Components/Nearby";
import { BusinessGalleryHero } from "./Components/ImageGallery";

type MaybeMaistroImage = string | null | undefined | MaistroImage;

const isMaistroImage = (v: MaybeMaistroImage): v is MaistroImage => {
  return typeof v === "object" && v !== null && "Urls" in v;
};

const normalizeMaistroImages = (
  v: MaybeMaistroImage[],
): (MaistroImage | null)[] => {
  return v.map(normalizeMaistroImage);
};

const normalizeMaistroImage = (v: MaybeMaistroImage): MaistroImage | null => {
  if (!v) return null;
  if (isMaistroImage(v)) return v;
  // Assume legacy string — return as all variants
  return {
    Urls: {
      Original: v,
      Low: v,
      Medium: v,
      High: v,
      Optimized: v,
    },
    ContentType: "",
    CreatedAt: "",
    ImageId: "",
    OwnerId: "",
    OwnerType: "business",
    ProcessedAt: "",
    SizesInBytes: {
      High: 0,
      Low: 0,
      Medium: 0,
      Optimised: 0,
      TotalBytes: 0,
    },
    Status: "READY",
  };
};

const BusinessProfilePage: React.FC = () => {
  const businessData = useRouteData<BusinessProfile>(
    RouteName.BUSINESS_PROFILE,
  );

  if (!businessData) {
    return null;
  }

  const business: BusinessProfileExtended = {
    ...businessData,
    BusinessId: businessData.BusinessId,
    BusinessName: businessData.BusinessName ?? "Negocio sin nombre",
    Address: businessData.Address ?? "Dirección no disponible",
    AddressDetails: {
      City: businessData.AddressDetails.City,
      Country: businessData.AddressDetails.Country,
      FirstLine: businessData.AddressDetails.FirstLine,
      Postcode: businessData.AddressDetails.Postcode,
    },
    Email: businessData.Email,
    Phone: businessData.Phone || undefined,
    Services: Array.isArray(businessData.Services) ? businessData.Services : [],
    Website: businessData.Website || undefined,
    Features: Array.isArray(businessData.Features) ? businessData.Features : [],
    Description: businessData.Description || "Aún no hay descripción.",
    // Enrichment-ready optional fields (start empty)
    Rating: undefined,
    ReviewCount: undefined,
    OpenUntil: undefined,
    IsOpen: undefined,
    Images: {
      Main: businessData?.Images?.Main,
      Gallery: businessData?.Images?.Gallery,
    },
    Reviews: undefined,
    NearbyVenues: undefined,
    OpeningHours: undefined,
  };

  const gallery = business.Images?.Gallery
    ? business.Images?.Gallery
    : ["", "", "", ""];

  return (
    <div className="bg-[#FFF8F6] text-black min-h-screen font-sans">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <section>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {business.BusinessName}
                </h1>
                {/* verified mark only when we decide so later */}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                {typeof business.OpenUntil === "string" && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FF3366]" />
                    <span className="font-medium text-[#FF3366]">
                      Abierto hasta las {business.OpenUntil}
                    </span>
                  </div>
                )}

                {business.Address && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-[60ch]">
                      {business?.AddressDetails?.FirstLine}
                    </span>
                  </div>
                )}

                {business.Website && (
                  <a
                    href={business.Website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[#FF3366] font-medium"
                  >
                    <Globe className="w-4 h-4" /> Sitio web
                  </a>
                )}
              </div>

              {/* <div className="flex items-center gap-3">
                <Stars rating={business.Rating} />
                {typeof business.ReviewCount === "number" && (
                  <span className="text-gray-500">
                    ({business.ReviewCount.toLocaleString()} reseñas)
                  </span>
                )}
              </div> */}
            </div>

            <div className="flex items-center gap-3">
              {/* <Button
                variant="outline"
                className="border-gray-200 text-gray-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button
                variant="outline"
                className="border-gray-200  text-gray-700"
              >
                <Heart className="w-4 h-4" />
              </Button> */}
              {/* <Button className="bg-[#FF3366] hover:bg-[#D94A6A] text-white px-7 py-3">
                Reservar
              </Button> */}
            </div>
          </div>
        </section>

        <BusinessGalleryHero
          businessName={business.BusinessName}
          main={normalizeMaistroImage(business?.Images?.Main)}
          gallery={normalizeMaistroImages(business?.Images?.Gallery)}
        />

        <Separator />

        {/* <BusinsessProfileServices services={business.Services} />  // TODO */}

        <BusinessProfileAbout business={business} />

        {/* <BusinessProfileReviews business={business} /> */}

        {/* <BusinessProfileNearby business={business} /> */}
      </div>
    </div>
  );
};

export default BusinessProfilePage;
