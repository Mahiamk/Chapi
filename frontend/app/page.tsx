'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowRight, CheckCircle, Users, Clock, Gift, Instagram, Sun, Moon } from 'lucide-react'
import { FaTelegram, FaTiktok } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { signupWaitlist } from '@/lib/api'

interface WaitlistForm {
  email: string
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const { register, handleSubmit, formState: { errors }, reset } = useForm<WaitlistForm>()

  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-black'
  const secondaryText = theme === 'dark' ? 'text-white/70' : 'text-black/70'
  const borderColor = theme === 'dark' ? 'border-white/20' : 'border-black/20'
  const glassBg = theme === 'dark' ? 'bg-black/20' : 'bg-white/20'
  const hoverBg = theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
  const hoverBorder = theme === 'dark' ? 'hover:border-white/40' : 'hover:border-black/40'
  const placeholderColor = theme === 'dark' ? 'placeholder-white/60' : 'placeholder-gray-500'
  const focusRingColor = theme === 'dark' ? 'focus:ring-white/30 focus:border-white' : 'focus:ring-black/30 focus:border-black'
  const buttonBg = theme === 'dark' ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-900'
  const spinnerBorder = theme === 'dark' ? 'border-black' : 'border-white'
  const circleBg = theme === 'dark' ? 'bg-white/20' : 'bg-black/20'
  const transparentButton = theme === 'dark' ? 'bg-transparent border border-white/20 text-white hover:border-white hover:bg-white/5' : 'bg-transparent border border-black/20 text-black hover:border-black hover:bg-black/5'

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const onSubmit = async (data: WaitlistForm) => {
    setIsLoading(true)
    try {
      await signupWaitlist(data.email)
      setIsSubmitted(true)
      reset()
      toast.success('Successfully joined the waitlist! Check your email for confirmation.', { duration: 4000 })
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to join waitlist. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderToggle = () => (
    <button
      onClick={toggleTheme}
      className={`${glassBg} backdrop-blur-sm p-2 rounded-full ${hoverBg} transition-all duration-300 fixed top-4 right-4 z-50`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className={`w-5 h-5 ${textColor}`} />
      ) : (
        <Moon className={`w-5 h-5 ${textColor}`} />
      )}
    </button>
  )

  if (isSubmitted) {
    return (
      <>
        {renderToggle()}
        <div className={`${bgColor} min-h-screen flex items-center justify-center p-4 font-sans relative`}>
          <div className="max-w-md w-full text-center">
            <div className={`w-20 h-20 ${circleBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <CheckCircle className={`w-10 h-10 ${textColor}`} />
            </div>
            <h1 className={`text-3xl font-bold mb-4 ${textColor}`}>
              Welcome to the Waitlist! 🎉
            </h1>
            <p className={`${secondaryText} mb-8`}>
              Thank you for joining our exclusive waitlist. You'll be the first to know when we launch!
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className={`${transparentButton} px-6 py-3 rounded-lg transition-colors`}
            >
              Close
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {renderToggle()}
      <div className={`${bgColor} min-h-screen font-sans relative`}>
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Floating animation for main heading */}
            <h1 className={`text-5xl md:text-7xl font-bold mb-8 leading-tight ${textColor}`}>
              <span className={textColor}>Something Amazing</span>
              <br />
              <span className={textColor}>is Coming Soon</span>
            </h1>
            
            <p className={`text-lg ${secondaryText} max-w-2xl mx-auto leading-relaxed`}>
              Be the first to experience our revolutionary product. Join our exclusive waitlist 
              and get early access, special discounts, and insider updates.
            </p>

            {/* Waitlist Form - compact horizontal, no title */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 max-w-md mx-auto">
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                placeholder="Enter your email address"
                className={`flex-1 px-4 py-3 bg-transparent border ${borderColor} rounded-lg ${textColor} ${placeholderColor} focus:ring-2 ${focusRingColor} transition-all`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`${buttonBg} px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[140px]`}
              >
                {isLoading ? (
                  <>
                    <div className={`w-5 h-5 border-2 ${spinnerBorder} border-t-transparent rounded-full animate-spin mr-2`}></div>
                    Joining...
                  </>
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
            
            {errors.email && (
              <p className="text-red-400 text-sm text-left max-w-md mx-auto">{errors.email.message}</p>
            )}

            {/* Features Grid - below, compact */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className={`${glassBg} backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${borderColor} ${hoverBg} ${hoverBorder} hover:scale-105 transition-all duration-300`}>
                <Users className={`w-12 h-12 ${textColor} mx-auto mb-4`} />
                <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>Early Access</h3>
                <p className={`${secondaryText} text-sm`}>Be among the first to try our new features</p>
              </div>
              <div className={`${glassBg} backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${borderColor} ${hoverBg} ${hoverBorder} hover:scale-105 transition-all duration-300`}>
                <Gift className={`w-12 h-12 ${textColor} mx-auto mb-4`} />
                <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>Exclusive Offers</h3>
                <p className={`${secondaryText} text-sm`}>Get special discounts and bonuses</p>
              </div>
              <div className={`${glassBg} backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${borderColor} ${hoverBg} ${hoverBorder} hover:scale-105 transition-all duration-300`}>
                <Clock className={`w-12 h-12 ${textColor} mx-auto mb-4`} />
                <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>Priority Updates</h3>
                <p className={`${secondaryText} text-sm`}>Stay informed about our progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`${glassBg} backdrop-blur-sm border-t ${borderColor} py-12 mt-16`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <p className={`${secondaryText} text-sm`}>
                  © 2025 Chapi. All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <a
                  href="https://www.tiktok.com/@chapi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${secondaryText} hover:${textColor} transition-colors`}
                  aria-label="TikTok"
                >
                  <FaTiktok className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/chapi.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${secondaryText} hover:${textColor} transition-colors`}
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://t.me/chapidevtalks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${secondaryText} hover:${textColor} transition-colors`}
                  aria-label="Telegram"
                >
                  <FaTelegram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}