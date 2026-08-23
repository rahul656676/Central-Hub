import { API_BASE_URL } from '../config/apiBase';

export async function saveUseCaseConfig(payload) {
  try {
    const response = await fetch(API_BASE_URL + '/usecases/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save use case configuration');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving config:', error);
    throw error;
  }
}
