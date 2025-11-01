import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import RemarkMath from 'remark-math'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { replaceImageUrlsInMarkdownAdvanced } from '@/utils/image-url-replacer'
import { useState } from 'react'
import type { VisionFile } from '@/types/app'

interface MarkdownProps {
  content: string
  files?: VisionFile[]
}

export function Markdown(props: MarkdownProps) {
  const { content, files } = props
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)

  // 处理图片URL替换
  const processedContent = files && files.length > 0
    ? replaceImageUrlsInMarkdownAdvanced(content, files)
    : content

  // 下载图片功能
  const downloadImage = async (src: string, alt?: string) => {
    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = alt || 'image'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('下载图片失败:', error)
    }
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[RemarkMath, RemarkGfm]}
        rehypePlugins={[
          RehypeKatex,
        ]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return (!inline && match)
              ? (
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, '')}
                  style={atelierHeathLight}
                  language={match[1]}
                  showLineNumbers
                  PreTag="div"
                />
              )
              : (
                <code {...props} className={className}>
                  {children}
                </code>
              )
          },
          img({ node, ...props }) {
            const { src, alt } = props
            return (
              <a
                className="relative inline-block group"
                href={src}
                target="_blank"
                download={alt}
              >
                <img {...props} className="max-w-full h-auto rounded-lg" />
              </a>
            )
          },
        }}
        linkTarget={'_blank'}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
