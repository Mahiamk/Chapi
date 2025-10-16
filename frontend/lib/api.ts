import axios from 'axios'

function normalizeBaseUrl(url?: string) {
  if (!url) return ''
  let u = url.trim()
  // strip trailing slashes
  u = u.replace(/\/+$/, '')
  // strip a trailing "/api" segment if present (we append "/api/..." in calls)
  u = u.replace(/\/api$/, '')
  return u
}

const API_BASE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL)
if (typeof console !== 'undefined') {
  // helpful in browser to verify configuration
  console.log('API Base URL (raw):', process.env.NEXT_PUBLIC_API_URL)
  console.log('API Base URL (normalized):', API_BASE_URL)
  if (!API_BASE_URL && process.env.NODE_ENV === 'production') {
    console.error('Missing NEXT_PUBLIC_API_URL in production build; API calls will go to the frontend origin and 404.')
  }
}


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})


// Waitlist API
export const signupWaitlist = async (email: string) => {
  const response = await api.post('/api/waitlist/signup', { email })
  return response.data
}

export const getWaitlistCount = async () => {
  const response = await api.get('/api/waitlist/count')
  return response.data
}

// Admin API
export const adminLogin = async (password: string) => {
  const response = await api.post('/api/auth/login', { password })
  return response.data
}

export const getWaitlistSignups = async (token: string) => {
  const response = await api.get('/api/waitlist/list', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function deleteSignup(id: number, token: string) {
  const res = await api.delete(`/api/waitlist/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}


export default api

