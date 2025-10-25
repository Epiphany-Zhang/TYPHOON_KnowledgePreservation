# 台风科普与防灾创新平台

一个基于 React + TypeScript + Tailwind CSS 的现代化台风科普与防灾教育平台，提供互动式学习体验，帮助用户全面了解台风知识、掌握防灾技能。

## 🌪️ 项目简介

"驭风知险"台风科普与防灾创新平台是一个集知识科普、互动测验、动态演示和防灾指南于一体的综合性教育平台。通过直观的可视化效果和交互式体验，让用户深入了解台风的形成、结构、影响及防范措施，提高公众的防灾意识和自救能力。

## ✨ 主要功能

### 📚 台风知识
- **基础概念**：详细介绍台风的形成条件、结构特征和等级分类
- **科学原理**：深入解析台风的物理机制和气象学原理
- **历史案例**：展示历史上重大台风事件及其影响
- **可视化展示**：通过图表和动画直观呈现台风知识

### 🎮 互动测验
- **知识测试**：提供多道选择题，检验学习效果
- **即时反馈**：答题后立即显示正确答案和详细解释
- **进度追踪**：记录答题进度和成绩，帮助用户了解学习情况

### 🌊 动态演示
- **风场模拟**：展示台风风场的动态变化
- **浪场可视化**：呈现台风对海面的影响
- **交互式探索**：用户可调整参数观察不同条件下的台风表现

### 🛡️ 防灾指南
- **预防措施**：台风来临前的准备工作
- **应急避险**：台风期间的避险要点和安全措施
- **灾后处理**：台风过后的安全注意事项
- **物资清单**：应急物资准备建议

## 🏗️ 技术架构

### 前端技术栈
- **React 18**：现代化的用户界面构建
- **TypeScript**：类型安全的JavaScript超集
- **Tailwind CSS**：实用优先的CSS框架
- **esbuild**：极速的JavaScript构建工具
- **React Router**：单页应用路由管理
- **Radix UI**：无障碍访问的UI组件库

### 开发工具
- **PostCSS**：CSS转换工具
- **Autoprefixer**：自动添加CSS前缀
- **ESLint**：代码质量检查
- **Vercel**：自动化部署平台

## 📁 项目结构

```
台风科普与防灾创新平台/
├── public/                    # 静态资源
├── src/                       # 源代码
│   ├── components/            # 可复用组件
│   │   ├── Quiz/             # 测验相关组件
│   │   ├── Safety/           # 防灾指南组件
│   │   ├── Theory/           # 理论知识组件
│   │   ├── Typhoon/          # 台风可视化组件
│   │   └── ui/               # 基础UI组件
│   ├── pages/                # 页面组件
│   │   ├── Home.tsx          # 首页
│   │   ├── Theory.tsx        # 理论知识页面
│   │   ├── Quiz.tsx          # 测验页面
│   │   ├── Safety.tsx        # 防灾指南页面
│   │   └── Animation.tsx     # 动态演示页面
│   ├── data/                 # 静态数据
│   │   └── typhoon-quiz.json # 测验题库
│   ├── assets/               # 资源文件
│   │   └── image/            # 图片资源
│   ├── hooks/                # 自定义React Hooks
│   ├── lib/                  # 工具库
│   ├── theme/                # 主题配置
│   ├── layout/               # 布局组件
│   └── utils/                # 工具函数
├── scripts/                  # 构建脚本
│   └── build.mjs            # esbuild构建脚本
├── dist/                     # 构建输出目录
├── package.json              # 项目依赖和脚本
├── tsconfig.json            # TypeScript配置
├── tailwind.config.js       # Tailwind CSS配置
└── vercel.json              # Vercel部署配置
```

## 🚀 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/typhoon-knowledge-platform.git
   cd typhoon-knowledge-platform
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   服务器启动后，访问 http://localhost:8000 查看项目

4. **构建生产版本**
   ```bash
   npm run build
   ```
   
   构建完成后，静态文件将输出到 `dist` 目录

### 本地预览

构建完成后，可以通过以下方式预览生产版本：

1. **使用Python简单服务器**
   ```bash
   cd dist
   python -m http.server 8080
   ```
   然后访问 http://localhost:8080

2. **使用Node.js的serve包**
   ```bash
   npx serve dist
   ```

## 🌐 在线访问

项目已部署到Vercel，可通过以下链接直接访问：
[https://typhoon-knowledge-preservation-ahty.vercel.app/](https://typhoon-knowledge-preservation-ahty.vercel.app/)

## 🤝 贡献指南

我们欢迎所有形式的贡献，包括但不限于：

- 🐛 报告Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- 🎨 改进UI/UX设计

### 开发流程

1. **Fork项目**到你的GitHub账户
2. **创建功能分支**：`git checkout -b feature/amazing-feature`
3. **提交更改**：`git commit -m 'Add some amazing feature'`
4. **推送分支**：`git push origin feature/amazing-feature`
5. **创建Pull Request**

### 代码规范

- 使用TypeScript进行类型安全开发
- 遵循ESLint配置的代码规范
- 组件和函数使用清晰的命名
- 添加必要的注释和文档
- 确保代码通过所有测试

### 提交信息规范

请遵循[Conventional Commits](https://www.conventionalcommits.org/)规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

类型包括：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢以下开源项目和资源：

- [React](https://reactjs.org/) - 用户界面库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Radix UI](https://www.radix-ui.com/) - 无障碍UI组件
- [Lucide](https://lucide.dev/) - 图标库
- [esbuild](https://esbuild.github.io/) - 构建工具

## 📞 联系我们

如有任何问题或建议，请通过以下方式联系我们：

- 📧 邮箱：your-email@example.com
- 🐛 问题反馈：[GitHub Issues](https://github.com/your-username/typhoon-knowledge-platform/issues)
- 💬 讨论交流：[GitHub Discussions](https://github.com/your-username/typhoon-knowledge-platform/discussions)

---

⚠️ **免责声明**：本平台提供的信息仅供参考，实际防灾决策请以官方气象部门发布的预警和指导为准。

