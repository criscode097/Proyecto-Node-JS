// ============================================
// PROYECTO SEMANA 05: Clasificador
// Condicionales — if/else, ternario, switch, ??, ?.
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este script a tu dominio asignado.
// Reemplaza los comentarios TODO con tu propia implementación.
// Usa los conceptos aprendidos esta semana.
//
// Ejecuta con: node starter/script.js
// ============================================

// ============================================
// SECCIÓN 1: Datos del elemento de tu dominio
// ============================================

// Nombre del alojamiento registrado en la plataforma
const elementName = "Villa Sunset Cartagena";

// Estado actual del alojamiento en la plataforma
const elementStatus = "active";

// Porcentaje de ocupación del alojamiento en el último mes (0 a 100)
const elementValue = 78;

// Tipo de alojamiento
const elementType = "villa";

// Información adicional del alojamiento (puede ser null si aún no se ha completado)
const elementInfo = {
  detail: "Incluye piscina privada y acceso directo a la playa",
  location: "Cartagena de Indias, Colombia",
  rating: 4.8
};


// ============================================
// SECCIÓN 2: Clasificación con if / else if / else
// ============================================

// Clasifica el alojamiento según su porcentaje de ocupación del último mes
let classification;
if (elementValue >= 80) {
  classification = "Alta demanda";
} else if (elementValue >= 50) {
  classification = "Demanda moderada";
} else if (elementValue >= 20) {
  classification = "Baja demanda";
} else {
  classification = "Sin actividad";
}

// ============================================
// SECCIÓN 3: Estado binario con operador ternario
// ============================================

// Traduce el estado interno ("active" / "inactive") a una etiqueta legible
const statusLabel = elementStatus === "active" ? "Activo" : "Inactivo";

// ============================================
// SECCIÓN 4: Tipo con switch
// ============================================

// Asigna una etiqueta descriptiva según el tipo de alojamiento
let typeLabel;
switch (elementType) {
  case "villa":
    typeLabel = "Villa de lujo";
    break;
  case "apartment":
    typeLabel = "Apartamento";
    break;
  case "cabin":
    typeLabel = "Cabaña rural";
    break;
  case "house":
    typeLabel = "Casa completa";
    break;
  default:
    typeLabel = "Tipo desconocido";
}

// ============================================
// SECCIÓN 5: Valor por defecto con ??
// ============================================

// Si el nombre del alojamiento es null o undefined, muestra un texto por defecto
const displayName = elementName ?? "Sin nombre";

// Accede al detalle del alojamiento; si no existe, muestra un mensaje por defecto
const infoDetail = elementInfo?.detail ?? "Sin información adicional";

// ============================================
// SECCIÓN 6: Acceso seguro con ?.
// ============================================

// Accede a la ubicación del alojamiento de forma segura por si elementInfo es null
const safeProperty = elementInfo?.location ?? "Ubicación no especificada";

// Accede a la calificación del alojamiento de forma segura
const safeRating = elementInfo?.rating ?? "Sin calificación";

// ============================================
// SECCIÓN 7: Ficha de salida
// ============================================

console.log("=".repeat(40));
console.log("   DREAMSTAYS — FICHA DE CLASIFICACIÓN");
console.log("=".repeat(40));
console.log(`Nombre:               ${displayName}`);
console.log(`Estado:               ${statusLabel}`);
console.log(`Tipo:                 ${typeLabel}`);
console.log(`Ocupación último mes: ${elementValue}%`);
console.log(`Clasificación:        ${classification}`);
console.log(`Ubicación:            ${safeProperty}`);
console.log(`Calificación:         ${safeRating} / 5`);
console.log(`Detalle:              ${infoDetail}`);
console.log("=".repeat(40));
console.log("");
console.log("Ficha creada por Cristian Martinez");
console.log("¡Descubre tu próximo destino vacacional con DreamStays!");
