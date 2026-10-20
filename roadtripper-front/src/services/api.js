// Pas encore utilisé : servira au Milestone 3 pour appeler l'API Node.js avec le token.
const API_URL = 'http://localhost:3000/api'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')

  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(API_URL + path, { ...options, headers })

  // Token refusé ou expiré : on déconnecte l'utilisateur
  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return response.json()
}
