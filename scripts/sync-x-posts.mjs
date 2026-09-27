import { glob, mkdir, readFile, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { promisify } from 'node:util'

const root = process.cwd()
const runCommand = promisify(execFile)
const destination = resolve(root, 'data/x-posts.json')
const postPattern = /::x-post\{[^}]*url=["'](https?:\/\/[^"']+)["'][^}]*\}/g
const features = [
  'tfw_timeline_list:',
  'tfw_follower_count_sunset:true',
  'tfw_tweet_edit_backend:on',
  'tfw_refsrc_session:on',
  'tfw_fosnr_soft_interventions_enabled:on',
  'tfw_show_business_verified_badge:on',
  'tfw_show_blue_verified_badge:on',
  'tfw_legacy_timeline_sunset:true',
].join(';')

const readSnapshots = async () => {
  try {
    return JSON.parse(await readFile(destination, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return {}
    throw error
  }
}

const getId = (url) => url.match(/(?:x|twitter)\.com\/[^/]+\/status\/(\d+)/)?.[1]
const getToken = (id) => ((Number(id) / 1e15) * Math.PI)
  .toString(6 ** 2)
  .replace(/(0+|\.)/g, '')

const fetchWithWindows = async (endpoint) => {
  const command = [
    '$ErrorActionPreference = "Stop"',
    '[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false',
    `$response = Invoke-WebRequest -UseBasicParsing -Uri '${endpoint}' -TimeoutSec 25`,
    '[Console]::Out.Write($response.Content)',
  ].join('; ')
  const encodedCommand = Buffer.from(command, 'utf16le').toString('base64')
  const { stdout } = await runCommand(
    'powershell.exe',
    ['-NoProfile', '-NonInteractive', '-EncodedCommand', encodedCommand],
    { encoding: 'utf8', timeout: 30_000 },
  )
  return JSON.parse(stdout)
}

const fetchTweet = async (id) => {
  const endpoint = new URL('https://cdn.syndication.twimg.com/tweet-result')
  endpoint.searchParams.set('id', id)
  endpoint.searchParams.set('lang', 'en')
  endpoint.searchParams.set('features', features)
  endpoint.searchParams.set('token', getToken(id))

  let data
  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(20_000) })
    if (!response.ok) throw new Error(`X returned HTTP ${response.status}`)
    data = await response.json()
  } catch (error) {
    if (process.platform !== 'win32') throw error
    data = await fetchWithWindows(endpoint.toString())
  }
  if (!data || Object.keys(data).length === 0 || data.__typename === 'TweetTombstone') {
    throw new Error('X did not return a public post')
  }
  return data
}

const toSnapshot = (tweet) => ({
  id: tweet.id_str,
  url: `https://x.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
  author: {
    name: tweet.user.name,
    handle: tweet.user.screen_name,
    avatarUrl: tweet.user.profile_image_url_https || null,
  },
  text: (tweet.entities?.media || []).reduce(
    (text, media) => text.replace(media.url, '').replace(/[ \t]+\n/g, '\n'),
    tweet.text,
  ).trim(),
  createdAt: tweet.created_at,
  links: (tweet.entities?.urls || []).map((link) => ({
    url: link.url,
    expandedUrl: link.expanded_url,
    displayUrl: link.display_url,
  })),
  photos: (tweet.photos || []).slice(0, 4).map((photo) => ({
    url: photo.url,
    width: photo.width,
    height: photo.height,
    alt: photo.alt_text || '',
  })),
  video: pickVideo(tweet),
})

const parseResolution = (url) => {
  const match = url?.match(/\/(\d+)x(\d+)\//)
  return match
    ? {
        width: Number(match[1]),
        height: Number(match[2]),
        area: Number(match[1]) * Number(match[2]),
      }
    : null
}

const pickVideo = (tweet) => {
  const mediaDetails = Array.isArray(tweet.mediaDetails)
    ? tweet.mediaDetails
    : tweet.mediaDetails
      ? [tweet.mediaDetails]
      : []
  const detail = mediaDetails.find(item => item?.type === 'video' || item?.type === 'animated_gif')
  const video = tweet.video

  if (!detail && !video) return null

  const variants = detail?.video_info?.variants
    || (video?.variants || []).map(variant => ({
      content_type: variant.type,
      url: variant.src,
    }))
  const mp4s = variants.filter(variant => variant.content_type === 'video/mp4' && variant.url)
  const best = [...mp4s].sort((a, b) => {
    const bitrateDelta = (b.bitrate || 0) - (a.bitrate || 0)
    if (bitrateDelta) return bitrateDelta
    return (parseResolution(b.url)?.area || 0) - (parseResolution(a.url)?.area || 0)
  })[0]

  if (!best) return null

  const resolution = parseResolution(best.url)
  const width = detail?.original_info?.width
    || video?.aspectRatio?.[0]
    || resolution?.width
    || 16
  const height = detail?.original_info?.height
    || video?.aspectRatio?.[1]
    || resolution?.height
    || 9

  return {
    url: best.url,
    contentType: best.content_type || 'video/mp4',
    poster: video?.poster || detail?.media_url_https || null,
    width,
    height,
    type: detail?.type === 'animated_gif' ? 'gif' : 'video',
    durationMs: detail?.video_info?.duration_millis ?? video?.durationMs ?? null,
  }
}

const fixUnclosedXPosts = async (file, source) => {
  const lines = source.split(/\r?\n/)
  let changed = false

  for (let index = 0; index < lines.length; index += 1) {
    if (!/^::x-post\{[^}]+\}$/.test(lines[index].trim())) continue
    const nextContent = lines.slice(index + 1).find(line => line.trim() !== '')
    if (nextContent?.trim() === '::') continue
    lines.splice(index + 1, 0, '::')
    changed = true
    index += 1
  }

  if (!changed) return source

  const fixed = lines.join('\n')
  await writeFile(resolve(root, file), fixed, 'utf8')
  console.log(`Fixed missing "::" in ${file}`)
  return fixed
}

const urls = new Set()
for await (const file of glob('content/**/*.md', { cwd: root })) {
  const source = await fixUnclosedXPosts(file, await readFile(resolve(root, file), 'utf8'))
  for (const match of source.matchAll(postPattern)) urls.add(match[1])
}

const snapshots = await readSnapshots()
let updated = 0
for (const url of urls) {
  const id = getId(url)
  if (!id) {
    console.warn(`Skipping unsupported X URL: ${url}`)
    continue
  }

  try {
    snapshots[id] = toSnapshot(await fetchTweet(id))
    updated += 1
    console.log(`Updated ${id}`)
  } catch (error) {
    console.warn(`Keeping existing snapshot for ${id}: ${error.message}`)
  }
}

await mkdir(dirname(destination), { recursive: true })
await writeFile(destination, `${JSON.stringify(snapshots, null, 2)}\n`)
console.log(`Saved ${Object.keys(snapshots).length} X post snapshot(s); ${updated} updated.`)
