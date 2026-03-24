# NestJS Simple Admin - 前端

## 项目概述

本项目是一个**后台管理系统**的前端应用，旨在为 NestJS 实现的 RBAC（基于角色的访问控制）权限管理提供可视化的操作界面。系统设计简洁，核心功能是对用户、角色、权限等 RBAC 相关资源进行增删改查及关联配置。

## 模块说明

系统模块划分为以下两类：

### RBAC 核心模块

- **用户管理**：用户账号的创建、编辑、禁用、角色分配
- **角色管理**：角色的定义、权限绑定、菜单关联
- **权限管理**：权限点的维护与角色分配
- **菜单管理**：系统菜单结构配置及权限关联

### 通用功能模块

- **全局设置**：系统级配置（如站点名称、Logo、基础参数等）
- **主题设置**：亮色/暗色主题切换、主题色定制等

> 通用模块虽不在 RBAC 范畴内，但作为后台系统的常用能力，统一纳入本系统。

## 技术栈

| 类别 | 技术选型 | 说明 |
|------|----------|------|
| 框架 | React 19 | 核心 UI 框架 |
| 路由 | React Router 7 | 单页应用路由 |
| 状态管理 | Zustand | 轻量级全局状态 |
| UI 组件 | shadcn/ui | 基于 Radix UI 的可定制组件库 |
| 图标 | Lucide React | 图标库 |
| 构建工具 | Vite 7 | 开发与构建 |
| 语言 | TypeScript | 类型安全 |

## 项目结构

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/       # 布局组件（侧边栏、顶栏、主布局、页面头）
│   │   └── ui/           # shadcn 组件
│   ├── pages/            # 页面（仪表盘、用户、角色、权限、菜单、设置）
│   ├── stores/           # Zustand 状态（auth、theme）
│   ├── hooks/            # 公共 hooks（useTheme、useFetch）
│   ├── lib/              # 工具与 API 封装（api、mock、utils）
│   ├── routes/           # 路由配置
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm / npm / yarn

### 安装依赖

```bash
npm install
```

### 初始化 shadcn/ui

```bash
npx shadcn@latest init
```

### 安装 Lucide 图标

```bash
npm install lucide-react
```

### 开发

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 预览构建产物

```bash
npm run preview
```

## 后续待办

- [x] 配置 shadcn/ui 与 Tailwind CSS
- [x] 搭建基础布局（侧边栏、顶栏、内容区）
- [x] 实现 RBAC 各模块页面（用户、角色、权限、菜单、仪表盘）
- [x] 实现全局设置页面
- [x] 封装 RESTful fetch API 与 Mock 接口
- [ ] 对接 NestJS 后端 API（替换 Mock）
- [ ] 实现 RBAC 增删改查与权限校验
