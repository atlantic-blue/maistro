import { Card } from "@maistro/ui"
import React from "react"
import { BusinessProfileExtended } from "../../../types/BusinessProfile"
import { safeArray } from "../../../utils/array"
import Stars from "./Stars"

const BusinessProfileNearby = ({
    business
}: {
    business: BusinessProfileExtended
}) => {
    const nearby = safeArray(business.NearbyVenues)

    return (
        <>
        {nearby.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lugares cercanos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {nearby.map(v => (
                <Card key={v.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                  <div className="aspect-video overflow-hidden">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{v.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 truncate">{v.location}</p>
                    {v.rating && <Stars rating={v.rating} />}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
        </>
    )
}


export default BusinessProfileNearby