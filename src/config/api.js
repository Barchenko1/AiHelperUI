// Single place the UI learns where the server lives.
// REACT_APP_AI_API is the server's full base URL, including any routing prefix, e.g. https://host/aihelper
// The websocket URL is derived from it unless REACT_APP_AI_SOCKET overrides it.

const trimSlash = (url) => (url || '').replace(/\/+$/, '');

export function socketUrlFrom(apiBase) {
  return trimSlash(apiBase).replace(/^http/i, 'ws') + '/ws';
}

export const API_BASE = trimSlash(process.env.REACT_APP_AI_API);
export const SOCKET_URL = process.env.REACT_APP_AI_SOCKET || socketUrlFrom(API_BASE);

export const apiUrl = (path) => `${API_BASE}/api/v1${path}`;
