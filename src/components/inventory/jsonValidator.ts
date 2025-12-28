import { jsonrepair } from 'jsonrepair';
import { roundTwo } from '../helpers';
import { InventoryType, ProductType } from '../../models/models';

// Interfaz EXACTA que coincide con el backend Java
export interface ExportJsonData {
  id?: number;
  seller: string;
  time: string;
  date: string;
  created_at?: string;
  updated_at?: string;
  products: Array<{
    id?: number;
    code: string;
    name: string;
    unit: string;
    cost: number;
    price: number;
    initial_products: number;
    incoming_products: number;
    losses: number;
    final_products: number | null;
    created_at?: string;
    updated_at?: string;
  }>;
}

// Detección de valores negativos (para ExportInventory)
export interface NegativeValueError {
  productCode: string;
  field: string;
  originalValue: number;
  absoluteValue: number;
}

// ============================================================================
// VALIDACIONES COMPARTIDAS
// ============================================================================

/**
 * Campos numéricos que NO pueden ser negativos
 * Usado tanto para validar como para limpiar datos
 */
export const NUMERIC_FIELDS = {
  REQUIRED_NON_NEGATIVE: [
    'cost',
    'price',
    'initial_products',
    'incoming_products',
    'losses',
  ] as const,
  OPTIONAL_NON_NEGATIVE: ['id', 'final_products'] as const,
  ALL_FIELDS: [
    'id',
    'cost',
    'price',
    'initial_products',
    'incoming_products',
    'losses',
    'final_products',
  ] as const,
};

/**
 * Validar que un número NO sea negativo
 * Si es negativo, retorna 0 (o null para campos opcionales)
 */
export const validateNonNegativeNumber = (
  value: any,
  field: string,
): number => {
  if (value === null || value === undefined || value === '') return 0;

  const num = Number(value);
  if (isNaN(num)) return 0;

  // Validación de NO NEGATIVOS
  if (num < 0) {
    console.warn(
      `⚠️  Valor negativo detectado en campo "${field}": ${num}. Corrigiendo a 0.`,
    );
    return 0;
  }

  return roundTwo(num);
};

/**
 * Validar número que puede ser null pero NO negativo
 */
export const validateNullableNonNegativeNumber = (
  value: any,
  field: string,
): number | null => {
  if (value === null || value === undefined || value === '') return null;

  const num = Number(value);
  if (isNaN(num)) return null;

  // Validación de NO NEGATIVOS
  if (num < 0) {
    console.warn(
      `⚠️  Valor negativo detectado en campo "${field}": ${num}. Corrigiendo a 0.`,
    );
    return 0; // No a null, sino a 0 para evitar negativos
  }

  return roundTwo(num);
};

/**
 * Detectar valores negativos SIN corregirlos (para mostrar al usuario)
 */
export const detectNegativeValues = (
  value: any,
  productCode: string,
  field: string,
): NegativeValueError | null => {
  if (value === null || value === undefined || value === '') return null;

  const num = Number(value);
  if (isNaN(num)) return null;

  if (num < 0) {
    return {
      productCode,
      field,
      originalValue: num,
      absoluteValue: roundTwo(Math.abs(num)),
    };
  }

  return null;
};

// ============================================================================
// LIMPIEZA DE JSON (para ImportInventory)
// ============================================================================

/**
 * Limpiar texto JSON (maneja pretty print, BOM, etc.)
 */
export const cleanJsonText = (rawText: string): string => {
  try {
    // 1. Remover BOM si existe
    let text = rawText.trim().replace(/^\uFEFF/, '');

    // 2. Remover comentarios (por seguridad)
    text = text.replace(/\/\/.*?$|#.*?$/gm, '');

    // 3. Manejar comas finales
    text = text.replace(/,\s*([}\]])/g, '$1');

    // 4. Extraer objeto JSON
    const match = text.match(/({[\s\S]*}|\[[\s\S]*\])/);
    if (!match) {
      throw new Error('No se encontró un objeto/array JSON válido');
    }

    return match[1];
  } catch (err) {
    throw new Error(`Error limpiando JSON: ${(err as Error).message}`);
  }
};

/**
 * Reparar JSON si está corrupto
 */
export const repairJsonIfNeeded = (jsonString: string): string => {
  try {
    // Intentar parsear directamente
    JSON.parse(jsonString);
    return jsonString;
  } catch {
    try {
      // Si falla, intentar reparar
      return jsonrepair(jsonString);
    } catch (error) {
      throw new Error(
        `No se pudo reparar el JSON: ${(error as Error).message}`,
      );
    }
  }
};

