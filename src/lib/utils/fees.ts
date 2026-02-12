// src/lib/utils/fees.ts
// 💰 SISTEMA DE COMISIONES Y FEES - SEINA MARKET

/**
 * Configuración de fees del marketplace
 */
export const FEE_CONFIG = {
  // Fee base del marketplace (%)
  BASE_FEE: 5.0,           // 5% por defecto
  
  // Fee mínimo absoluto (en pesos chilenos)
  MIN_FEE: 100,            // $100 CLP mínimo
  
  // Descuentos por nivel de usuario
  LEVEL_DISCOUNTS: {
    1: 0,      // Sin descuento
    5: 0.5,    // -0.5% (fee = 4.5%)
    10: 1.0,   // -1% (fee = 4%)
    20: 1.5,   // -1.5% (fee = 3.5%)
    30: 2.0,   // -2% (fee = 3%)
    40: 2.5,   // -2.5% (fee = 2.5%)
    50: 3.0,   // -3% (fee = 2%)
  },
  
  // Descuentos por tipo de usuario
  USER_TYPE_DISCOUNTS: {
    USER: 0,         // Usuario normal
    TIENDA: 1.0,     // Tiendas -1%
    DISTRIBUIDOR: 2.0 // Distribuidores -2%
  },
  
  // Fee para subastas (generalmente más alto)
  AUCTION_FEE: 7.5,  // 7.5% para subastas
};

/**
 * Calcular fee aplicable según nivel del usuario
 */
export function getFeeByLevel(userLevel: number): number {
  let discount = 0;
  
  // Encontrar el descuento correspondiente
  const levelThresholds = Object.keys(FEE_CONFIG.LEVEL_DISCOUNTS)
    .map(Number)
    .sort((a, b) => b - a); // Ordenar de mayor a menor
  
  for (const threshold of levelThresholds) {
    if (userLevel >= threshold) {
      discount = FEE_CONFIG.LEVEL_DISCOUNTS[threshold as keyof typeof FEE_CONFIG.LEVEL_DISCOUNTS];
      break;
    }
  }
  
  const finalFee = FEE_CONFIG.BASE_FEE - discount;
  return Math.max(0, finalFee); // Nunca negativo
}

/**
 * Calcular fee según tipo de usuario
 */
export function getFeeByUserType(userType: string): number {
  const discount = FEE_CONFIG.USER_TYPE_DISCOUNTS[userType as keyof typeof FEE_CONFIG.USER_TYPE_DISCOUNTS] || 0;
  const finalFee = FEE_CONFIG.BASE_FEE - discount;
  return Math.max(0, finalFee);
}

/**
 * Calcular fee combinado (nivel + tipo de usuario)
 */
export function getEffectiveFee(userLevel: number, userType: string = "USER"): number {
  const levelDiscount = getFeeByLevel(userLevel) - FEE_CONFIG.BASE_FEE; // Obtener solo el descuento
  const typeDiscount = getFeeByUserType(userType) - FEE_CONFIG.BASE_FEE;
  
  // Sumar descuentos (no se acumulan, se toma el mejor)
  const totalDiscount = Math.max(Math.abs(levelDiscount), Math.abs(typeDiscount));
  
  const finalFee = FEE_CONFIG.BASE_FEE - totalDiscount;
  return Math.max(1.0, finalFee); // Mínimo 1%
}

/**
 * Calcular monto de fee en pesos chilenos
 */
export function calculateFeeAmount(
  salePrice: number,
  userLevel: number = 1,
  userType: string = "USER",
  isAuction: boolean = false
): {
  salePrice: number;
  feePercent: number;
  feeAmount: number;
  sellerReceives: number;
} {
  // Determinar porcentaje de fee
  const feePercent = isAuction 
    ? FEE_CONFIG.AUCTION_FEE 
    : getEffectiveFee(userLevel, userType);
  
  // Calcular monto
  let feeAmount = Math.floor((salePrice * feePercent) / 100);
  
  // Aplicar fee mínimo
  if (feeAmount < FEE_CONFIG.MIN_FEE) {
    feeAmount = FEE_CONFIG.MIN_FEE;
  }
  
  // Calcular lo que recibe el vendedor
  const sellerReceives = salePrice - feeAmount;
  
  return {
    salePrice,
    feePercent,
    feeAmount,
    sellerReceives
  };
}

/**
 * Calcular fee con descuento de item equipado
 */
export function calculateFeeWithItemBonus(
  salePrice: number,
  userLevel: number,
  userType: string,
  hasItemBonus: boolean = false,
  itemBonusPercent: number = 0
): {
  salePrice: number;
  baseFeePercent: number;
  itemBonus: number;
  finalFeePercent: number;
  feeAmount: number;
  sellerReceives: number;
  savings: number;
} {
  // Fee base
  const baseFeePercent = getEffectiveFee(userLevel, userType);
  
  // Aplicar bonus de item
  const itemBonus = hasItemBonus ? itemBonusPercent : 0;
  const finalFeePercent = Math.max(1.0, baseFeePercent - itemBonus);
  
  // Calcular montos
  const baseFeeAmount = Math.floor((salePrice * baseFeePercent) / 100);
  const finalFeeAmount = Math.floor((salePrice * finalFeePercent) / 100);
  
  const sellerReceives = salePrice - finalFeeAmount;
  const savings = baseFeeAmount - finalFeeAmount;
  
  return {
    salePrice,
    baseFeePercent,
    itemBonus,
    finalFeePercent,
    feeAmount: finalFeeAmount,
    sellerReceives,
    savings
  };
}

/**
 * Obtener preview de fee para mostrar al usuario
 */
export function getFeePreview(
  salePrice: number,
  userLevel: number,
  userType: string = "USER"
): string {
  const fee = calculateFeeAmount(salePrice, userLevel, userType);
  
  return `
Fee: ${fee.feePercent}% ($${fee.feeAmount.toLocaleString('es-CL')})
Recibirás: $${fee.sellerReceives.toLocaleString('es-CL')}
  `.trim();
}

/**
 * Validar si el precio es válido después del fee
 */
export function isValidPriceAfterFee(salePrice: number, minimumPayout: number = 500): boolean {
  const fee = calculateFeeAmount(salePrice);
  return fee.sellerReceives >= minimumPayout;
}

/**
 * Calcular precio sugerido para recibir un monto neto deseado
 */
export function calculateSuggestedPrice(
  desiredNetAmount: number,
  userLevel: number = 1,
  userType: string = "USER"
): number {
  const feePercent = getEffectiveFee(userLevel, userType);
  
  // Precio = NetoDeseado / (1 - Fee%)
  const suggestedPrice = Math.ceil(desiredNetAmount / (1 - feePercent / 100));
  
  return suggestedPrice;
}

/**
 * Obtener tabla de fees por nivel (para mostrar al usuario)
 */
export function getFeeTable(): Array<{
  level: number;
  feePercent: number;
  discount: number;
}> {
  const levels = [1, 5, 10, 20, 30, 40, 50];
  
  return levels.map(level => ({
    level,
    feePercent: getFeeByLevel(level),
    discount: FEE_CONFIG.BASE_FEE - getFeeByLevel(level)
  }));
}
