import { ProfileFormData } from '../types/profile';

export type ValidationErrors = Partial<ProfileFormData>;

interface ValidationRule {
  field: keyof ProfileFormData;
  validate: (value: string) => string | undefined;
}

// Valideringsregler för varje fält
const validationRules: ValidationRule[] = [
  {
    field: 'gender',
    validate: (value) => {
      if (!value.trim()) return 'Kön är obligatoriskt';
      if (!['Man', 'Kvinna', 'Annat'].includes(value)) return 'Välj ett giltigt kön';
      return undefined;
    }
  },
  {
    field: 'age',
    validate: (value) => {
      if (!value.trim()) return 'Ålder är obligatorisk';
      const ageNum = parseInt(value);
      if (isNaN(ageNum)) return 'Ange en giltig ålder';
      if (ageNum < 18) return 'Du måste vara minst 18 år';
      if (ageNum > 100) return 'Ange en realistisk ålder';
      return undefined;
    }
  },
  {
    field: 'location',
    validate: (value) => {
      if (!value.trim()) return 'Plats är obligatorisk';
      if (value.trim().length < 2) return 'Ange en giltig plats';
      return undefined;
    }
  },
  {
    field: 'occupation',
    validate: (value) => {
      if (!value.trim()) return 'Yrke är obligatoriskt';
      if (value.trim().length < 2) return 'Ange ett giltigt yrke';
      return undefined;
    }
  },
  {
    field: 'interests',
    validate: (value) => {
      if (!value.trim()) return 'Intressen är obligatoriska';
      if (value.trim().length < 5) return 'Beskriv dina intressen mer utförligt';
      return undefined;
    }
  },
  {
    field: 'about',
    validate: (value) => {
      if (!value.trim()) return 'Om mig är obligatoriskt';
      if (value.trim().length < 10) return 'Berätta lite mer om dig själv';
      if (value.trim().length > 500) return 'Max 500 tecken';
      return undefined;
    }
  }
];

/**
 * Validerar hela formuläret
 */
export const validateProfileForm = (formData: ProfileFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  validationRules.forEach(rule => {
    const error = rule.validate(formData[rule.field]);
    if (error) {
      errors[rule.field] = error;
    }
  });

  return errors;
};

/**
 * Validerar ett enskilt fält
 */
export const validateField = (
  field: keyof ProfileFormData, 
  value: string
): string | undefined => {
  const rule = validationRules.find(r => r.field === field);
  return rule ? rule.validate(value) : undefined;
};

/**
 * Saniterar input värde
 */
export const sanitizeInput = (value: string, field: keyof ProfileFormData): string => {
  // Ta bort extra mellanslag
  let sanitized = value.trim();

  // Fältspecifik sanering
  switch (field) {
    case 'age':
      // Ta bort icke-numeriska tecken
      sanitized = sanitized.replace(/\D/g, '');
      break;
    case 'location':
    case 'occupation':
      // Kapitalisera första bokstaven
      sanitized = sanitized.charAt(0).toUpperCase() + sanitized.slice(1);
      break;
    case 'interests':
    case 'about':
      // Behåll som det är men begränsa längd
      sanitized = sanitized.slice(0, field === 'about' ? 500 : 200);
      break;
  }

  return sanitized;
};