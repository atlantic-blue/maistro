interface I18nField {
  label: string;
  placeholder: string;
}

interface I18nCommon {
  accountSetup: string;
  continue: string;
  close: string;
  done: string;
  back: string;
  optional: string;
  from: string;
}

// Step 1: Business name and website
interface I18nStep1 {
  title: string;
  description: string;
  fields: {
    businessName: I18nField;
    website: I18nField;
  };
}

// Step 2: Business categories
interface I18nStep2 {
  title: string;
  description: string;
  categories: {
    "hair-salon": string;
    spa: string;
    barbershop: string;
    "beauty-clinic": string;
    "fitness-studio": string;
    "medical-spa": string;
    nails: string;
    "eyebrows-lashes": string;
    massage: string;
    waxing: string;
    tanning: string;
    "pet-grooming": string;
  };
}

// Step 3: Account type selection
interface I18nStep3 {
  title: string;
  description: string;
  options: {
    independent: string;
    team: string;
  };
}

// Step 4: Team size
interface I18nStep4 {
  title: string;
  teamSizes: string[];
  helpText: string;
}

// Step 5: Business location
interface I18nStep5 {
  title: string;
  description: string;
  fields: {
    address: I18nField;
    phone: I18nField;
    description: I18nField;
  };
}

// Service item for step 6
interface I18nService {
  name: string;
  duration: string;
}

// Step 6: Services setup
interface I18nStep6 {
  title: string;
  description: string;
  addCustomService: string;
  services: {
    "hair-salon": I18nService[];
    spa: I18nService[];
    nails: I18nService[];
    barbershop: I18nService[];
    "fitness-studio": I18nService[];
  };
}

// Step 7: Business features
interface I18nStep7 {
  title: string;
  description: string;
  features: string[];
}

// Next steps for step 8
interface I18nNextSteps {
  title: string;
  items: string[];
}

// Step 8: Completion
interface I18nStep8 {
  title: string;
  description: string;
  ctaButton: string;
  nextSteps: I18nNextSteps;
}

// Complete language configuration
interface I18nLanguageConfig {
  common: I18nCommon;
  step1: I18nStep1;
  step2: I18nStep2;
  step3: I18nStep3;
  step4: I18nStep4;
  step5: I18nStep5;
  step6: I18nStep6;
  step7: I18nStep7;
  step8: I18nStep8;
}

// Main i18n configuration interface
interface I18nConfig {
  [key: string]: I18nLanguageConfig;
}

