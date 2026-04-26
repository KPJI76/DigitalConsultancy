import emailjs from '@emailjs/browser'

const SERVICE_ID  = import.meta.env['VITE_EMAILJS_SERVICE_ID']  as string | undefined
const TEMPLATE_ID = import.meta.env['VITE_EMAILJS_TEMPLATE_ID'] as string | undefined
const PUBLIC_KEY  = import.meta.env['VITE_EMAILJS_PUBLIC_KEY']  as string | undefined

export const emailjsConfigured =
  Boolean(SERVICE_ID) && Boolean(TEMPLATE_ID) && Boolean(PUBLIC_KEY)

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function sendVerificationOtp(
  toEmail: string,
  toName: string,
  otp: string
): Promise<void> {
  if (!emailjsConfigured) {
    // Dev mode: log OTP to console so developer can still test
    console.info(`[DEV] Email OTP for ${toEmail}: ${otp}`)
    return
  }
  await emailjs.send(
    SERVICE_ID!,
    TEMPLATE_ID!,
    { to_email: toEmail, to_name: toName, otp },
    { publicKey: PUBLIC_KEY! }
  )
}
