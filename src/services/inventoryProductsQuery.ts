export const inventoryProductsQuery = async () => {
  try {
    const response = await fetch(
      'http://localhost:8000/api/inventory/products',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agregar aquí otros headers necesarios como Authorization
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`,
      );
    }

    const inventoryProducts = await response.json();
    return inventoryProducts;
  } catch (err) {
    console.log(err);
  } finally {
  }
};
