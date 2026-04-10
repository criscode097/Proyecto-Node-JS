'use strict';

const patterns = {
  name: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]{2,}(?:\s[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+){1,4}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s\-().]{7,15}$/,
  password: {
    minLength: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    special: /[^a-zA-Z0-9]/,
  },
  date: /^(?<day>0[1-9]|[12]\d|3[01])\/(?<month>0[1-9]|1[0-2])\/(?<year>\d{4})$/,
  postal: /^\d{5}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/,
  price: /^\d{1,6}(\.\d{1,2})?$/,
  propertyCode: /^VR-\d{4}-[A-Z]{2,4}-\d{3}$/,
  guestCapacity: /^([1-9]|[12]\d|30)$/,
};

const validators = {

  validateName(value) {
    const v = value.trim();
    if (!v) return { isValid: false, message: 'El nombre es obligatorio' };
    if (v.length < 2) return { isValid: false, message: 'Mínimo 2 caracteres' };
    if (v.length > 50) return { isValid: false, message: 'Máximo 50 caracteres' };
    if (!patterns.name.test(v)) return { isValid: false, message: 'Solo letras y espacios, incluye apellido' };
    return { isValid: true, message: '' };
  },

  validateEmail(value) {
    const v = value.trim();
    if (!v) return { isValid: false, message: 'El correo es obligatorio' };
    if (!patterns.email.test(v)) return { isValid: false, message: 'Ingresa un correo válido (ej: usuario@dominio.com)' };
    return { isValid: true, message: '' };
  },

  validatePhone(value) {
    const cleaned = value.replace(/[^\d+]/g, '');
    if (!cleaned) return { isValid: false, message: 'El teléfono es obligatorio', formatted: value };
    if (cleaned.length < 7) return { isValid: false, message: 'Mínimo 7 dígitos', formatted: value };
    if (!patterns.phone.test(value)) return { isValid: false, message: 'Formato inválido. Ej: +57 312 345 6789', formatted: value };
    return { isValid: true, message: '', formatted: formatPhoneNumber(cleaned) };
  },

  validatePassword(value) {
    if (!value) return { isValid: false, message: 'La contraseña es obligatoria', strength: 0 };

    const checks = {
      minLength: patterns.password.minLength.test(value),
      uppercase: patterns.password.uppercase.test(value),
      lowercase: patterns.password.lowercase.test(value),
      number: patterns.password.number.test(value),
      special: patterns.password.special.test(value),
    };

    const strength = Object.values(checks).filter(Boolean).length;
    const missing = [];
    if (!checks.minLength) missing.push('mínimo 8 caracteres');
    if (!checks.uppercase) missing.push('una mayúscula');
    if (!checks.lowercase) missing.push('una minúscula');
    if (!checks.number) missing.push('un número');
    if (!checks.special) missing.push('un carácter especial');

    const isValid = missing.length === 0;
    return { isValid, message: isValid ? '' : `Falta: ${missing.join(', ')}`, strength };
  },

  validateConfirmPassword(password, confirm) {
    if (!confirm) return { isValid: false, message: 'Debes confirmar la contraseña' };
    if (password !== confirm) return { isValid: false, message: 'Las contraseñas no coinciden' };
    return { isValid: true, message: '' };
  },

  validateBirthdate(value) {
    const v = value.trim();
    if (!v) return { isValid: false, message: 'La fecha de nacimiento es obligatoria', age: 0 };

    const match = v.match(patterns.date);
    if (!match) return { isValid: false, message: 'Formato inválido. Usa DD/MM/YYYY', age: 0 };

    const day   = Number(match.groups.day);
    const month = Number(match.groups.month);
    const year  = Number(match.groups.year);

    // Constructor numérico — evita problemas de zona horaria UTC
    const birthDate = new Date(year, month - 1, day);

    // Verifica que la fecha exista (ej: 31/02 se convierte en 03/03)
    if (
      birthDate.getFullYear() !== year ||
      birthDate.getMonth() + 1 !== month ||
      birthDate.getDate() !== day
    ) {
      return { isValid: false, message: 'La fecha no existe (ej: 31/02 no es válido)', age: 0 };
    }

    // Calcula edad
    const today = new Date();
    let age = today.getFullYear() - year;
    const mDiff = today.getMonth() - (month - 1);
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < day)) age--;

    if (age < 18) return { isValid: false, message: `Debes ser mayor de 18 años (tienes ${age})`, age };
    if (age > 120) return { isValid: false, message: 'Ingresa una fecha válida', age };

    return { isValid: true, message: `Edad: ${age} años`, age };
  },

  validatePostal(value) {
    const v = value.trim();
    if (!v) return { isValid: false, message: 'El código postal es obligatorio' };
    if (!patterns.postal.test(v)) return { isValid: false, message: 'Debe tener exactamente 5 dígitos' };
    return { isValid: true, message: '' };
  },

  validateUrl(value) {
    const v = value.trim();
    if (!v) return { isValid: true, message: '' };
    if (!patterns.url.test(v)) return { isValid: false, message: 'URL inválida. Debe comenzar con http:// o https://' };
    return { isValid: true, message: '' };
  },

  validatePrice(value) {
    const v = value.trim();
    if (!v) return { isValid: false, message: 'El precio por noche es obligatorio' };
    if (!patterns.price.test(v) || Number(v) <= 0) return { isValid: false, message: 'Ingresa un precio válido en USD (ej: 150 o 150.00)' };
    return { isValid: true, message: '' };
  },

  validatePropertyCode(value) {
    const v = value.trim().toUpperCase();
    if (!v) return { isValid: false, message: 'El código de propiedad es obligatorio' };
    if (!patterns.propertyCode.test(v)) return { isValid: false, message: 'Formato: VR-YYYY-XXX-NNN (ej: VR-2024-COL-001)' };
    return { isValid: true, message: '' };
  },

  validateGuestCapacity(value) {
    const v = value.trim();
    if (!v) return { isValid: false, message: 'La capacidad es obligatoria' };
    if (!patterns.guestCapacity.test(v)) return { isValid: false, message: 'Ingresa un número entre 1 y 30' };
    return { isValid: true, message: '' };
  },
};

