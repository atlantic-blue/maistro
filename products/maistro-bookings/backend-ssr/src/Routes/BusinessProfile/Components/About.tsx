import React from "react"
import { BusinessProfileExtended } from "../../../types/BusinessProfile"
import {ChevronRight, Globe, PhoneIcon} from "lucide-react"
import GoogleMap from "../../../Components/GoogleMap";
import { Button, Card } from "@maistro/ui";
import { safeArray } from "../../../utils/array";

const FeaturePill = ({ children }: { children: React.ReactNode }) => (
  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{children}</span>
);

{/* ABOUT + HOURS + FEATURES + MAP (each only if present) */}
const BusinessProfileAbout = ({
    business
}: {
    business: BusinessProfileExtended
}) => {
    const opening = safeArray(business.OpeningHours)
    const features = safeArray(business.Features)

    return (
        <section className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acerca de</h2>
            <p className="text-gray-700 leading-relaxed">
              {business.Description}
            </p>

            <div className="space-y-6 mt-8">
              {opening.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Horarios de Atención</h3>
                  <div className="space-y-1.5">
                    {opening.slice(0, 3).map(h => (
                      <div key={h.day} className="flex justify-between text-sm">
                        <span className="text-gray-600">{h.day}</span>
                        <span className="text-gray-900 font-medium">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                  {opening.length > 3 && (
                    <button className="text-[#FF3366] hover:text-[#D94A6A] font-medium text-sm flex items-center gap-1 mt-2">
                      Ver todos los horarios <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {features.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Características</h3>
                  <div className="flex flex-wrap gap-2">
                    {features.map(f => <FeaturePill key={f}>{f}</FeaturePill>)}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {business.Phone && (
                  <span className="inline-flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4" /> {business.Phone}
                  </span>
                )}
                {business.Website && (
                  <a href={business.Website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#FF3366] font-medium">
                    <Globe className="w-4 h-4" /> {business.Website.replace(/^https?:\/\//,'')}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ubicación</h2>
            {business.Address ? (
              <>
                <GoogleMap
                  address={{
                    firstLine: business.Address,
                    city: '',
                    country: '',
                    postcode: '',
                  }}
                />
                <Button variant="outline" className="w-full border-gray-200 text-gray-700 py-3 mt-3">
                  Obtener direcciones
                </Button>
              </>
            ) : (
              <Card className="bg-white border border-gray-100 rounded-xl p-6">
                <p className="text-gray-600">Dirección no disponible todavía.</p>
              </Card>
            )}
          </div>
        </section>
    )
}

export default BusinessProfileAbout
