import { Button, Card } from '@maistro/ui';
import React from 'react';
import { BusinessProfile } from '../../../types/BusinessProfile';
import { formatPrice } from '../../../utils/currency';

const BusinsessProfileServices = ({ services }: { services: BusinessProfile['Services'] }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Servicios</h2>

      {services.length === 0 ? (
        <Card className="bg-white border border-gray-100 rounded-xl p-6">
          <p className="text-gray-600">Aún no hay servicios publicados. Vuelve pronto.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{service.title}</h3>
                  {service.duration && <p className="text-sm text-gray-500">{service.duration}</p>}
                </div>
                <div className="flex items-center gap-5 shrink-0">
                  <span className="text-lg font-bold text-gray-900">
                    {typeof service.price === 'number'
                      ? `desde ${formatPrice(service.price)}`
                      : 'Precio a consultar'}
                  </span>
                  <Button className="bg-[#FF3366] hover:bg-[#D94A6A] text-white px-5">
                    Reservar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default BusinsessProfileServices;