const sanitizeInput = input =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

const getStrengthLevel = strength => {
  if (strength <= 1) return { class: 'weak', text: '🔴 Muy débil' };
  if (strength === 2) return { class: 'fair', text: '🟠 Débil' };
  if (strength <= 4) return { class: 'good', text: '🟡 Buena' };
  return { class: 'strong', text: '🟢 Muy fuerte' };
};

const formatPhoneNumber = phone => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 11) {
    const country = digits.slice(0, digits.length - 9);
    return `+${country} ${digits.slice(-9, -6)} ${digits.slice(-6, -3)} ${digits.slice(-3)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone.startsWith('+') ? `+${digits}` : digits;
};

const updateFieldState = (input, isValid, message) => {
  const errorEl = document.getElementById(`${input.id}Error`);
  input.classList.remove('valid', 'invalid');
  if (!input.value.trim()) {
    if (errorEl) errorEl.textContent = '';
    return;
  }
  input.classList.add(isValid ? 'valid' : 'invalid');
  if (errorEl) errorEl.textContent = isValid ? '' : message;
};

const updateStrengthMeter = strength => {
  const bar  = document.getElementById('strengthBar');
  const text = document.getElementById('strengthText');
  if (!bar || !text) return;
  const level = getStrengthLevel(strength);
  bar.className = 'strength-bar';
  if (strength > 0) {
    bar.classList.add(level.class);
    text.textContent = level.text;
  } else {
    text.textContent = '';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form     = document.getElementById('registrationForm');
  const result   = document.getElementById('result');
  const formData = document.getElementById('formData');

  const inputs = {
    name:            document.getElementById('name'),
    email:           document.getElementById('email'),
    phone:           document.getElementById('phone'),
    password:        document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    birthdate:       document.getElementById('birthdate'),
    postal:          document.getElementById('postal'),
    website:         document.getElementById('website'),
    pricePerNight:   document.getElementById('pricePerNight'),
    propertyCode:    document.getElementById('propertyCode'),
    guestCapacity:   document.getElementById('guestCapacity'),
  };

  const validationState = {
    name:            false,
    email:           false,
    phone:           false,
    password:        false,
    confirmPassword: false,
    birthdate:       false,
    postal:          false,
    website:         true,
    pricePerNight:   false,
    propertyCode:    false,
    guestCapacity:   false,
  };

  inputs.name?.addEventListener('input', e => {
    const { isValid, message } = validators.validateName(e.target.value);
    validationState.name = isValid;
    updateFieldState(e.target, isValid, message);
  });

  inputs.email?.addEventListener('input', e => {
    const { isValid, message } = validators.validateEmail(e.target.value);
    validationState.email = isValid;
    updateFieldState(e.target, isValid, message);
  });

  inputs.phone?.addEventListener('input', e => {
    const { isValid, message, formatted } = validators.validatePhone(e.target.value);
    validationState.phone = isValid;
    updateFieldState(e.target, isValid, message);
    if (formatted && formatted !== e.target.value) e.target.value = formatted;
  });

  inputs.password?.addEventListener('input', e => {
    const { isValid, message, strength } = validators.validatePassword(e.target.value);
    validationState.password = isValid;
    updateFieldState(e.target, isValid, message);
    updateStrengthMeter(strength);
    if (inputs.confirmPassword?.value) {
      const r = validators.validateConfirmPassword(e.target.value, inputs.confirmPassword.value);
      validationState.confirmPassword = r.isValid;
      updateFieldState(inputs.confirmPassword, r.isValid, r.message);
    }
  });

  inputs.confirmPassword?.addEventListener('input', e => {
    const { isValid, message } = validators.validateConfirmPassword(inputs.password?.value || '', e.target.value);
    validationState.confirmPassword = isValid;
    updateFieldState(e.target, isValid, message);
  });

  inputs.birthdate?.addEventListener('input', e => {
    const { isValid, message } = validators.validateBirthdate(e.target.value);
    validationState.birthdate = isValid;
    updateFieldState(e.target, isValid, message);
  });

  inputs.postal?.addEventListener('input', e => {
    const { isValid, message } = validators.validatePostal(e.target.value);
    validationState.postal = isValid;
    updateFieldState(e.target, isValid, message);
  });

  inputs.website?.addEventListener('input', e => {
    const { isValid, message } = validators.validateUrl(e.target.value);
    validationState.website = isValid;
    updateFieldState(e.target, isValid, message);
  });

  inputs.pricePerNight?.addEventListener('input', e => {
    const { isValid, message } = validators.validatePrice(e.target.value);
    validationState.pricePerNight = isValid;
    updateFieldState(e.target, isValid, message);
  });

  inputs.propertyCode?.addEventListener('input', e => {
    const { isValid, message } = validators.validatePropertyCode(e.target.value);
    validationState.propertyCode = isValid;
    updateFieldState(e.target, isValid, message);
  });

  inputs.guestCapacity?.addEventListener('input', e => {
    const { isValid, message } = validators.validateGuestCapacity(e.target.value);
    validationState.guestCapacity = isValid;
    updateFieldState(e.target, isValid, message);
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const allValid = Object.values(validationState).every(v => v === true);
    if (!allValid) {
      const firstInvalid = Object.entries(validationState).find(([, v]) => !v);
      if (firstInvalid && inputs[firstInvalid[0]]) inputs[firstInvalid[0]].focus();
      return;
    }
    const data = {
      name:          sanitizeInput(inputs.name?.value        || ''),
      email:         sanitizeInput(inputs.email?.value       || ''),
      phone:         sanitizeInput(inputs.phone?.value       || ''),
      birthdate:     sanitizeInput(inputs.birthdate?.value   || ''),
      postal:        sanitizeInput(inputs.postal?.value      || ''),
      website:       sanitizeInput(inputs.website?.value     || ''),
      pricePerNight: sanitizeInput(inputs.pricePerNight?.value || ''),
      propertyCode:  sanitizeInput(inputs.propertyCode?.value  || ''),
      guestCapacity: sanitizeInput(inputs.guestCapacity?.value || ''),
    };
    if (result && formData) {
      formData.textContent = JSON.stringify(data, null, 2);
      result.classList.remove('hidden');
      result.scrollIntoView({ behavior: 'smooth' });
    }
  });

  form?.addEventListener('reset', () => {
    Object.keys(validationState).forEach(key => { validationState[key] = key === 'website'; });
    Object.values(inputs).forEach(input => input?.classList.remove('valid', 'invalid'));
    document.querySelectorAll('.error-message').forEach(el => { el.textContent = ''; });
    updateStrengthMeter(0);
    result?.classList.add('hidden');
  });
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { patterns, validators, sanitizeInput, getStrengthLevel, formatPhoneNumber };
}