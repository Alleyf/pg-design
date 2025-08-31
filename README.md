# PhotoDesign 📸

一个专业的摄影设计项目管理平台，为摄影师、设计师和创意团队提供项目管理、预算控制、团队协作和灵感收集的一站式解决方案。

![PhotoDesign Preview](https://via.placeholder.com/800x400/1f2937/ffffff?text=PhotoDesign+Preview)

## ✨ 核心功能

### 🎯 项目管理
- 创建和管理多种类型的摄影项目（人像、风景、产品、婚礼、活动、商业等）
- 项目状态跟踪（策划中、已预约、进行中、已完成）
- 项目详情和概览展示

### 💰 预算管理
- 项目预算设置和跟踪
- 费用分类管理（设备、场地、团队、道具、差旅等）
- 支出状态监控（计划中、已确认、已支付）

### 👥 团队协作
- 团队成员管理和角色分配
- 联系信息和确认状态跟踪
- 薪酬管理和支付状态跟踪

### 📝 任务管理
- 详细的任务清单系统
- 任务优先级和分类管理
- 截止日期和负责人分配

### 🎨 灵感收集
- 灵感图片收集和分类
- 标签系统便于快速检索
- 支持多种灵感类别（姿势、灯光、构图、色彩、氛围等）

### 👤 客户管理
- 客户信息和联系方式管理
- 项目需求记录
- 交付日期和格式要求跟踪

### 📷 拍摄规划
- 设备清单管理（相机、镜头、灯光、配件）
- 道具和服装清单
- 拍摄设置和特殊要求记录

## 🛠️ 技术栈

### 前端框架
- **React 18.3.1** - 现代化的前端框架
- **TypeScript 5.5.3** - 类型安全的JavaScript
- **Vite 5.4.2** - 快速的构建工具

### 样式和UI
- **Tailwind CSS 3.4.1** - 实用优先的CSS框架
- **Lucide React 0.344.0** - 优雅的图标库

### 开发工具
- **ESLint 9.9.1** - 代码质量检查
- **PostCSS** - CSS处理工具
- **TypeScript ESLint** - TypeScript代码规范

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm, yarn 或 pnpm

### 安装依赖
```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm
pnpm install
```

### 启动开发服务器
```bash
# 使用 npm
npm run dev

# 使用 yarn  
yarn dev

# 使用 pnpm
pnpm dev
```

项目将在 `http://localhost:5173` 启动

### 构建生产版本
```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 📁 项目结构

```
PhotoDesign/
├── src/
│   ├── components/           # React 组件
│   │   ├── project/         # 项目相关组件
│   │   │   ├── BudgetManager.tsx      # 预算管理
│   │   │   ├── ChecklistManager.tsx   # 任务清单
│   │   │   ├── ClientManager.tsx      # 客户管理
│   │   │   ├── InspirationBoard.tsx   # 灵感看板
│   │   │   ├── PlanningDetails.tsx    # 拍摄规划
│   │   │   ├── ProjectOverview.tsx    # 项目概览
│   │   │   └── TeamManager.tsx        # 团队管理
│   │   ├── CreateProjectModal.tsx     # 创建项目弹窗
│   │   ├── Header.tsx                 # 页面头部
│   │   ├── ProjectDetail.tsx          # 项目详情页
│   │   └── ProjectList.tsx            # 项目列表
│   ├── types/
│   │   └── project.ts       # 项目类型定义
│   ├── App.tsx              # 主应用组件
│   ├── main.tsx             # 应用入口
│   ├── index.css            # 全局样式
│   └── vite-env.d.ts        # Vite 环境类型
├── public/                  # 静态资源
├── eslint.config.js         # ESLint 配置
├── postcss.config.js        # PostCSS 配置
├── tailwind.config.js       # Tailwind CSS 配置
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 配置
└── package.json             # 项目依赖和脚本
```

## 🎨 功能特色

### 📊 项目类型支持
- **人像摄影** - 个人写真、艺术人像
- **风景摄影** - 自然风光、城市景观
- **产品摄影** - 商品拍摄、电商图片
- **婚礼摄影** - 婚礼纪实、婚纱照
- **活动摄影** - 会议、庆典、演出
- **商业摄影** - 企业宣传、广告拍摄

### 🔄 项目状态管理
- **策划中** - 项目初期规划阶段
- **已预约** - 确定拍摄时间和地点
- **进行中** - 正在执行拍摄
- **已完成** - 拍摄和后期处理完成

### 💡 智能分类系统
- **设备管理** - 按类型分类（相机、镜头、灯光、配件）
- **任务分类** - 按功能分组（设备、场地、团队、创意、物流）
- **费用分类** - 按用途归类（设备、场地、团队、道具、差旅）
- **灵感分类** - 按元素分类（姿势、灯光、构图、色彩、氛围）

## 🔧 开发指南

### 组件开发
项目采用组件化架构，每个组件都有明确的职责：

- `Header` - 全局导航和操作按钮
- `ProjectList` - 项目列表展示和筛选
- `ProjectDetail` - 项目详情容器
- `CreateProjectModal` - 项目创建表单
- 各种 Manager 组件 - 专门负责特定功能模块

### 状态管理
目前使用 React 内置的状态管理：
- `useState` 用于组件局部状态
- Props 传递用于组件间通信
- 未来可考虑集成 Zustand 或 Redux 用于复杂状态管理

### 样式指南
- 使用 Tailwind CSS 实用类
- 遵循响应式设计原则
- 深色主题为主色调
- 保持组件样式的一致性

## 🎯 使用场景

### 摄影师
- 管理多个拍摄项目
- 跟踪设备和道具清单
- 控制项目预算和成本
- 收集拍摄灵感和参考

### 设计师
- 视觉设计项目管理
- 创意概念整理
- 客户需求跟踪
- 团队协作管理

### 项目经理
- 跨项目资源协调
- 进度和预算监控
- 团队工作分配
- 客户关系维护

## 🔮 未来规划

### 短期目标
- [ ] 数据持久化（本地存储）
- [ ] 项目导入/导出功能
- [ ] 更多项目模板
- [ ] 移动端适配优化

### 中期目标
- [ ] 云端数据同步
- [ ] 团队协作功能
- [ ] 文件上传和管理
- [ ] 通知和提醒系统

### 长期目标
- [ ] AI 智能推荐
- [ ] 第三方应用集成
- [ ] 移动端 App
- [ ] 多语言支持

## 🤝 贡献指南

欢迎贡献代码和建议！请遵循以下步骤：

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 遵循 ESLint 规则
- 使用 TypeScript 类型注解
- 编写清晰的组件和函数注释
- 保持代码格式一致性

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。详情请查看 [LICENSE](LICENSE) 文件。

### MIT 许可证要点
- ✅ 允许商业使用
- ✅ 允许修改和分发
- ✅ 允许私人使用
- ✅ 允许专利使用
- ⚠️ 必须包含许可证和版权声明
- ❌ 不提供任何担保

## 💖 支持项目

如果这个项目对你有帮助，欢迎通过以下方式支持我们：

### ⭐ GitHub Star
给我们一个 Star，这是对我们最大的鼓励！

### ☕ 为爱发电

<div align="center">

**如果你觉得这个项目有用，可以请开发者喝杯咖啡 ☕**

| 微信打赏 | 支付宝打赏 | 爱发电 |
|---------|-----------|--------|
| <img src="./assets/wechat-donate.png" alt="微信打赏" width="200"/> | <img src="./assets/alipay-donate.png" alt="支付宝打赏" width="200"/> | <img src="./assets/afdian-qr.png" alt="爱发电" width="200"/> |
| 微信扫码打赏 | 支付宝扫码打赏 | [点击支持](https://afdian.net/a/photodesign) |


</div>

### 🎁 其他支持方式
- 🐛 提交 Bug 报告
- 💡 提出新功能建议
- 📝 完善项目文档
- 🔀 贡献代码
- 📢 推荐给朋友

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 📋 提交 Issue
- 💬 发起 Discussion
- 📧 邮件联系：[alleyf@qq.com]

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给我们一个 Star！**

**Made with ❤️ by PhotoDesign Team**

*让每一次拍摄都充满创意与专业* 📸

</div>