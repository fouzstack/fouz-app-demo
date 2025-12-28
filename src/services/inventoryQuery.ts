export const inventoryQuery = async () => {
  try {
    const response = await fetch(
      'http://localhost:8000/api/inventory/current',
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

    const inventory = await response.json();
    return inventory;
  } catch (err) {
    console.log(err);
  } finally {
  }
};
