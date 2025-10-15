'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { ArrowRight, CheckCircle, Users, Clock, Gift, Instagram, Sun, Moon, Shield } from 'lucide-react'
import { FaTelegram, FaTiktok } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { signupWaitlist } from '@/lib/api'

interface WaitlistForm {
  email: string
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
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
  const adminButtonBg = theme === 'dark' ? `${glassBg} ${hoverBg}` : `${glassBg} ${hoverBg}`

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      }
      return nextTheme;
    });
  };

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

  const renderAdminButton = () => (
    <Link href="/admin">
      <button
        className={`${adminButtonBg} backdrop-blur-sm flex items-center justify-center sm:justify-start gap-1 sm:gap-2 p-2 sm:px-3 sm:py-2 rounded-lg transition-all duration-300 fixed top-4 left-4 z-50 min-w-[40px] sm:min-w-0`}
        aria-label="Admin Panel"
      >
        <Shield className={`w-4 h-4 sm:w-5 sm:h-5 ${textColor}`} />
        <span className={`hidden sm:inline text-xs sm:text-sm font-medium ${textColor}`}>Admin Control</span>
      </button>
    </Link>
  )

  const renderMobileForm = () => (
    <div className="block sm:hidden max-w-md mx-auto space-y-4 mb-6">
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
        className={`px-4 py-3 bg-transparent border ${borderColor} rounded-lg ${textColor} ${placeholderColor} focus:ring-2 ${focusRingColor} transition-all w-full`}
        disabled={isLoading}
      />
      {errors.email && (
        <p className="text-red-400 text-sm text-left">{errors.email.message}</p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className={`${buttonBg} px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full text-sm`}
      >
        {isLoading ? (
          <>
            <div className={`w-4 h-4 border-2 ${spinnerBorder} border-t-transparent rounded-full animate-spin mr-2`}></div>
            Joining
          </>
        ) : (
          <>
            Join Waitlist
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </button>
    </div>
  )

  const renderDesktopForm = () => (
    <div className="hidden sm:flex gap-4 max-w-md mx-auto mb-6">
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
        className={`${buttonBg} px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[140px] text-base`}
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
    </div>
  )

  const renderErrors = () => (
    errors.email && (
      <p className="text-red-400 text-sm text-center sm:text-left max-w-md mx-auto">{errors.email.message}</p>
    )
  )

  if (isSubmitted) {
    return (
      <>
        {renderToggle()}
        {renderAdminButton()}
        <div className={`${bgColor} min-h-screen flex items-center justify-center p-4 font-sans relative`}>
          <div className="max-w-md w-full text-center">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 ${circleBg} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
              <CheckCircle className={`w-8 h-8 sm:w-10 sm:h-10 ${textColor}`} />
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${textColor}`}>
              Welcome to the Waitlist! 🎉
            </h1>
            <p className={`${secondaryText} mb-6 sm:mb-8 text-sm sm:text-base`}>
              Thank you for joining our exclusive waitlist. You'll be the first to know when we launch!
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className={`${transparentButton} px-4 sm:px-6 py-3 rounded-lg transition-colors text-sm sm:text-base`}
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
      {renderAdminButton()}
      <form onSubmit={handleSubmit(onSubmit)} className={`${bgColor} min-h-screen font-sans relative`}>
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 sm:py-16 flex flex-col items-center">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
            {/* Floating animation for main heading */}
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight ${textColor}`}>
              <span className={textColor}>Something Amazing</span>
              <br />
              <span className={textColor}>is Coming Soon</span>
            </h1>
            <p className={`text-base sm:text-lg ${secondaryText} max-w-2xl mx-auto leading-relaxed px-4 sm:px-0`}>
              Be the first to experience our revolutionary product. Join our exclusive waitlist 
              and get early access, special discounts, and insider updates.
            </p>

            {/* Mobile form (stacked vertically under heading) */}
            {renderMobileForm()}

            {/* Desktop form (horizontal under heading) */}
            {renderDesktopForm()}

            {/* Errors (common) */}
            {renderErrors()}

            

            {/* Features Grid - below, compact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-8">
              <div className={`${glassBg} backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border ${borderColor} ${hoverBg} ${hoverBorder} hover:scale-105 transition-all duration-300`}>
                <Users className={`w-10 h-10 sm:w-12 sm:h-12 ${textColor} mx-auto mb-3 sm:mb-4`} />
                <h3 className={`text-base sm:text-lg font-semibold mb-2 ${textColor}`}>Early Access</h3>
                <p className={`${secondaryText} text-sm`}>Be among the first to try our new features</p>
              </div>
              <div className={`${glassBg} backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border ${borderColor} ${hoverBg} ${hoverBorder} hover:scale-105 transition-all duration-300`}>
                <Gift className={`w-10 h-10 sm:w-12 sm:h-12 ${textColor} mx-auto mb-3 sm:mb-4`} />
                <h3 className={`text-base sm:text-lg font-semibold mb-2 ${textColor}`}>Exclusive Offers</h3>
                <p className={`${secondaryText} text-sm`}>Get special discounts and bonuses</p>
              </div>
              <div className={`${glassBg} backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border ${borderColor} ${hoverBg} ${hoverBorder} hover:scale-105 transition-all duration-300`}>
                <Clock className={`w-10 h-10 sm:w-12 sm:h-12 ${textColor} mx-auto mb-3 sm:mb-4`} />
                <h3 className={`text-base sm:text-lg font-semibold mb-2 ${textColor}`}>Priority Updates</h3>
                <p className={`${secondaryText} text-sm`}>Stay informed about our progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`${glassBg} backdrop-blur-sm border-t ${borderColor} py-8 sm:py-12 mt-12 sm:mt-16`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
              <div className="text-center md:text-left">
                <p className={`${secondaryText} text-sm`}>
                  © 2025 Chapi. All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
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
      </form>
    </>
  )
}