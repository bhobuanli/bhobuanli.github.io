import { glob, mkdir, readFile, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { promisify } from 'node:util'

const root = process.cwd()
const runCommand = promisify(execFile)
const destination = resolve(root, 'data/x-posts.json')
const postPattern = /::x-post\{[^}]*url=["']([^"']+)["'][^}]*\}\s*::/g
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
})

const urls = new Set()
for await (const file of glob('content/**/*.md', { cwd: root })) {
  const source = await readFile(resolve(root, file), 'utf8')
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
