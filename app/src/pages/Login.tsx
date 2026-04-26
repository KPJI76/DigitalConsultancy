import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../contexts/AuthContext'
import { loginSchema, type LoginInput } from '@/schemas/auth.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [lockoutMs, setLockoutMs] = useState<number | null>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    if (honeypotRef.current?.value) return   // bot detected
    setServerError('')
    setLockoutMs(null)

    const result = await login(data.email, data.password)
    if (result.success) {
      navigate('/')
    } else {
      if (result.lockedUntilMs) {
        setLockoutMs(result.lockedUntilMs)
      }
      setServerError(result.error ?? 'Invalid email or password')
    }
  }

  const lockoutMinutes = lockoutMs
    ? Math.ceil((lockoutMs - Date.now()) / 60_000)
    : null

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12">
              <svg viewBox="0 0 40 40" fill="none" className="w-full h-full" aria-hidden="true">
                <path d="M20 3L35 12V28L20 37L5 28V12L20 3Z" stroke="#00D9FF" strokeWidth="1.5" fill="none" />
                <circle cx="20" cy="20" r="6" fill="#00D9FF" />
              </svg>
            </div>
            <span className="text-white font-semibold text-xl">
              Enterprise<span className="text-cyan">Consult</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/60">Sign in to access your account</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
          noValidate
        >
          {/* Honeypot — invisible to humans, filled by bots */}
          <input ref={honeypotRef} type="text" name="website" tabIndex={-1}
            aria-hidden="true" autoComplete="off"
            style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />
          {serverError && (
            <div role="alert" className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {serverError}
              {lockoutMinutes !== null && (
                <span className="block mt-1 font-medium">
                  Try again in {lockoutMinutes} minute{lockoutMinutes !== 1 ? 's' : ''}.
                </span>
              )}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || lockoutMs !== null}
              className="w-full py-6 bg-cyan text-navy font-semibold hover:bg-white transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" aria-hidden="true" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-white/60">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-cyan hover:text-white transition-colors">
            Sign up
          </Link>
        </p>
        <p className="mt-4 text-center">
          <Link to="/" className="text-white/40 hover:text-white text-sm transition-colors">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
