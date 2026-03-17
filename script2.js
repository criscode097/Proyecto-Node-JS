// ============================================
// PROYECTO SEMANA 02: Ficha de Datos del Dominio
// ============================================
//
// 🎯 OBJETIVO: Crear una ficha de datos en consola
//    usando variables, tipos y conversiones.
//
// 📋 TU DOMINIO: Reemplaza cada TODO con datos
//    coherentes con el dominio que te fue asignado.
//
// ⚠️  POLÍTICA ANTICOPIA: Tu implementación debe ser
//    única y coherente con tu dominio asignado.
//    Implementaciones copiadas serán detectadas.
//
// Adapta cada TODO al contexto de tu dominio asignado.
// Los ejemplos en este archivo usan dominios NO asignables.
// ============================================

// ============================================
// SECCIÓN 1: DATOS PRINCIPALES
// ============================================

// Nombre del dominio asignado
const DOMAIN_NAME = "Plataforma de Alquiler Vacacional";

// Nombre del alojamiento principal registrado en la plataforma
const itemName = "Villa Sunset Cartagena";

// Tipo de alojamiento dentro de la categoría turismo y hospitalidad
const itemCategory = "Villa con vista al mar";

// Precio por noche del alojamiento en pesos colombianos
const itemQuantity = 450_000;

// Indica si el alojamiento está disponible para reserva en este momento
const isAvailable = true;

// Indica si el alojamiento cuenta con servicio de limpieza incluido
const hasCleaningService = false;

// Anfitrión aún no asignado a este alojamiento
const currentHost = null;


// ============================================
// SECCIÓN 2: MOSTRAR FICHA DE DATOS
// ============================================
console.log("===========================");
console.log(`FICHA DE DATOS: ${DOMAIN_NAME}`);
console.log("===========================");
console.log("");

console.log(`Nombre:             ${itemName}`);
console.log(`Categoría:          ${itemCategory}`);
console.log(`Precio por noche:   ${itemQuantity} COP`);
console.log(`Disponible:         ${isAvailable}`);
console.log(`Limpieza incluida:  ${hasCleaningService}`);
console.log("");


// ============================================
// SECCIÓN 3: VERIFICACIÓN DE TIPOS CON typeof
// ============================================
console.log("--- Tipos de datos ---");

console.log("typeof itemName:         ", typeof itemName);
console.log("typeof itemQuantity:     ", typeof itemQuantity);
console.log("typeof isAvailable:      ", typeof isAvailable);
console.log("typeof hasCleaningService:", typeof hasCleaningService);
console.log("typeof currentHost:      ", typeof currentHost);
console.log("");


// ============================================
// SECCIÓN 4: CONVERSIONES EXPLÍCITAS
// ============================================
console.log("--- Conversiones ---");

// Convertir el precio (number) a String para mostrarlo con formato de texto
const priceAsText = String(itemQuantity);
console.log("Precio como texto:        ", priceAsText);
console.log("typeof (convertido):      ", typeof priceAsText);

// Convertir disponibilidad (boolean) a Number para operar con él
const availableAsNumber = Number(isAvailable);
console.log("Disponible como número:   ", availableAsNumber);
console.log("typeof (convertido):      ", typeof availableAsNumber);

console.log("");


// ============================================
// SECCIÓN 5: VALOR NULL
// ============================================
console.log("--- Valor nulo ---");

console.log("Anfitrión actual:  ", currentHost);
console.log("typeof null:       ", typeof currentHost);    // "object" ← bug histórico de JS
console.log("¿Es null?:         ", currentHost === null);  // true
console.log("");


// ============================================
// CIERRE
// ============================================
console.log("===========================");
console.log("Ficha creada por Cristian Martinez");
console.log("¡Descubre tu próximo destino vacacional con DreamStays!");
console.log("===========================");
