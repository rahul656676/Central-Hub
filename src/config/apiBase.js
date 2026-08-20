// In production, this would be determined by environment variables
// allowing the single React build to run at both Central HQ and Local Sites.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
