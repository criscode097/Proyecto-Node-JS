// ============================================
// PROYECTO SEMANA 03: Calculadora de Dominio
// ============================================
// Adapta este archivo a tu dominio asignado.
//
// Ejemplos con dominios no asignables:
// - Planetario    → calcular ingresos por función, capacidad disponible
// - Acuario       → calcular costo de alimentación, volumen total de tanques
// - Museo         → calcular valor de exhibición, costo de entrada
// - Zoológico     → calcular gasto diario por especie, total de visitantes
// - Observatorio  → calcular duración total de eventos, aforo restante
// ============================================

// ============================================
// SECCIÓN 1: Datos del dominio
// ============================================

// Precio base por noche de un alojamiento estándar en la plataforma (COP)
const PRICE_PER_NIGHT = 450_000;

// Número de noches de la reserva
const NIGHTS = 5;

// Porcentaje de comisión que cobra la plataforma al anfitrión
const PLATFORM_FEE_RATE = 0.15;

// Costo fijo del servicio de limpieza por reserva
const CLEANING_FEE = 80_000;

// Capacidad máxima de huéspedes permitida en el alojamiento
const MAX_GUESTS = 6;

// Número de huéspedes en la reserva actual
const CURRENT_GUESTS = 4;


// ============================================
// SECCIÓN 2: Operaciones aritméticas
// ============================================
console.log("=== Operaciones básicas ===");

// Subtotal: precio por noche × número de noches
const subtotal = PRICE_PER_NIGHT * NIGHTS;
console.log("Subtotal estadía (5 noches):", subtotal, "COP");

// Total con tarifa de limpieza incluida
const totalWithCleaning = subtotal + CLEANING_FEE;
console.log("Total con limpieza:", totalWithCleaning, "COP");

// Comisión que retiene la plataforma
const platformCommission = subtotal * PLATFORM_FEE_RATE;
console.log("Comisión de la plataforma (15%):", platformCommission, "COP");

// Monto que recibe el anfitrión
const hostEarnings = subtotal - platformCommission;
console.log("Ganancias del anfitrión:", hostEarnings, "COP");

// Huéspedes disponibles antes de llegar al límite
const availableGuestSlots = MAX_GUESTS - CURRENT_GUESTS;
console.log("Cupos disponibles en el alojamiento:", availableGuestSlots);

// Costo promedio por huésped
const costPerGuest = totalWithCleaning / CURRENT_GUESTS;
console.log("Costo promedio por huésped:", costPerGuest, "COP");

// Precio por noche elevado al cuadrado (uso del operador **)
const priceSquared = PRICE_PER_NIGHT ** 2;
console.log("Precio al cuadrado (demostración **):", priceSquared);

// Resto de dividir los huéspedes entre 2 (uso del operador %)
const guestsParity = CURRENT_GUESTS % 2;
const guestsParityText = guestsParity === 0 ? "par" : "impar";
console.log("¿Número de huéspedes es par o impar?:", CURRENT_GUESTS, "huéspedes →", guestsParityText);

console.log("");

// ============================================
// SECCIÓN 3: Asignación compuesta
// ============================================
console.log("=== Asignación compuesta ===");

// Simulación de una cuenta acumulada de servicios adicionales
let extraServicesTotal = 0;
console.log("Total servicios adicionales inicial:", extraServicesTotal, "COP");

// Se agrega transporte al aeropuerto
extraServicesTotal += 120_000;
console.log("Tras agregar transporte:", extraServicesTotal, "COP");

// Se agrega tour guiado por la ciudad
extraServicesTotal += 95_000;
console.log("Tras agregar tour guiado:", extraServicesTotal, "COP");

// Se aplica un descuento del 10% por ser cliente frecuente
extraServicesTotal *= 0.90;
console.log("Con descuento cliente frecuente (10%):", extraServicesTotal, "COP");

// Se descuenta un bono de bienvenida de la plataforma
extraServicesTotal -= 20_000;
console.log("Tras aplicar bono de bienvenida:", extraServicesTotal, "COP");

