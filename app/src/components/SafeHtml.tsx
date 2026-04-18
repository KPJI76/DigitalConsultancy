import { sanitizeArticleHtml, sanitizePlainText } from '@/lib/sanitize'

interface SafeHtmlProps {
  html: string
  mode?: 'article' | 'text'
  className?: string
  tag?: 'div' | 'span' | 'p' | 'article' | 'section' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function SafeHtml({ html, mode = 'article', className, tag: Tag = 'div' }: SafeHtmlProps) {
  const clean = mode === 'article' ? sanitizeArticleHtml(html) : sanitizePlainText(html)
  // eslint-disable-next-line react/no-danger
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: clean }} />
}
