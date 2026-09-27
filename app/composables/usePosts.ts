type BlogDateValue = string | number | Date | undefined

const toTimestamp = (value: BlogDateValue) => {
  if (value === undefined) return 0

  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export const getPostDateValue = (post: { meta?: { date?: unknown }, date?: unknown }) => {
  const value = post.meta?.date ?? post.date
  return typeof value === 'string' || typeof value === 'number' || value instanceof Date
    ? value
    : undefined
}

export const formatPostDate = (value: BlogDateValue, options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' }) => {
  if (value === undefined) return ''

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-US', options).toUpperCase()
}

const loadPosts = async () => {
  const articles = await queryCollection('content').all()

  return articles
    .filter(article => article.path.startsWith('/posts/'))
    .sort((a, b) => toTimestamp(getPostDateValue(b)) - toTimestamp(getPostDateValue(a)))
}

export const usePosts = (key = 'blog-posts') => useAsyncData(key, loadPosts)
