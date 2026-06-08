// Frontend runtime config, driven by Vite env vars (see .env / .env.example).
// Toggle the Works stub here so the backend need not be running.
export const config = {
  useStub: import.meta.env.VITE_USE_STUB === 'true',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
};
