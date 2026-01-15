/**
 * API Configuration
 * Base URL for backend API
 */

// For development: use your local machine's IP address
// Find your IP: Windows (ipconfig), Mac/Linux (ifconfig)
// Example: 'http://192.168.1.100:8000'
// For Expo Go: use your computer's local IP, not localhost!

export const API_BASE_URL = __DEV__
  ? 'http://192.168.1.54:8000' // ✅ Your local IP (from Expo terminal)
  : 'https://api.yourdomain.com'; // Production URL

export const API_BASE = `${API_BASE_URL}/api`;
