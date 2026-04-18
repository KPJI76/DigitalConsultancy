const ITERATIONS = 100_000
const HASH_ALGO = 'SHA-256'
const KEY_LENGTH = 256

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function generateSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return bufToHex(salt.buffer)
}

async function deriveKey(password: string, salt: string, iterations: number): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations, hash: HASH_ALGO },
    keyMaterial,
    KEY_LENGTH
  )
  return bufToHex(derivedBits)
}

export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt()
  const hash = await deriveKey(password, salt, ITERATIONS)
  return `${ITERATIONS}:${salt}:${hash}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':')
  if (parts.length !== 3) return false
  const [iterStr, salt, expectedHash] = parts
  if (!iterStr || !salt || !expectedHash) return false
  const iterations = parseInt(iterStr, 10)
  if (isNaN(iterations) || iterations < 1) return false

  const actual = await deriveKey(password, salt, iterations)

  // Constant-time comparison to prevent timing attacks
  if (actual.length !== expectedHash.length) return false
  let diff = 0
  for (let i = 0; i < actual.length; i++) {
    diff |= (actual.charCodeAt(i) ?? 0) ^ (expectedHash.charCodeAt(i) ?? 0)
  }
  return diff === 0
}
