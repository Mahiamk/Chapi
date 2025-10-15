import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const res = await axios.delete(`${API_BASE_URL}/api/waitlist/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export default api

