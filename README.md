# Structurize.me

Structurize.me 是一个使用 AI 将非结构化内容转换为结构化 CSV 数据的工具。

## 功能特点

- 输入任意文本内容和结构化指令
- 使用 AI 自动将内容转换为 CSV 格式
- 下载生成的 CSV 文件

## 技术栈

- Next.js 15.2.3
- React 18.3.1
- Tailwind CSS
- GenKit AI (Google Gemini AI)

## 开始使用

1. 克隆此仓库
2. 安装依赖：
   ```bash
   npm install
   ```
3. 创建 `.env` 文件并添加 Google Gemini API 密钥：
   ```
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```
4. 启动开发服务器：
   ```bash
   npm run dev
   ```
5. 访问 http://localhost:9003

## 最近更新

- **2024-04-17**: 修复了按钮不可见问题，替换了实验性的 `useActionState` 钩子。详细信息见 [docs/button-fix-summary.md](docs/button-fix-summary.md)。

## 使用方法

1. 在"Content"框中粘贴或输入文本内容
2. 在"Instructions"框中提供如何结构化内容的指令
3. 点击"Generate CSV"按钮
4. 生成后，点击"Download CSV"按钮下载文件

## 许可证

MIT
