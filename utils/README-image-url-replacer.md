# 图片URL替换工具

这个工具用于将Markdown内容中的相对路径图片替换为files数组中的实际URL，通过related_id进行匹配。

## 功能特性

- 支持多种Markdown图片格式
- 通过related_id匹配files数组中的实际URL
- 支持JSON数据直接处理
- 兼容现有的Markdown组件

## 支持的图片格式

1. `![alt text](/files/tools/related_id)` - 标准相对路径格式
2. `![alt text](related_id)` - 直接使用related_id格式
3. `![alt text](https://upload.dify.ai/files/tools/related_id?params)` - 完整URL格式

## 使用方法

### 1. 基本使用

```typescript
import { replaceImageUrlsInMarkdownAdvanced, type FileInfo } from '@/utils/image-url-replacer'

const markdownContent = "![图片](/files/tools/440c626b-e008-4517-a33a-adeececa64e0.png)"
const files: FileInfo[] = [
  {
    related_id: "440c626b-e008-4517-a33a-adeececa64e0",
    url: "https://upload.dify.ai/files/tools/440c626b-e008-4517-a33a-adeececa64e0.png?timestamp=123&nonce=test&sign=test",
    // ... 其他属性
  }
]

const processedMarkdown = replaceImageUrlsInMarkdownAdvanced(markdownContent, files)
// 结果: "![图片](https://upload.dify.ai/files/tools/440c626b-e008-4517-a33a-adeececa64e0.png?timestamp=123&nonce=test&sign=test)"
```

### 2. 处理JSON数据

```typescript
import { processJsonDataForImages } from '@/utils/image-url-replacer'

const jsonData = {
  outputs: {
    answer: "![图片](/files/tools/440c626b-e008-4517-a33a-adeececa64e0.png)"
  },
  files: [
    {
      related_id: "440c626b-e008-4517-a33a-adeececa64e0",
      url: "https://upload.dify.ai/files/tools/440c626b-e008-4517-a33a-adeececa64e0.png?timestamp=123&nonce=test&sign=test",
      // ... 其他属性
    }
  ]
}

const processedMarkdown = processJsonDataForImages(jsonData)
```

### 3. 在React组件中使用

#### StreamdownMarkdown组件

```tsx
import { StreamdownMarkdown } from '@/components/base/streamdown-markdown'
import type { FileInfo } from '@/utils/image-url-replacer'

function MyComponent() {
  const markdownContent = "![图片](/files/tools/440c626b-e008-4517-a33a-adeececa64e0.png)"
  const files: FileInfo[] = [
    {
      related_id: "440c626b-e008-4517-a33a-adeececa64e0",
      url: "https://upload.dify.ai/files/tools/440c626b-e008-4517-a33a-adeececa64e0.png?timestamp=123&nonce=test&sign=test",
      // ... 其他属性
    }
  ]

  return (
    <StreamdownMarkdown 
      content={markdownContent} 
      files={files} 
    />
  )
}
```

#### Markdown组件

```tsx
import { Markdown } from '@/components/base/markdown'
import type { FileInfo } from '@/utils/image-url-replacer'

function MyComponent() {
  const markdownContent = "![图片](/files/tools/440c626b-e008-4517-a33a-adeececa64e0.png)"
  const files: FileInfo[] = [
    {
      related_id: "440c626b-e008-4517-a33a-adeececa64e0",
      url: "https://upload.dify.ai/files/tools/440c626b-e008-4517-a33a-adeececa64e0.png?timestamp=123&nonce=test&sign=test",
      // ... 其他属性
    }
  ]

  return (
    <Markdown 
      content={markdownContent} 
      files={files} 
    />
  )
}
```

## API参考

### FileInfo接口

```typescript
interface FileInfo {
  id?: string
  tenant_id?: string
  type: string
  transfer_method: string
  remote_url?: string | null
  related_id: string  // 用于匹配的关键字段
  filename: string
  extension: string
  mime_type: string
  size: number
  url: string  // 实际的图片URL
}
```

### 函数

#### `replaceImageUrlsInMarkdownAdvanced(markdownContent, files)`

替换Markdown内容中的图片路径（支持多种格式）

**参数:**
- `markdownContent: string` - 包含图片路径的Markdown内容
- `files: FileInfo[]` - 文件信息数组

**返回:**
- `string` - 替换后的Markdown内容

#### `processJsonDataForImages(jsonData)`

从JSON数据中提取并替换图片URL

**参数:**
- `jsonData: any` - 包含outputs.answer和files的JSON数据

**返回:**
- `string` - 替换后的Markdown内容

## 测试

运行测试文件来验证功能：

```bash
# 在Node.js环境中运行测试
npx tsx utils/image-url-replacer.test.ts
```

## 注意事项

1. 如果找不到对应的related_id，图片路径将保持原样
2. 支持空数据处理，不会抛出错误
3. 替换是安全的，不会影响其他Markdown内容
4. 支持多种图片格式，确保兼容性
