import DOMPurify from 'dompurify'

export function sanitizeArticleHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote',
      'a', 'code', 'pre', 'hr', 'img', 'span',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class'],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick'],
    FORCE_BODY: false,
    ADD_ATTR: ['target'],
    ALLOW_UNKNOWN_PROTOCOLS: false,
  })
}

export function sanitizePlainText(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}

const YOUTUBE_EMBED_RE = /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}(\?.*)?$/
const YOUTUBE_ID_RE = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

export function sanitizeYoutubeUrl(input: string): string | null {
  if (YOUTUBE_EMBED_RE.test(input)) return input
  const match = input.match(YOUTUBE_ID_RE)
  if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}`
  return null
}
