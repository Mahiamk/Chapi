'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Lock, Mail, Calendar, Users, LogOut, Eye, EyeOff, Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminLogin, getWaitlistSignups, deleteSignup } from '@/lib/api'
import { Trash2 } from 'lucide-react'


interface LoginForm {
  password: string
}

interface WaitlistSignup {
  id: number
  email: string
  created_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [signups, setSignups] = useState<WaitlistSignup[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [toggleVisible, setToggleVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { register, handleSubmit } = useForm<LoginForm>()

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const secondaryText = theme === 'dark' ? 'text-white/70' : 'text-gray-600'
  const borderColor = theme === 'dark' ? 'border-white/20' : 'border-gray-200'
  const glassBg = theme === 'dark' ? 'bg-white/10' : 'bg-white'
  const hoverBg = theme === 'dark' ? 'hover:bg-white/20' : 'hover:bg-gray-100'
  const loginBg = theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
  const loginCardBg = theme === 'dark' ? 'bg-white/10' : 'bg-white/90'
  const inputBg = theme === 'dark' ? 'bg-white/10' : 'bg-gray-50'
  const inputBorder = theme === 'dark' ? 'border-white/20' : 'border-gray-200'
  const inputText = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const inputPlaceholder = theme === 'dark' ? 'placeholder-white/60' : 'placeholder-gray-400'
  const inputFocus = theme === 'dark' ? 'focus:ring-white/50 focus:border-transparent' : 'focus:ring-blue-500 focus:border-blue-500'
  const inputIcon = theme === 'dark' ? 'text-white/60' : 'text-gray-500'
  const inputEye = theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900'
  const loginButtonBg = theme === 'dark' ? 'bg-white/20 hover:bg-white/30' : 'bg-blue-600 hover:bg-blue-700'
  const loginButtonText = theme === 'dark' ? 'text-white' : 'text-white'
  const spinnerBorder = theme === 'dark' ? 'border-white' : 'border-blue-600'
  const dashboardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
  const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const headerBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
  const headerText = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const headerSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const logoutText = theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const cardBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
  const statIconBg = theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100'
  const statIconText = theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
  const statText = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const statSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const tableBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const tableBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
  const theadBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
  const theadText = theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
  const tbodyDivide = theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
  const tbodyHover = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
  const tableText = theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
  const tableSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const emptyIcon = theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
  const emptyText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const toggleGlass = theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
  const toggleHover = theme === 'dark' ? 'hover:bg-white/20' : 'hover:bg-gray-200'
  const toggleIcon = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const toggleTransform = toggleVisible ? 'translate-y-0' : 'translate-y-[-100%]'

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsAuthenticated(true)
      fetchSignups(token)
    }
  }, [])
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    const interval = setInterval(() => {
      fetchSignups(token)
    }, 10000) // every 10 seconds

    return () => clearInterval(interval)
  }, [isAuthenticated])

  useEffect(() => {
    let ticking = false

    const updateScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setToggleVisible(false)
      } else {
        setToggleVisible(true)
      }
      setLastScrollY(currentScrollY)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const fetchSignups = async (token: string) => {
    try {
      const data = await getWaitlistSignups(token)
      setSignups(data)
    } catch (error: any) {
      console.error('Fetch signups error:', error)
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.')
        localStorage.removeItem('admin_token')
        setIsAuthenticated(false)
      } else {
        toast.error(`Failed to fetch signups: ${error.response?.data?.detail || error.message}`)
      }
    }
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const renderToggle = () => (
    <button
      onClick={toggleTheme}
      className={`${toggleGlass} backdrop-blur-sm p-2 rounded-full ${toggleHover} transition-all duration-300 fixed top-4 right-4 z-50 ${toggleTransform}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className={`w-5 h-5 ${toggleIcon}`} />
      ) : (
        <Moon className={`w-5 h-5 ${toggleIcon}`} />
      )}
    </button>
  )

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      console.log('Attempting login...')
      const response = await adminLogin(data.password)
      console.log('Login successful, token received:', response.access_token.substring(0, 20) + '...')
      localStorage.setItem('admin_token', response.access_token)
      setIsAuthenticated(true)
      console.log('Fetching signups with token...')
      await fetchSignups(response.access_token)
      toast.success('Login successful!')
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.detail || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setSignups([])
    toast.success('Logged out successfully')
  }
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this signup?")) return

    const token = localStorage.getItem('admin_token')
    if (!token) return toast.error('Not authenticated')

    try {
      await deleteSignup(id, token)
      toast.success('Signup deleted successfully')
      setSignups((prev) => prev.filter((s) => s.id !== id))
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error.response?.data?.detail || 'Failed to delete signup')
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        {renderToggle()}
        <div className={`min-h-screen ${loginBg} flex items-center justify-center p-4 relative`}>
          <div className="max-w-md w-full">
            <div className={`${loginCardBg} backdrop-blur-sm rounded-2xl p-8 shadow-xl ${borderColor}`}>
              <div className="text-center mb-8">
                <div className={`w-16 h-16 ${glassBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Lock className={`w-8 h-8 ${textColor}`} />
                </div>
                <h1 className={`text-2xl font-bold mb-2 ${textColor}`}>Admin Dashboard</h1>
                <p className={secondaryText}>Enter password to access waitlist data</p>
              </div>

              <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
                <div>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${inputIcon} w-5 h-5`} />
                    <input
                      {...register('password', { required: 'Password is required' })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      className={`w-full pl-10 pr-12 py-3 ${inputBg} ${inputBorder} rounded-lg ${inputText} ${inputPlaceholder} focus:ring-2 ${inputFocus} transition-all`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${inputEye} transition-colors`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${loginButtonBg} ${loginButtonText} py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <>
                      <div className={`w-5 h-5 border-2 ${spinnerBorder} border-t-transparent rounded-full animate-spin`}></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {renderToggle()}
      <div className={`min-h-screen ${dashboardBg} relative`}>
        {/* Header */}
        <header className={`${headerBg} shadow-sm ${headerBorder} border-b`}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-2xl font-bold ${headerText}`}>Waitlist Dashboard</h1>
                <p className={headerSecondary}>Manage and view waitlist signups</p>
              </div>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${logoutText}`}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className={`${cardBg} rounded-lg shadow-sm p-6 ${cardBorder}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${statIconBg} rounded-lg flex items-center justify-center`}>
                  <Users className={`w-6 h-6 ${statIconText}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${statText}`}>{signups.length}</p>
                  <p className={statSecondary}>Total Signups</p>
                </div>
              </div>
            </div>

            <div className={`${cardBg} rounded-lg shadow-sm p-6 ${cardBorder}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-green-900/20 dark:bg-green-900/20 rounded-lg flex items-center justify-center`}>
                  <Calendar className="w-6 h-6 text-green-400 dark:text-green-400" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${statText}`}>
                    {signups.filter(s => {
                      const signupDate = new Date(s.created_at)
                      const today = new Date()
                      return signupDate.toDateString() === today.toDateString()
                    }).length}
                  </p>
                  <p className={statSecondary}>Today</p>
                </div>
              </div>
            </div>

            <div className={`${cardBg} rounded-lg shadow-sm p-6 ${cardBorder}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-purple-900/20 dark:bg-purple-900/20 rounded-lg flex items-center justify-center`}>
                  <Mail className="w-6 h-6 text-purple-400 dark:text-purple-400" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${statText}`}>
                    {signups.filter(s => {
                      const signupDate = new Date(s.created_at)
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return signupDate >= weekAgo
                    }).length}
                  </p>
                  <p className={statSecondary}>This Week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signups List */}
          <div className={`${tableBg} rounded-lg shadow-sm ${tableBorder}`}>
            <div className="p-6 border-b">
              <h2 className={`text-lg font-semibold ${headerText}`}>Waitlist Signups</h2>
              <p className={headerSecondary}>All users who have joined the waitlist</p>
            </div>

            <div className="overflow-x-auto">
              {signups.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail className={`w-12 h-12 ${emptyIcon} mx-auto mb-4`} />
                  <p className={emptyText}>No signups yet</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className={theadBg}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theadText} uppercase tracking-wider`}>
                        #
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theadText} uppercase tracking-wider`}>
                        Email
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theadText} uppercase tracking-wider`}>
                        Joined
                      </th>
                      <th className={`px-6 py-3 text-right text-xs font-medium ${theadText} uppercase tracking-wider`}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className={tbodyDivide}>
                    {signups.map((signup, index) => (
                      <tr key={signup.id} className={tbodyHover}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${tableText}`}>
                          {index + 1}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${tableText}`}>
                          {signup.email}
                        </td>
                        <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {(() => {
                            const dateStr = signup.created_at.endsWith('Z')
                              ? signup.created_at
                              : signup.created_at + 'Z'
                            return new Date(dateStr).toLocaleString([], {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })
                          })()}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(signup.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-700 transition-colors"
                            title="Delete signup"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}