// El costo se divide entre los huéspedes para repartirlo
extraServicesTotal /= CURRENT_GUESTS;
console.log("Costo por huésped (servicios extra):", extraServicesTotal, "COP");

console.log("");

// ============================================
// SECCIÓN 4: Comparación estricta
// ============================================
console.log("=== Validaciones con === ===");

// ¿El alojamiento está completamente lleno?
const isFullyBooked = CURRENT_GUESTS === MAX_GUESTS;
console.log("¿Alojamiento completamente lleno?", isFullyBooked);

// ¿La estadía es exactamente de una semana?
const isWeeklyStay = NIGHTS === 7;
console.log("¿La estadía es de exactamente 7 noches?", isWeeklyStay);

// ¿El total supera el millón de pesos?
const exceedsOneMillion = totalWithCleaning > 1_000_000;
console.log("¿El total supera $1.000.000 COP?", exceedsOneMillion);

// ¿La comisión es menor al precio de una noche?
const commissionLowerThanNight = platformCommission < PRICE_PER_NIGHT;
console.log("¿La comisión es menor al precio de una noche?", commissionLowerThanNight);

// ¿Hay al menos un cupo disponible?
const hasAvailableSlot = availableGuestSlots >= 1;
console.log("¿Hay al menos un cupo disponible?", hasAvailableSlot);

console.log("");

// ============================================
// SECCIÓN 5: Operadores lógicos
// ============================================
console.log("=== Condiciones lógicas ===");

const isVerifiedHost = true;
const hasGoodRating = true;
const isHighSeason = false;
const guestHasMembership = true;

// El alojamiento se recomienda si el anfitrión está verificado Y tiene buena calificación
const isRecommended = isVerifiedHost && hasGoodRating;
console.log("¿Alojamiento recomendado?", isRecommended);

// Se aplica tarifa de temporada alta si es alta temporada O si el total supera $2.000.000
const applyHighSeasonRate = isHighSeason || totalWithCleaning > 2_000_000;
console.log("¿Aplicar tarifa de temporada alta?", applyHighSeasonRate);

// El huésped califica para descuento si tiene membresía Y la estadía es de más de 3 noches
const qualifiesForDiscount = guestHasMembership && NIGHTS > 3;
console.log("¿Huésped califica para descuento?", qualifiesForDiscount);

// El alojamiento NO está disponible si está completamente lleno
const isUnavailable = !isFullyBooked;
console.log("¿Alojamiento disponible para más huéspedes?", isUnavailable);

// Confirmar reserva si hay cupos disponibles Y el anfitrión está verificado
const canConfirmBooking = hasAvailableSlot && isVerifiedHost;
console.log("¿Se puede confirmar la reserva?", canConfirmBooking);

console.log("");

// ============================================
// SECCIÓN 6: Resumen final
// ============================================
console.log("=== Resumen ===");

console.log("Dominio:                    Plataforma de Alquiler Vacacional - DreamStays");
console.log("Alojamiento:                Villa Sunset Cartagena");
console.log(`Noches reservadas:          ${NIGHTS}`);
console.log(`Huéspedes:                  ${CURRENT_GUESTS} de ${MAX_GUESTS} máximo`);
console.log(`Subtotal estadía:           ${subtotal} COP`);
console.log(`Tarifa de limpieza:         ${CLEANING_FEE} COP`);
console.log(`Total a pagar:              ${totalWithCleaning} COP`);
console.log(`Comisión plataforma (15%):  ${platformCommission} COP`);
console.log(`Ganancias del anfitrión:    ${hostEarnings} COP`);
console.log(`¿Reserva confirmada?:       ${canConfirmBooking}`);
console.log(`¿Recomendado?:              ${isRecommended}`);

console.log("");
console.log("Ficha creada por Cristian Martinez");
console.log("¡Descubre tu próximo destino vacacional con DreamStays!");
