'use client'
import React from 'react'
import { Streamdown } from 'streamdown'
import 'katex/dist/katex.min.css'
import { replaceImageUrlsInMarkdownAdvanced } from '@/utils/image-url-replacer'
import type { VisionFile } from '@/types/app'

interface StreamdownMarkdownProps {
  content: string
  className?: string
  files?: VisionFile[]
}

export function StreamdownMarkdown({ content, className = '', files = [] }: StreamdownMarkdownProps) {
  console.log('StreamdownMarkdown', content)
  console.log('StreamdownMarkdown files:', files)
  // 处理图片URL替换
  const processedContent = replaceImageUrlsInMarkdownAdvanced(content, files)
  return (
    <div className={`streamdown-markdown ${className}`}>
      <Streamdown
        components={{
          p: ({ children, ...props }) => {
            // 检查是否包含块级元素或图片
            const hasBlockElements = React.Children.toArray(children).some((child) => {
              if (React.isValidElement(child)) {
                // 检查是否是块级元素
                if (typeof child.type === 'string'
                  && ['div', 'pre', 'table', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(child.type)) {
                  return true
                }
                // 检查是否是图片元素（streamdown 的 img 组件会渲染 div 包装器）
                if (child.type === 'img'
                  || (child.props && child.props['data-streamdown'] === 'image-wrapper')) {
                  return true
                }
                // 检查子元素中是否包含图片
                if (child.props && child.props.children) {
                  const hasImageInChildren = React.Children.toArray(child.props.children).some(grandChild =>
                    React.isValidElement(grandChild)
                    && (grandChild.type === 'img' || grandChild.props?.['data-streamdown'] === 'image-wrapper'),
                  )
                  if (hasImageInChildren) {
                    return true
                  }
                }
                // 递归检查更深层的子元素
                const checkNestedChildren = (element: React.ReactElement): boolean => {
                  if (element.props && element.props.children) {
                    return React.Children.toArray(element.props.children).some((nestedChild) => {
                      if (React.isValidElement(nestedChild)) {
                        if (typeof nestedChild.type === 'string'
                          && ['div', 'pre', 'table', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(nestedChild.type)) {
                          return true
                        }
                        if (nestedChild.type === 'img'
                          || (nestedChild.props && nestedChild.props['data-streamdown'] === 'image-wrapper')) {
                          return true
                        }
                        return checkNestedChildren(nestedChild)
                      }
                      return false
                    })
                  }
                  return false
                }

                if (checkNestedChildren(child)) {
                  return true
                }
              }
              return false
            })

            // 如果包含块级元素，使用 div 而不是 p
            if (hasBlockElements) {
              return <div {...props}>{children}</div>
            }
            return <div {...props}>{children}</div>
          },
        }}
      >
        {processedContent}
      </Streamdown>
    </div>
  )
}

export default StreamdownMarkdown
