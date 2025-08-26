import React from 'react';
import { Button, Card, Separator } from '@maistro/ui';
import { MapPin, Clock, Star, Share2, Heart, ChevronRight } from 'lucide-react';

import Header from '@/Components/Header';
import GoogleMap from '@/Components/GoogleMap';
import { IBusinessProfile } from '@/types/BusinessProfile';

// Business Profile Interface

// Default business data
const defaultBusiness: IBusinessProfile = {
  id: 'tan-on-1',
  name: 'Tan On',
  rating: 4.6,
  reviewCount: 5682,
  address: 'Uxbridge Road, London',
  openUntil: '8:00 pm',
  isOpen: true,
  phone: '+44 20 1234 5678',
  website: 'www.tanon.co.uk',
  description:
    'At Tan On, the focus is on creating a serene and stylish experience for every client, ensuring nails are not just well-groomed but beautifully adorned. From luxury shellac manicures to paraffin treatments, this pet-friendly, eco-conscious salon welcomes all.',
  images: {
    main: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
    ],
  },
  services: [
    {
      id: '1',
      title: 'Pedicure Treatments',
      duration: '20 mins – 1h 30m',
      price: 10,
      category: 'Feet',
    },
    {
      id: '2',
      title: 'Ladies – Wash & Blow Dry',
      duration: '30 mins – 1h 15m',
      price: 20,
      category: 'Hair',
    },
    {
      id: '3',
      title: 'Full Head Hair Colouring',
      duration: '1h 5m – 1h 35m',
      price: 45,
      category: 'Hair',
    },
    {
      id: '4',
      title: 'Manicure Treatments',
      duration: '15 mins – 1 hour',
      price: 8,
      category: 'Nails',
    },
  ],
  reviews: [
    {
      id: '1',
      customerName: 'Tika P',
      date: '26 Jul 2025',
      rating: 4,
      comment: 'Great pedicure, quick and clean.',
    },
    {
      id: '2',
      customerName: 'Anonymous',
      date: '10 Jun 2025',
      rating: 5,
      comment: 'Loved the manicure service.',
    },
    {
      id: '3',
      customerName: 'Anonymous',
      date: '11 Jun 2025',
      rating: 2,
      comment: 'Not the best experience this time.',
    },
  ],
  nearbyVenues: [
    {
      id: '1',
      name: 'No1 Hair & Beauty',
      rating: '4.7 (10,000+)',
      location: "Shepherd's Bush",
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
      category: 'Hair Salon',
    },
    {
      id: '2',
      name: 'The Nailist',
      rating: '4.9 (322)',
      location: 'Hammersmith',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop',
      category: 'Nails',
    },
    {
      id: '3',
      name: 'Da Silva Hair & Beauty',
      rating: '5.0 (253)',
      location: 'Hammersmith',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=200&fit=crop',
      category: 'Hair Salon',
    },
    {
      id: '4',
      name: 'Moda3',
      rating: '4.6 (379)',
      location: "Shepherd's Bush",
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
      category: 'Hair Salon',
    },
  ],
  openingHours: [
    { day: 'Monday', hours: '10:00 am - 8:00 pm' },
    { day: 'Tuesday', hours: '10:00 am - 8:00 pm' },
    { day: 'Wednesday', hours: '10:00 am - 8:00 pm' },
    { day: 'Thursday', hours: '10:00 am - 8:00 pm' },
    { day: 'Friday', hours: '10:00 am - 8:00 pm' },
    { day: 'Saturday', hours: '9:00 am - 7:00 pm' },
    { day: 'Sunday', hours: '11:00 am - 6:00 pm' },
  ],
  features: ['Pet-friendly', 'Eco-conscious', 'Verified business'],
};

interface BusinessProfileProps {
  business?: IBusinessProfile;
}

