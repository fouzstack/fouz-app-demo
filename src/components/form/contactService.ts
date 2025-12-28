import { ContactInterface } from '../../schemas/contact.schema.ts';

const formspree_url = 'https://formspree.io/f/xdovlonj';

export async function contactService(data: ContactInterface) {
  try {
    const response = await fetch(formspree_url, {
      cache: 'no-cache',
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}
