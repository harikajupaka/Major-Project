const apiOrigin = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? 'https://major-project-backend-dw02.onrender.com' : '');

export function apiUrl(path) {
  return `${apiOrigin}${path}`;
}
