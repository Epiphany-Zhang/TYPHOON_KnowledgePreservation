📂 台风科普与防灾创新平台 - 项目说明

🌪️ 项目简介：
"驭风知险"台风科普与防灾创新平台是一个基于React + TypeScript + Tailwind CSS的现代化教育平台，提供台风知识科普、互动测验、动态演示和防灾指南，帮助用户全面了解台风知识、掌握防灾技能。

📂 目录结构：
├── dist/            ⭐ 生产构建目录（推荐直接使用）
│   ├── index.html   → 在浏览器中打开此文件以预览网站
│   ├── assets/      → 打包的 CSS、JS 和其他资源文件
│   └── ...
├── src/             📝 源代码目录（用于开发和修改）
│   ├── components/  → React 组件
│   │   ├── Quiz/    → 测验相关组件
│   │   ├── Safety/  → 防灾指南组件
│   │   ├── Theory/  → 理论知识组件
│   │   ├── Typhoon/ → 台风可视化组件
│   │   └── ui/      → 基础UI组件
│   ├── pages/       → 页面组件
│   │   ├── Home.tsx      → 首页
│   │   ├── Theory.tsx    → 理论知识页面
│   │   ├── Quiz.tsx      → 测验页面
│   │   ├── Safety.tsx    → 防灾指南页面
│   │   └── Animation.tsx  → 动态演示页面
│   ├── data/        → 静态数据
│   │   └── typhoon-quiz.json → 测验题库
│   ├── assets/      → 资源文件
│   │   └── image/   → 图片资源
│   ├── hooks/       → 自定义React Hooks
│   ├── lib/         → 工具库
│   ├── theme/       → 主题配置
│   ├── layout/      → 布局组件
│   ├── utils/       → 工具函数
│   ├── App.tsx      → 主应用组件
│   └── main.tsx     → 入口文件
├── scripts/         → 构建脚本
│   └── build.mjs    → esbuild构建脚本
├── package.json     📦 项目依赖配置
├── tsconfig.json    → TypeScript配置
├── tailwind.config.js → Tailwind CSS配置
├── vercel.json      → Vercel部署配置
├── README.md        📖 项目详细文档
└── README.txt       📄 项目快速说明（本文件）

✨ 主要功能：
1. 📚 台风知识：详细介绍台风的形成条件、结构特征和等级分类
2. 🎮 互动测验：提供多道选择题，检验学习效果，并提供即时反馈
3. 🌊 动态演示：展示台风风场和浪场的动态变化，支持交互式探索
4. 🛡️ 防灾指南：提供台风预防措施、应急避险、灾后处理和物资清单

🚀 快速开始（三种选择）：

选项 1：直接使用（推荐给普通用户）
1. 进入 dist/ 目录
2. 双击 index.html 文件
3. 网站将在您的浏览器中打开！

选项 2：本地开发环境（推荐给开发者）
1. 确保已安装 Node.js 16.0 或更高版本
2. 在项目根目录打开终端
3. 运行命令：npm install
4. 运行命令：npm run dev
5. 在浏览器中访问 http://localhost:8000

选项 3：在线访问
直接访问已部署的网站：
https://typhoon-knowledge-preservation-ahty.vercel.app/

🔧 开发相关命令：
- npm install        → 安装项目依赖
- npm run dev        → 启动开发服务器
- npm run build      → 构建生产版本
- npm run start      → 启动生产服务器（需先构建）

📋 系统要求：
- Node.js 16.0 或更高版本（开发环境）
- 现代浏览器（Chrome、Firefox、Safari、Edge等）
- 网络连接（用于加载外部资源）

🛠️ 技术栈：
- React 18 → 用户界面构建
- TypeScript → 类型安全的JavaScript
- Tailwind CSS → 样式框架
- esbuild → 构建工具
- React Router → 路由管理
- Radix UI → 无障碍UI组件

📝 注意事项：
1. 本平台提供的信息仅供参考，实际防灾决策请以官方气象部门发布的预警和指导为准
2. 开发环境需要安装Node.js，生产环境可直接使用dist目录中的文件
3. 如需修改内容，请编辑src目录下的源代码，然后重新构建
4. 项目使用esbuild进行构建，相比传统构建工具速度更快

🐛 已知问题与解决方案：
1. 在某些旧版浏览器中可能存在兼容性问题，建议使用最新版浏览器
2. 移动设备上部分交互元素可能响应较慢，正在优化中
3. 离线使用时部分外部资源可能无法加载，已实现基本离线功能

📞 联系与反馈：
如有问题或建议，请通过以下方式联系：
- 邮箱：your-email@example.com
- GitHub Issues：https://github.com/your-username/typhoon-knowledge-platform/issues

📄 许可证：
本项目采用 MIT 许可证，详情请查看 LICENSE 文件

---
最后更新：2024年7月
