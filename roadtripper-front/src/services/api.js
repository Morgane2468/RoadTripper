// Sera utilisé au Milestone 3 pour appeler l'API Node.js avec le token.
// Pour l'instant, l'application utilise des données simulées (mock).

const API_URL = 'http://localhost:3000/api'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('Session expirée')
  }

  return response.json()
}