// ============================================================================
// VALIDACIÓN ESTRUCTURAL (para ambos componentes)
// ============================================================================

/**
 * Validación estricta basada en JsonNormalizer.normalizeJsonForImport()
 * Solo valida, no modifica - igual que el backend Java
 */
export const validateImportData = (data: any): ExportJsonData => {
  // Validaciones básicas (igual que Java)
  if (!data || typeof data !== 'object') {
    throw new Error('Datos JSON inválidos: no es un objeto');
  }

  // Validar seller (campo requerido)
  if (
    !data.seller ||
    typeof data.seller !== 'string' ||
    data.seller.trim() === ''
  ) {
    throw new Error('Campo "seller" inválido o faltante');
  }

  // Validar products (campo requerido)
  if (!Array.isArray(data.products)) {
    throw new Error('Campo "products" debe ser un array');
  }

  if (data.products.length === 0) {
    throw new Error('Array "products" no puede estar vacío');
  }

  // Validar cada producto (estructura exacta)
  data.products.forEach((product: any, index: number) => {
    // Campos requeridos
    const requiredFields = [
      'code',
      'name',
      'unit',
      'cost',
      'price',
      'initial_products',
      'incoming_products',
      'losses',
    ];

    requiredFields.forEach((field) => {
      if (product[field] === undefined) {
        throw new Error(`Producto ${index + 1}: campo "${field}" es requerido`);
      }
    });

    // Validar tipos
    if (typeof product.code !== 'string' || product.code.trim() === '') {
      throw new Error(`Producto ${index + 1}: "code" debe ser texto no vacío`);
    }

    if (typeof product.name !== 'string' || product.name.trim() === '') {
      throw new Error(`Producto ${index + 1}: "name" debe ser texto no vacío`);
    }

    if (typeof product.unit !== 'string' || product.unit.trim() === '') {
      throw new Error(`Producto ${index + 1}: "unit" debe ser texto no vacío`);
    }

    // Validar números (permitiendo decimales)
    if (typeof product.cost !== 'number' || isNaN(product.cost)) {
      throw new Error(`Producto ${index + 1}: "cost" debe ser número válido`);
    }

    if (typeof product.price !== 'number' || isNaN(product.price)) {
      throw new Error(`Producto ${index + 1}: "price" debe ser número válido`);
    }

    // Validar campos de cantidad (permitiendo decimales)
    const quantityFields = ['initial_products', 'incoming_products', 'losses'];
    quantityFields.forEach((field) => {
      if (typeof product[field] !== 'number' || isNaN(product[field])) {
        throw new Error(
          `Producto ${index + 1}: "${field}" debe ser número válido`,
        );
      }
    });

    // final_products puede ser null o número (decimal permitido)
    if (
      product.final_products !== null &&
      product.final_products !== undefined
    ) {
      if (
        typeof product.final_products !== 'number' ||
        isNaN(product.final_products)
      ) {
        throw new Error(
          `Producto ${index + 1}: "final_products" debe ser número válido o null`,
        );
      }
    }
  });

  // Validar formatos de fecha/hora
  if (data.time && typeof data.time !== 'string') {
    throw new Error('Campo "time" debe ser texto');
  }

  if (data.date && typeof data.date !== 'string') {
    throw new Error('Campo "date" debe ser texto');
  }

  // Devolver como ExportJsonData
  return data as ExportJsonData;
};

// ============================================================================
// TRANSFORMACIÓN DE DATOS (para ImportInventory)
// ============================================================================

/**
 * Transforma ExportJsonData a InventoryType preservando IDs
 * - Inventario: ID siempre = 1
 * - Productos: Preserva IDs originales o genera nuevos
 */
