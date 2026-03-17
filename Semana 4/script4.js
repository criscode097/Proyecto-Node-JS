// ============================================
// PROYECTO SEMANA 04: Generador de Mensajes
// ============================================
//
// 🎯 OBJETIVO: Construir un generador de mensajes
//    en consola usando métodos de string y
//    template literals.
//
// 📋 TU DOMINIO: Adapta cada TODO al dominio
//    que te fue asignado por el instructor.
//
// ⚠️  POLÍTICA ANTICOPIA: Tu implementación debe
//    ser única y coherente con tu dominio.
//    Usa dominios no asignables como referencia
//    conceptual, pero NO copies valores.
//
// ============================================

// ============================================
// SECCIÓN 1: Datos del dominio
// ============================================

// Nombre del dominio asignado
const DOMAIN_NAME = "Plataforma de Alquiler Vacacional";

// Nombre del alojamiento con espacios intencionales para aplicar trim()
const rawEntityName = "  Villa Sunset Cartagena  ";

// Tipo de alojamiento dentro de la plataforma
const entityCategory = "Villa con vista al mar";

// Código identificador del alojamiento en la plataforma
const entityCode = "DS-2024-001";

// Descripción del alojamiento con palabras clave del dominio vacacional
const entityDescription = "Hermosa villa vacacional frente al mar Caribe, ideal para familias y grupos. Incluye piscina privada, cocina equipada y acceso directo a la playa.";

// Precio por noche del alojamiento en pesos colombianos
const mainValue = 450_000;

// Indica si el alojamiento está activo y disponible en la plataforma
const isActive = true;


// ============================================
// SECCIÓN 2: Transformaciones de string
// ============================================

// Nombre limpio sin espacios al inicio y al final
const entityName = rawEntityName.trim();

// Nombre en mayúsculas para usar en el encabezado de la ficha
const entityNameUpper = entityName.toUpperCase();

// Nombre en minúsculas para usar en referencias internas
const entityNameLower = entityName.toLowerCase();

// Prefijo del código (primeras 2 letras: "DS") para identificar la plataforma
const codePrefix = entityCode.slice(0, 2);


// ============================================
// SECCIÓN 3: Validaciones con búsqueda
// ============================================

// Verifica si el código empieza con el prefijo "DS" (DreamStays)
const hasValidPrefix = entityCode.startsWith(codePrefix);

// Verifica si la descripción menciona la palabra "vacacional"
const descriptionIsRelevant = entityDescription.includes("vacacional");

// Verifica si el código termina con "001" (primer registro de la plataforma)
const hasValidSuffix = entityCode.endsWith("001");


// ============================================
// SECCIÓN 4: Generación de la ficha principal
// ============================================

const separator = "=".repeat(45);
const subSeparator = "-".repeat(45);

const mainCard = `
${separator}
  ${DOMAIN_NAME.toUpperCase()} — FICHA DE ENTIDAD
${separator}
Nombre:      ${entityNameUpper}
Categoría:   ${entityCategory}
Código:      ${entityCode}
Prefijo:     ${codePrefix}
Valor:       ${mainValue} COP / noche
Estado:      ${isActive ? "Activo" : "Inactivo"}

${subSeparator}
Descripción:
${entityDescription}
${separator}
`;

console.log(mainCard);


// ============================================
// SECCIÓN 5: Validaciones
// ============================================

console.log("--- Validaciones ---");
console.log(`¿Código empieza con '${codePrefix}'?:         ${hasValidPrefix}`);
console.log(`¿Descripción contiene 'vacacional'?:          ${descriptionIsRelevant}`);
console.log(`¿Código termina con '001'?:                   ${hasValidSuffix}`);
console.log(`Nombre en minúsculas (referencia interna):    ${entityNameLower}`);
console.log("");


// ============================================
// SECCIÓN 6: Mensaje de notificación corto
// ============================================

console.log("--- Notificación ---");

const notification = `🏖️  Nuevo alojamiento disponible en DreamStays: ${entityName} (${entityCode}) — ${mainValue} COP / noche`;
console.log(notification);
console.log("");

console.log("Ficha creada por Cristian Martinez");
console.log("¡Descubre tu próximo destino vacacional con DreamStays!");