const i18nConfig: I18nConfig = {
  "en": {
    "common": {
      "accountSetup": "Account setup",
      "continue": "Continue",
      "close": "Close",
      "done": "Done",
      "back": "Back",
      "optional": "(Optional)",
      "from": "from"
    },
    "step1": {
      "title": "What's your business name?",
      "description": "This is the brand name your clients will see. Your billing and legal name can be added later.",
      "fields": {
        "businessName": {
          "label": "Business name",
          "placeholder": "Enter your business name"
        },
        "website": {
          "label": "Website",
          "placeholder": "www.yoursite.com"
        }
      }
    },
    "step2": {
      "title": "Select categories that best describe your business",
      "description": "Choose your primary service type",
      "categories": {
        "hair-salon": "Hair Salon",
        "spa": "Spa",
        "barbershop": "Barbershop",
        "beauty-clinic": "Beauty Clinic",
        "fitness-studio": "Fitness Studio",
        "medical-spa": "Medical Spa",
        "nails": "Nails",
        "eyebrows-lashes": "Eyebrows & Lashes",
        "massage": "Massage",
        "waxing": "Waxing Salon",
        "tanning": "Tanning Studio",
        "pet-grooming": "Pet Grooming"
      }
    },
    "step3": {
      "title": "Select account type",
      "description": "This will help us set up your account correctly",
      "options": {
        "independent": "I'm an independent",
        "team": "I have a team"
      }
    },
    "step4": {
      "title": "What's your team size",
      "teamSizes": [
        "2-5 people",
        "6-10 people",
        "11+ people"
      ],
      "helpText": "We'll help you set up staff profiles and schedules to organize your team efficiently."
    },
    "step5": {
      "title": "Set your venue's physical location",
      "description": "Add your primary business location so your clients can easily find you.",
      "fields": {
        "address": {
          "label": "Business Address",
          "placeholder": "Enter your business address"
        },
        "phone": {
          "label": "Phone Number",
          "placeholder": "+44 20 1234 5678"
        },
        "description": {
          "label": "Business Description",
          "placeholder": "Tell clients about your business, atmosphere, and what makes you special..."
        }
      }
    },
    "step6": {
      "title": "Add your services",
      "description": "Select the services you offer. You can customize these later.",
      "addCustomService": "+ Add custom service",
      "services": {
        "hair-salon": [
          { "name": "Wash & Blow Dry", "duration": "30-45 mins" },
          { "name": "Cut & Style", "duration": "45-60 mins" },
          { "name": "Hair Coloring", "duration": "1h 30m-2h" }
        ],
        "spa": [
          { "name": "Relaxing Massage", "duration": "60 mins" },
          { "name": "Facial Treatment", "duration": "45 mins" },
          { "name": "Body Scrub", "duration": "30 mins" }
        ],
        "nails": [
          { "name": "Manicure", "duration": "30 mins" },
          { "name": "Pedicure", "duration": "45 mins" },
          { "name": "Gel Polish", "duration": "20 mins" }
        ],
        "barbershop": [
          { "name": "Classic Cut", "duration": "30 mins" },
          { "name": "Beard Trim", "duration": "15 mins" },
          { "name": "Hot Towel Shave", "duration": "45 mins" }
        ],
        "fitness-studio": [
          { "name": "Personal Training", "duration": "60 mins" },
          { "name": "Group Class", "duration": "45 mins" },
          { "name": "Consultation", "duration": "30 mins" }
        ]
      }
    },
    "step7": {
      "title": "Business features",
      "description": "Select any special features or amenities your business offers.",
      "features": [
        "Pet-friendly",
        "Eco-conscious",
        "Wheelchair accessible",
        "Free parking",
        "Free WiFi",
        "Card payments",
        "Gift vouchers",
        "Online booking"
      ]
    },
    "step8": {
      "title": "Your business is set up!",
      "description": "Enjoy 14 days free of using Maistro Bookings. Start accepting bookings right away!",
      "ctaButton": "Go to Dashboard",
      "nextSteps": {
        "title": "Next steps:",
        "items": [
          "Upload your business photos",
          "Set your operating hours",
          "Customize your booking page",
          "Invite your team members"
        ]
      }
    }
  },
  "es": {
    "common": {
      "accountSetup": "Configuración de cuenta",
      "continue": "Continuar",
      "close": "Cerrar",
      "done": "Hecho",
      "back": "Atrás",
      "optional": "(Opcional)",
      "from": "desde"
    },
    "step1": {
      "title": "¿Cuál es el nombre de tu negocio?",
      "description": "Este es el nombre de marca que verán tus clientes. Tu nombre legal y de facturación se puede agregar más tarde.",
      "fields": {
        "businessName": {
          "label": "Nombre del negocio",
          "placeholder": "Ingresa el nombre de tu negocio"
        },
        "website": {
          "label": "Sitio web",
          "placeholder": "www.tusitio.com"
        }
      }
    },
    "step2": {
      "title": "Selecciona las categorías que mejor describan tu negocio",
      "description": "Elige tu tipo de servicio principal",
      "categories": {
        "hair-salon": "Peluquería",
        "spa": "Spa",
        "barbershop": "Barbería",
        "beauty-clinic": "Clínica de Belleza",
        "fitness-studio": "Estudio de Fitness",
        "medical-spa": "Spa Médico",
        "nails": "Uñas",
        "eyebrows-lashes": "Cejas y Pestañas",
        "massage": "Masajes",
        "waxing": "Salón de Depilación",
        "tanning": "Estudio de Bronceado",
        "pet-grooming": "Peluquería de Mascotas"
      }
    },
    "step3": {
      "title": "Selecciona el tipo de cuenta",
      "description": "Esto nos ayudará a configurar tu cuenta correctamente",
      "options": {
        "independent": "Soy independiente",
        "team": "Tengo un equipo"
      }
    },
    "step4": {
      "title": "¿Cuál es el tamaño de tu equipo?",
      "teamSizes": [
        "2-5 personas",
        "6-10 personas",
        "11+ personas"
      ],
      "helpText": "Te ayudaremos a configurar perfiles de personal y horarios para organizar tu equipo de manera eficiente."
    },
    "step5": {
      "title": "Establece la ubicación física de tu local",
      "description": "Agrega la ubicación principal de tu negocio para que tus clientes puedan encontrarte fácilmente.",
      "fields": {
        "address": {
          "label": "Dirección del Negocio",
          "placeholder": "Ingresa la dirección de tu negocio"
        },
        "phone": {
          "label": "Número de Teléfono",
          "placeholder": "+34 91 234 5678"
        },
        "description": {
          "label": "Descripción del Negocio",
          "placeholder": "Cuéntales a los clientes sobre tu negocio, ambiente y qué te hace especial..."
        }
      }
    },
    "step6": {
      "title": "Agrega tus servicios",
      "description": "Selecciona los servicios que ofreces. Puedes personalizarlos más tarde.",
      "addCustomService": "+ Agregar servicio personalizado",
      "services": {
        "hair-salon": [
          { "name": "Lavado y Peinado", "duration": "30-45 min" },
          { "name": "Corte y Peinado", "duration": "45-60 min" },
          { "name": "Coloración Completa", "duration": "1h 30m-2h" }
        ],
        "spa": [
          { "name": "Masaje Relajante", "duration": "60 min" },
          { "name": "Tratamiento Facial", "duration": "45 min" },
          { "name": "Exfoliación Corporal", "duration": "30 min" }
        ],
        "nails": [
          { "name": "Manicura", "duration": "30 min" },
          { "name": "Pedicura", "duration": "45 min" },
          { "name": "Esmalte en Gel", "duration": "20 min" }
        ],
        "barbershop": [
          { "name": "Corte Clásico", "duration": "30 min" },
          { "name": "Arreglo de Barba", "duration": "15 min" },
          { "name": "Afeitado con Toalla Caliente", "duration": "45 min" }
        ],
        "fitness-studio": [
          { "name": "Entrenamiento Personal", "duration": "60 min" },
          { "name": "Clase Grupal", "duration": "45 min" },
          { "name": "Consulta", "duration": "30 min" }
        ]
      }
    },
    "step7": {
      "title": "Características del negocio",
      "description": "Selecciona cualquier característica especial o amenidad que ofrezca tu negocio.",
      "features": [
        "Acepta mascotas",
        "Eco-consciente",
        "Accesible para sillas de ruedas",
        "Estacionamiento gratuito",
        "WiFi gratuito",
        "Pagos con tarjeta",
        "Vales de regalo",
        "Reservas en línea"
      ]
    },
    "step8": {
      "title": "¡Tu negocio está configurado!",
      "description": "Disfruta de 14 días gratis usando Maistro Bookings. ¡Comienza a aceptar reservas de inmediato!",
      "ctaButton": "Ir al Panel",
      "nextSteps": {
        "title": "Próximos pasos:",
        "items": [
          "Subir fotos de tu negocio",
          "Establecer horarios de atención",
          "Personalizar tu página de reservas",
          "Invitar a los miembros de tu equipo"
        ]
      }
    }
  }
};