export const transformToInventoryType = (
  data: ExportJsonData,
): InventoryType => {
  const now = new Date();
  const defaultDate = now.toISOString();

  // Crear el objeto base del inventario
  const inventoryData: InventoryType = {
    id: 1, // ID del inventario - SIEMPRE 1
    seller: data.seller.trim(),
    time:
      data.time ||
      now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    date: data.date || now.toISOString().split('T')[0],
    created_at: data.created_at || defaultDate,
    updated_at: data.updated_at || defaultDate,
    products: [],
  };

  // Procesar cada producto preservando/generando IDs únicos
  inventoryData.products = data.products.map((product, index) => {
    // Determinar el ID del producto
    let productId: number;

    if (product.id !== undefined && product.id !== null) {
      const parsedId = Math.floor(Number(product.id));
      if (!isNaN(parsedId) && parsedId > 0) {
        // ID original válido
        productId = parsedId;
      } else {
        // ID original inválido, generar nuevo
        console.warn(
          `ID inválido para producto ${index} (${product.code}), generando nuevo ID`,
        );
        productId = index + 1000; // +1000 para evitar conflictos
      }
    } else {
      // No viene ID, generar uno único
      productId = index + 1000;
    }

    // Crear objeto de producto
    const productData: ProductType = {
      id: productId,
      code: String(product.code).trim(),
      name: String(product.name).trim(),
      unit: String(product.unit).trim(),
      cost: roundTwo(Number(product.cost) || 0),
      price: roundTwo(Number(product.price) || 0),
      initial_products: roundTwo(Number(product.initial_products) || 0),
      incoming_products: roundTwo(Number(product.incoming_products) || 0),
      losses: roundTwo(Number(product.losses) || 0),
      final_products:
        product.final_products !== undefined && product.final_products !== null
          ? roundTwo(Number(product.final_products))
          : null,
      created_at: product.created_at || defaultDate,
      updated_at: product.updated_at || defaultDate,
    };

    return productData;
  });

  // Log de diagnóstico
  console.log('✅ Transformación completada:', {
    inventarioId: inventoryData.id,
    totalProductos: inventoryData.products.length,
    idsProductos: inventoryData.products.map((p) => p.id),
  });

  return inventoryData;
};

// ============================================================================
// PREPARACIÓN PARA EXPORTACIÓN (para ExportInventory)
// ============================================================================

/**
 * Preparar datos para exportación aplicando validaciones
 * Corrige automáticamente valores negativos a 0
 */
export const prepareExportData = async (
  rawInventoryData: any,
  seller: string,
): Promise<ExportJsonData> => {
  if (!rawInventoryData) {
    throw new Error('No hay datos de inventario para exportar');
  }

  let inventoryData: any;
  let products: any[] = [];

  // Normalizar estructura de datos
  if (Array.isArray(rawInventoryData)) {
    inventoryData = rawInventoryData[0] || {};
    products = inventoryData.products || [];
  } else {
    inventoryData = rawInventoryData;
    products = rawInventoryData.products || [];
  }

  // Procesar productos aplicando validaciones
  const cleanProducts = products.map((product: any) => {
    const cleanProduct: any = {
      code: String(product.code || '').trim(),
      name: String(product.name || '').trim(),
      unit: String(product.unit || '').trim(),
      cost: validateNonNegativeNumber(product.cost, 'cost'),
      price: validateNonNegativeNumber(product.price, 'price'),
      initial_products: validateNonNegativeNumber(
        product.initial_products,
        'initial_products',
      ),
      incoming_products: validateNonNegativeNumber(
        product.incoming_products,
        'incoming_products',
      ),
      losses: validateNonNegativeNumber(product.losses, 'losses'),
    };

    // ID opcional
    if (product.id !== undefined) {
      const idValue = validateNonNegativeNumber(product.id, 'id');
      if (idValue !== 0) cleanProduct.id = idValue;
    }

    // final_products puede ser null, pero NO negativo
    cleanProduct.final_products = validateNullableNonNegativeNumber(
      product.final_products,
      'final_products',
    );

    // Preservar metadatos si existen
    if (product.created_at)
      cleanProduct.created_at = String(product.created_at);
    if (product.updated_at)
      cleanProduct.updated_at = String(product.updated_at);

    return cleanProduct;
  });

  // Crear objeto de exportación
  const exportData: ExportJsonData = {
    seller: seller.trim(),
    time: inventoryData.time
      ? String(inventoryData.time)
      : new Date().toLocaleTimeString(),
    date: inventoryData.date
      ? String(inventoryData.date)
      : new Date().toISOString().split('T')[0],
    products: cleanProducts,
  };

  // ID opcional del inventario
  if (inventoryData.id !== undefined) {
    const idValue = validateNonNegativeNumber(inventoryData.id, 'inventory_id');
    if (idValue !== 0) exportData.id = idValue;
  }

  // Preservar metadatos si existen
  if (inventoryData.created_at)
    exportData.created_at = String(inventoryData.created_at);
  if (inventoryData.updated_at)
    exportData.updated_at = String(inventoryData.updated_at);

  return exportData;
};

/**
 * Detectar TODOS los valores negativos en los datos
 * Usado para mostrar advertencia antes de exportar
 */
