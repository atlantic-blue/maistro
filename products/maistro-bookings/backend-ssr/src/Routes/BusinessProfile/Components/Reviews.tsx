import React from "react"
import { BusinessProfileExtended } from "../../../types/BusinessProfile"
import { safeArray } from "../../../utils/array"
import Stars from "./Stars"
import { Button, Card } from "@maistro/ui"
import { initials } from "../../../utils/initials"

const BusinessProfileReviews = ({
    business
}: {
    business: BusinessProfileExtended
}) => {
    const reviews = safeArray(business.Reviews)

    return (
        <>
        {reviews.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Reseñas</h2>
              <div className="flex items-center gap-2">
                <Stars rating={business.Rating} />
                {typeof business.ReviewCount === 'number' && (
                  <span className="text-gray-500">({business.ReviewCount.toLocaleString()})</span>
                )}
              </div>
            </div>

            <div className="space-y-5">
              {reviews.map(r => (
                <Card key={r.id} className="bg-white border border-gray-100 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FF3366] bg-opacity-10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-[#FF3366]">{initials(r.customerName)}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">{r.customerName}</span>
                        <p className="text-sm text-gray-500">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex"><Stars rating={r.rating} /></div>
                  </div>
                  <p className="text-gray-700">{r.comment}</p>
                </Card>
              ))}
            </div>

            <div className="text-center mt-6">
              <Button variant="outline" className="border-gray-200 text-gray-700 px-8">
                Ver todas las reseñas
              </Button>
            </div>
          </section>
        )}
        </>
    )
}


export default BusinessProfileReviews
