const adminEmail = import.meta.env['VITE_ADMIN_EMAIL'] as string | undefined
const adminPasswordHash = import.meta.env['VITE_ADMIN_PASSWORD_HASH'] as string | undefined

if (!adminEmail || !adminPasswordHash) {
  throw new Error(
    'Admin credentials missing. Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD_HASH in .env.local'
  )
}

export const ENV = {
  ADMIN_EMAIL: adminEmail,
  ADMIN_PASSWORD_HASH: adminPasswordHash,
  IS_DEV: import.meta.env.DEV,
} as const
