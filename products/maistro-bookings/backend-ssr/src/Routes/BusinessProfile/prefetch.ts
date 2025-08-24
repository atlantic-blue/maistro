import { IBusinessProfile } from "../../types/BusinessProfile";

export const businessProfilePrefetch = async() => {
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
    
    return defaultBusiness
}
