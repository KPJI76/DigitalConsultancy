import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../contexts/AuthContext'
import { signupSchema, type SignupInput } from '@/schemas/auth.schema'
import { generateOtp, sendVerificationOtp, emailjsConfigured } from '@/lib/emailVerification'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react'

const Signup = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  // OTP state
  const [otpStep, setOtpStep] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpSending, setOtpSending] = useState(false)
  const otpRef = useRef<string>('')
  const pendingDataRef = useRef<SignupInput | null>(null)

  // Honeypot ref (hidden field — bots fill this, humans don't)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) })

  const password = watch('password', '')

  const strengthChecks = [
    { label: '8+ characters',    pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number',           pass: /[0-9]/.test(password) },
    { label: 'Special character',pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const strengthPassed = strengthChecks.filter(c => c.pass).length

  const onSubmit = async (data: SignupInput) => {
    // Honeypot check — if filled, silently block (bot)
    if (honeypotRef.current?.value) return

    setServerError('')

    const otp = generateOtp()
    otpRef.current = otp
    pendingDataRef.current = data

    setOtpSending(true)
    try {
      await sendVerificationOtp(data.email, data.name, otp)
      setOtpStep(true)
    } catch {
      setServerError('Failed to send verification email. Please check your email address and try again.')
    } finally {
      setOtpSending(false)
    }
  }

  const verifyOtp = async () => {
    setOtpError('')
    if (otpValue.trim() !== otpRef.current) {
      setOtpError('Incorrect code. Please check your email and try again.')
      return
    }
    const data = pendingDataRef.current!
    const success = await signup(data.email, data.password, data.name)
    if (success) {
      navigate('/')
    } else {
      setOtpStep(false)
      setServerError('An account with this email already exists.')
    }
  }

  if (otpStep) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan/10 mb-4">
              <ShieldCheck className="w-8 h-8 text-cyan" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-white/60">
              We sent a 6-digit code to <span className="text-cyan">{pendingDataRef.current?.email}</span>
              {!emailjsConfigured && (
                <span className="block mt-1 text-yellow-400 text-xs">[Dev mode] Check the browser console for the OTP.</span>
              )}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-5">
            {otpError && (
              <div role="alert" className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {otpError}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-white/80">Verification Code</Label>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otpValue}
                onChange={e => setOtpValue(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-[0.5em] bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-cyan"
                autoFocus
              />
            </div>

            <Button
              onClick={verifyOtp}
              disabled={otpValue.length !== 6}
              className="w-full py-6 bg-cyan text-navy font-semibold hover:bg-white transition-all"
            >
              Verify & Create Account
            </Button>

            <button
              type="button"
              onClick={() => { setOtpStep(false); setOtpValue(''); setOtpError('') }}
              className="w-full text-white/40 hover:text-white text-sm transition-colors text-center"
            >
              ← Use a different email
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6 py-12">
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
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/60">Join our community of enterprise professionals</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
          noValidate
        >
          {/* Honeypot — hidden from humans, filled by bots */}
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
          />

          {serverError && (
            <div role="alert" className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/80">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                <Input
                  id="name" type="text" autoComplete="name" placeholder="John Doe"
                  {...register('name')}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                <Input
                  id="email" type="email" autoComplete="email" placeholder="you@example.com"
                  {...register('email')}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                <Input
                  id="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password" placeholder="••••••••"
                  {...register('password')}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= strengthPassed
                          ? strengthPassed <= 1 ? 'bg-red-500'
                            : strengthPassed <= 2 ? 'bg-orange-400'
                            : strengthPassed <= 3 ? 'bg-yellow-400'
                            : 'bg-green-400'
                          : 'bg-white/10'
                      }`} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {strengthChecks.map(c => (
                      <span key={c.label} className={`text-xs ${c.pass ? 'text-green-400' : 'text-white/30'}`}>
                        {c.pass ? '✓' : '○'} {c.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/80">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                <Input
                  id="confirmPassword" type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password" placeholder="••••••••"
                  {...register('confirmPassword')}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <Controller name="agreeTerms" control={control}
                render={({ field }) => (
                  <Checkbox id="terms" checked={field.value === true}
                    onCheckedChange={v => field.onChange(v === true)}
                    className="mt-1 border-white/30 data-[state=checked]:bg-cyan data-[state=checked]:border-cyan"
                  />
                )}
              />
              <Label htmlFor="terms" className="text-white/60 text-sm leading-relaxed cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-cyan hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-cyan hover:underline">Privacy Policy</a>
              </Label>
            </div>
            {errors.agreeTerms && <p className="text-red-400 text-xs -mt-3">{errors.agreeTerms.message}</p>}

            <Button type="submit" disabled={isSubmitting || otpSending}
              className="w-full py-6 bg-cyan text-navy font-semibold hover:bg-white transition-all">
              {isSubmitting || otpSending ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" aria-hidden="true" />
                  Sending verification code...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan hover:text-white transition-colors">Sign in</Link>
        </p>
        <p className="mt-4 text-center">
          <Link to="/" className="text-white/40 hover:text-white text-sm transition-colors">← Back to homepage</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
