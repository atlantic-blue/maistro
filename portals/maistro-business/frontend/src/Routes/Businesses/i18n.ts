import { Locale } from './types';

export const baseDictionary = {
  es: {
    titleYour: 'Tus negocios',
    subtitle:
      'Crea, administra y muestra tus marcas. Comparte el perfil público o entra a configuración para editar.',
    newBusiness: 'Nuevo negocio',
    searchPlaceholder: 'Buscar por nombre, tipo, característica, slug…',
    types: 'Tipos',
    sort: 'Ordenar',
    sortRecent: 'Recientes',
    sortAlpha: 'A–Z',
    showing: (x: number, y: number) => `Mostrando ${x} de ${y}`,
    visitWebsite: 'Visitar sitio',
    publicProfile: 'Perfil público',
    editSettings: 'Editar Negocio',
    updated: (d: string) => `Actualizado ${d}`,
    live: 'Activo',
    draft: 'Borrador',
    team: (n: string) => `Equipo ${n}`,
    emptyTitle: 'Aún no tienes negocios',
    emptyBody: 'Crea tu primer perfil de negocio y compártelo con el mundo.',
    emptyCta: 'Nuevo negocio',
    // Tipos de negocio
    businessTypeLabels: {
      'hair-salon': 'Peluquería',
      spa: 'Spa',
    } as Record<string, string>,
  },
  en: {
    titleYour: 'Your Businesses',
    subtitle:
      'Create, manage and showcase your brands. Share the public profile or jump into settings to edit.',
    newBusiness: 'New business',
    searchPlaceholder: 'Search by name, type, feature, slug…',
    types: 'Types',
    sort: 'Sort',
    sortRecent: 'Recent',
    sortAlpha: 'A–Z',
    showing: (x: number, y: number) => `Showing ${x} of ${y}`,
    visitWebsite: 'Visit website',
    publicProfile: 'Public profile',
    editSettings: 'Edit Business',
    updated: (d: string) => `Updated ${d}`,
    live: 'Live',
    draft: 'Draft',
    team: (n: string) => `Team ${n}`,
    emptyTitle: 'No businesses yet',
    emptyBody: 'Create your first business profile and share it with the world.',
    emptyCta: 'New business',
    businessTypeLabels: {
      'hair-salon': 'Hair salon',
      spa: 'Spa',
    } as Record<string, string>,
  },
} satisfies Record<Locale, any>;
