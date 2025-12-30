export function handleDatabaseError(error: any) {
  // Manejo de errores
  return `Error al guardar el Producto!. ${error.message}`;
}

export async function acyncFunctionHandler(fn: () => Promise<any>) {
  try {
    return await fn(); // Ejecutar la función pasada
  } catch (error) {
    return handleDatabaseError(error); // Manejo de errores estándar
  }
}

/*
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T; // Datos opcionales
  error?: string; // Mensaje de error opcional
}


export async function acyncFunctionHandler(fn: () => Promise<any>): Promise<ApiResponse<any>> {
  try {
    const result = await fn();
    return {
      success: true,
      message: 'Operacion exitosa.', // Mensaje de éxito
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error en la base de datos.', // Mensaje genérico
      error: error.message,
    };
  }
}*/
