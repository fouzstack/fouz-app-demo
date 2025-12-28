export const httpGet = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`GET Error: ${response.status}`);
  return response.json();
};

export const httpPost = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`POST Error: ${response.status}`);
  return response.json();
};

export const httpPut = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`PUT Error: ${response.status}`);
  return response.json();
};

export const httpDelete = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`DELETE Error: ${response.status}`);
  return response.json();
};
