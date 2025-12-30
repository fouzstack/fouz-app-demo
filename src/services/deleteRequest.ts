export const deleteRequest = async (url: string, token?: string) => {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Registro eliminado:', data);
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
  }
};
