const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';


/**
 * Enhanced fetch wrapper that prepends the API URL and handles common headers.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};

export default apiFetch;
