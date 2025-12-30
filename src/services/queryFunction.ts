export const queryFunction = async (url: string) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`Error al hacer la solicitud: ${response.status}`);
    }
    const payload = await response.json();
    return payload;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
};
