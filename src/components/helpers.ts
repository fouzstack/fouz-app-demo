export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
    value,
  );

// Format price in Cuban Peso (CUP) locale and currency
export const formatToCUP = (price: number) =>
  new Intl.NumberFormat('es-CU', {
    style: 'currency',
    currency: 'CUP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

// Función para redondear a dos decimales confiablemente
export const roundTwo = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

//export const roundTwo = (num: number) => Math.round(num * 100) / 100;
