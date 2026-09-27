import { access } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { imageSizeFromFile } from 'image-size/fromFile'

const walk = async (node, visit) => {
  await visit(node)
  for (const child of node.children ?? []) await walk(child, visit)
}

/**
 * Adds intrinsic dimensions to local Markdown images so the browser can reserve
 * their space before downloading them. Remote images and hand-written sizes
 * are left untouched.
 */
export default function rehypeLocalImageDimensions(options = {}) {
  const publicDir = resolve(options.publicDir ?? resolve(process.cwd(), 'public'))
  const imagePrefix = options.imagePrefix ?? '/images/posts/'
  const dimensions = new Map()

  const readDimensions = (filePath) => {
    const cached = dimensions.get(filePath)
    if (cached) return cached

    const pending = access(filePath)
      .then(() => imageSizeFromFile(filePath))
      .catch(() => null)

    dimensions.set(filePath, pending)
    return pending
  }

  return async (tree) => {
    await walk(tree, async (node) => {
      if (node.type !== 'element' || node.tagName !== 'img') return

      const properties = node.properties ?? {}
      const source = typeof properties.src === 'string' ? properties.src : ''
      if (!source.startsWith(imagePrefix)) return
      if (properties.width && properties.height) return

      const pathname = source.split(/[?#]/, 1)[0]
      let decodedPath

      try {
        decodedPath = decodeURIComponent(pathname)
      } catch {
        return
      }

      const filePath = resolve(publicDir, `.${decodedPath}`)
      if (filePath !== publicDir && !filePath.startsWith(`${publicDir}${sep}`)) return

      const size = await readDimensions(filePath)
      if (!size?.width || !size.height) return

      node.properties = {
        ...properties,
        width: properties.width ?? size.width,
        height: properties.height ?? size.height,
      }
    })
  }
}
