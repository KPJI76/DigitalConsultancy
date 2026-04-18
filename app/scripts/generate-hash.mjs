// Run with: node scripts/generate-hash.mjs "YourPassword"
// Requires Node.js 20+. Outputs the hash to paste into .env.local

const password = process.argv[2]
if (!password) {
  console.error('Usage: node scripts/generate-hash.mjs "YourPassword"')
  process.exit(1)
}

const ITERATIONS = 100_000
const HASH_ALGO = 'SHA-256'
const KEY_LENGTH = 256

function bufToHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

const saltBytes = new Uint8Array(16)
globalThis.crypto.getRandomValues(saltBytes)
const salt = bufToHex(saltBytes.buffer)

const keyMaterial = await globalThis.crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(password),
  'PBKDF2',
  false,
  ['deriveBits']
)

const derivedBits = await globalThis.crypto.subtle.deriveBits(
  { name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: ITERATIONS, hash: HASH_ALGO },
  keyMaterial,
  KEY_LENGTH
)

const hash = `${ITERATIONS}:${salt}:${bufToHex(derivedBits)}`
console.log('\nPaste this into your .env.local file:')
console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}\n`)
