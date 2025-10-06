import type { VisionFile } from '@/types/app'
/**
 * 图片URL替换工具函数
 * 用于将Markdown中的相对路径图片替换为files数组中的实际URL
 */

export interface FileInfo {
  id?: string
  tenant_id?: string
  type: string
  transfer_method: string
  remote_url?: string | null
  related_id: string
  filename: string
  extension: string
  mime_type: string
  size: number
  url: string
}

/**
 * 替换Markdown内容中的图片路径
 * @param markdownContent - 包含图片路径的Markdown内容
 * @param files - 文件信息数组
 * @returns 替换后的Markdown内容
 */
export function replaceImageUrlsInMarkdown(
  markdownContent: string,
  files: VisionFile[],
): string {
  if (!markdownContent || !files || files.length === 0) {
    return markdownContent
  }

  // 创建related_id到URL的映射
  const fileUrlMap = new Map<string, string>()
  files.forEach((file) => {
    if (file.belongs_to && file.url) {
      fileUrlMap.set(file.belongs_to, file.url)
    }
  })

  // 替换Markdown中的图片路径
  // 匹配格式: ![alt text](/files/tools/related_id) 或 ![alt text](related_id)
  return markdownContent.replace(
    /!\[([^\]]*)\]\(\/files\/tools\/([^)]+?)(?:\.[^)]+)?\)/g,
    (match, altText, relatedId) => {
      const actualUrl = fileUrlMap.get(relatedId)
      if (actualUrl) {
        return `![${altText}](${actualUrl})`
      }
      return match // 如果找不到对应的URL，保持原样
    },
  )
}

/**
 * 替换Markdown内容中的图片路径（支持多种格式）
 * @param markdownContent - 包含图片路径的Markdown内容
 * @param files - 文件信息数组
 * @returns 替换后的Markdown内容
 */
export function replaceImageUrlsInMarkdownAdvanced(
  markdownContent: string,
  files: VisionFile[],
): string {
  console.log('replaceImageUrlsInMarkdownAdvanced files:', files)
  let result = markdownContent
  let matchRealUrl = ''
  let matched = false

  if (files && files.length > 0) {
    matchRealUrl = files.find(file => file.belongs_to)?.url || ''
  }
  else {
    matchRealUrl = extractImageUrl(result)
  }

  // ![5bd5137995c0418a948d6cf1c7bfd7f0.png](https://upload.dify.ai/files/tools/0b86246f-af97-4346-a021-45809d985234.png?timestamp=1759762166&nonce=e86b1721cf5af182c2826f92319795b0&sign=Bj3Ck5PsQ7Ee74bPsYTD1Xb7lvavI_gyUB2Kw13zmxQ=) 提取出 https://upload.dify.ai/files/tools/0b86246f-af97-4346-a021-45809d985234.png?timestamp=1759762166&nonce=e86b1721cf5af182c2826f92319795b0&sign=Bj3Ck5PsQ7Ee74bPsYTD1Xb7lvavI_gyUB2Kw13zmxQ=
  console.log('matchRealUrl', matchRealUrl)

  // 替换格式1: [alt text](/files/tools/related_id.png) - 将图片转换为链接
  result = result.replace(
    /\[([^\]]*)\]\(\/files\/tools\/([^)]+?)(?:\.[^)]+)?\)/g,
    (match, altText, _relatedId) => {
      const actualUrl = matchRealUrl
      if (actualUrl) {
        matched = true
        return `![${altText}](${actualUrl})`
      }
      return match
    },
  )

  // 替换格式2 ： [alt text](sandbox:/files/tools/0b86246f-af97-4346-a021-45809d985234.png)
  result = result.replace(
    /\[([^\]]*)\]\(sandbox:\/files\/tools\/([^)]+?)(?:\.[^)]+)?\)/g,
    (match, altText, _relatedId) => {
      const actualUrl = matchRealUrl
      if (actualUrl) {
        matched = true
        return `![${altText}](${actualUrl})`
      }
      return match
    },
  )

  if (!matched && files && files.length > 0) {
    // append image to result tail
    result = `${result}\n![图片附件](${matchRealUrl})`
  }

  console.log('result:', result)

  return result
}

/**
 * 提取图片URL
 * @param markdownImage
 * @returns
 */
function extractImageUrl(markdownImage: string): string {
  const regex = /!\[.*?\]\((.*?)\)/g
  const matches = markdownImage.matchAll(regex)
  for (const match of matches) {
    console.log('extractImageUrl match:', match)
    if (match[1].includes('https://upload.dify.ai/files/tools/')) {
      return match[1]
    }
  }
  return ''
}
