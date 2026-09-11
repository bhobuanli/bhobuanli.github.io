import { access, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'

const root = process.cwd()
const postsDir = resolve(root, 'content/posts')
const rl = createInterface({ input, output })

const ask = async (label, defaultValue = '') => {
  const suffix = defaultValue ? ` [${defaultValue}]` : ''
  const answer = (await rl.question(`${label}${suffix}: `)).trim()
  return answer || defaultValue
}

const slugify = value => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const pad = value => String(value).padStart(2, '0')
const now = new Date()
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
const fallbackSlug = `post-${date.replaceAll('-', '')}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`

try {
  const title = await ask('文章标题')
  if (!title) {
    console.error('标题不能为空。')
    process.exitCode = 1
  } else {
    const slug = slugify(await ask('文件名 slug（可留空）', fallbackSlug)) || fallbackSlug
    const description = await ask('文章简介')
    const tags = (await ask('标签（用英文逗号分隔）'))
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
    const file = resolve(postsDir, `${slug}.md`)

    try {
      await access(file)
      console.error(`文件已存在：${file}`)
      process.exitCode = 1
    } catch {
      const frontmatter = [
        '---',
        `title: ${JSON.stringify(title)}`,
        `description: ${JSON.stringify(description)}`,
        `date: ${date}`,
        tags.length ? 'tags:' : 'tags: []',
        ...tags.map(tag => `  - ${JSON.stringify(tag)}`),
        '---',
        '',
        '<!-- 在这里开始写正文 -->',
        '',
      ].join('\n')

      await mkdir(postsDir, { recursive: true })
      await writeFile(file, frontmatter, 'utf8')
      console.log(`\n已创建：${file}`)
    }
  }
} finally {
  rl.close()
}