export default function BusinessProfile({ business = defaultBusiness }: BusinessProfileProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-[#FF3366] text-[#FF3366]' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="bg-[#FFF8F6] text-black min-h-screen font-sans">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <section>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
                <div className="w-6 h-6 bg-[#FF3366] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF3366]" />
                  <span className="font-medium text-[#FF3366]">
                    Abierto hasta las {business.openUntil}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{business.address}</span>
                </div>
                <button className="text-[#FF3366] hover:text-[#FF3366] font-medium">
                  Obtener direcciones
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(business.rating)}
                  <span className="font-semibold ml-2 text-gray-900">{business.rating}</span>
                </div>
                <span className="text-gray-500">
                  ({business.reviewCount.toLocaleString()} reseñas)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gray-200 text-gray-700">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" className="border-gray-200  text-gray-700">
                <Heart className="w-4 h-4" />
              </Button>
              <Button className="bg-[#FF3366] hover:bg-[#D94A6A] text-white px-8 py-3">
                Reservar
              </Button>
            </div>
          </div>
        </section>

        {/* Gallery with responsive layout */}
        <section>
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
            <div className="lg:col-span-2 h-full">
              <img
                src={business.images.main}
                alt="Interior del Salón"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="grid grid-rows-2 gap-6 h-full">
              {business.images.gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Galería ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              ))}
            </div>
          </div>

          {/* Mobile carousel */}
          <div className="lg:hidden overflow-x-auto snap-x snap-mandatory flex space-x-4 px-4 pb-4">
            <div className="snap-center flex-shrink-0 w-[90%]">
              <img
                src={business.images.main}
                alt="Interior del Salón"
                className="w-full h-72 object-cover rounded-xl"
              />
            </div>
            {business.images.gallery.map((image, index) => (
              <div key={index} className="snap-center flex-shrink-0 w-[90%]">
                <img
                  src={image}
                  alt={`Galería ${index + 1}`}
                  className="w-full h-72 object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Services */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Servicios</h2>
          <div className="space-y-4">
            {business.services.map((service) => (
              <Card
                key={service.id}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                    <p className="text-sm text-gray-500">{service.duration}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-lg font-bold text-gray-900">desde €{service.price}</span>
                    <Button className="bg-[#FF3366] hover:bg-[#D94A6A] text-white px-6">
                      Reservar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* About & Map */}
        <section className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Acerca de</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">{business.description}</p>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Horarios de Atención</h3>
                <div className="space-y-2">
                  {business.openingHours.slice(0, 3).map((hours) => (
                    <div key={hours.day} className="flex justify-between py-1">
                      <span className="text-gray-600">{hours.day}</span>
                      <span className="text-gray-900 font-medium">{hours.hours}</span>
                    </div>
                  ))}
                  <button className="text-[#FF3366] hover:text-[#D94A6A] font-medium text-sm flex items-center gap-1">
                    Ver todos los horarios
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Características</h3>
                <div className="flex flex-wrap gap-3">
                  {business.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ubicación</h2>
            <GoogleMap
              address={{
                city: 'Uxbridge Road, London, England',
                country: 'England',
                firstLine: '',
                postcode: '',
              }}
            />
            <Button variant="outline" className="w-full border-gray-200 text-gray-700 py-3">
              Obtener direcciones
            </Button>
          </div>
        </section>

        {/* Reviews */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Reseñas</h2>
            <div className="flex items-center gap-3">
              {renderStars(business.rating)}
              <span className="font-bold text-gray-900 ml-2">{business.rating}</span>
              <span className="text-gray-500">({business.reviewCount.toLocaleString()})</span>
            </div>
          </div>

          <div className="space-y-6">
            {business.reviews.map((review) => (
              <Card key={review.id} className="bg-white border border-gray-100 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#FF3366] bg-opacity-10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-[#FF3366]">
                          {review.customerName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">{review.customerName}</span>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="border-gray-200 text-gray-700 px-8">
              Ver todas las reseñas
            </Button>
          </div>
        </section>

        {/* Nearby Venues */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Lugares cercanos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {business.nearbyVenues.map((venue) => (
              <Card
                key={venue.id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{venue.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{venue.location}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#FF3366] text-[#FF3366]" />
                    <span className="text-sm font-medium text-gray-900">{venue.rating}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