export const detectAllNegativeValues = (rawData: any): NegativeValueError[] => {
  const negatives: NegativeValueError[] = [];

  if (!rawData) return negatives;

  let inventoryData: any;
  let products: any[] = [];

  // Normalizar estructura
  if (Array.isArray(rawData)) {
    inventoryData = rawData[0] || {};
    products = inventoryData.products || [];
  } else {
    inventoryData = rawData;
    products = rawData.products || [];
  }

  // Revisar cada producto
  products.forEach((product: any) => {
    // Revisar todos los campos numéricos
    NUMERIC_FIELDS.ALL_FIELDS.forEach((field) => {
      if (product[field] !== undefined) {
        const negativeDetected = detectNegativeValues(
          product[field],
          product.code,
          field,
        );
        if (negativeDetected) {
          negatives.push(negativeDetected);
        }
      }
    });
  });

  return negatives;
};

/**
 * Aplicar corrección de valores negativos según la acción seleccionada
 * 'abs' → Convierte a valor absoluto
 * 'zero' → Convierte a 0
 */
export const correctNegativeValues = (
  exportData: ExportJsonData,
  action: 'abs' | 'zero',
): ExportJsonData => {
  const corrected = { ...exportData };

  corrected.products = corrected.products.map((product) => {
    const correctedProduct = { ...product };

    // Aplicar corrección a todos los campos numéricos
    NUMERIC_FIELDS.ALL_FIELDS.forEach((field) => {
      if (
        correctedProduct[field as keyof typeof correctedProduct] !== undefined
      ) {
        const value = correctedProduct[field as keyof typeof correctedProduct];

        if (typeof value === 'number' && value < 0) {
          if (action === 'abs') {
            (correctedProduct as any)[field] = roundTwo(Math.abs(value));
          } else {
            // 'zero'
            (correctedProduct as any)[field] = 0;
          }
        }
      }
    });

    return correctedProduct;
  });

  return corrected;
};

// ============================================================================
// UTILIDADES PARA MENSAJES DE ERROR
// ============================================================================

/**
 * Obtener mensaje de error amigable para el usuario
 */
export const getFriendlyErrorMessage = (
  error: Error,
): { title: string; message: string } => {
  const errorMessage = error.message.toLowerCase();

  if (
    errorMessage.includes('json inválido') ||
    errorMessage.includes('unexpected token')
  ) {
    return {
      title: 'Archivo JSON Inválido',
      message: 'El archivo no contiene JSON válido o está mal formado.',
    };
  } else if (
    errorMessage.includes('required') ||
    errorMessage.includes('faltante')
  ) {
    return {
      title: 'Campos Faltantes',
      message: 'El archivo JSON no contiene todos los campos requeridos.',
    };
  } else if (errorMessage.includes('debe ser número')) {
    return {
      title: 'Valores Numéricos Inválidos',
      message: 'Algunos campos numéricos tienen valores incorrectos.',
    };
  } else if (
    errorMessage.includes('products') &&
    errorMessage.includes('array')
  ) {
    return {
      title: 'Estructura Inválida',
      message: 'El campo "products" debe ser un array de productos.',
    };
  } else if (errorMessage.includes('no hay datos')) {
    return {
      title: 'Sin Datos',
      message: 'No hay datos de inventario para exportar.',
    };
  } else {
    return {
      title: 'Error',
      message: 'Ocurrió un error inesperado. Por favor, intente nuevamente.',
    };
  }
};

/**
 * Generar resumen de validación para mostrar al usuario
 */
export const getValidationSummary = (data: ExportJsonData) => {
  return {
    seller: data.seller,
    productCount: data.products.length,
    hasNegativeValues: data.products.some((p) =>
      NUMERIC_FIELDS.ALL_FIELDS.some((field) => {
        const value = (p as any)[field];
        return typeof value === 'number' && value < 0;
      }),
    ),
    nullFinalProducts: data.products.filter((p) => p.final_products === null)
      .length,
  };
};

export default {
  // Constantes
  NUMERIC_FIELDS,

  // Validaciones básicas
  validateNonNegativeNumber,
  validateNullableNonNegativeNumber,
  detectNegativeValues,

  // Limpieza de JSON
  cleanJsonText,
  repairJsonIfNeeded,

  // Validación estructural
  validateImportData,

  // Transformación
  transformToInventoryType,

  // Preparación para exportación
  prepareExportData,
  detectAllNegativeValues,
  correctNegativeValues,

  // Utilidades
  getFriendlyErrorMessage,
  getValidationSummary,
};
