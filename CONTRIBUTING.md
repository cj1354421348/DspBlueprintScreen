# 开发者指南

本文档面向希望参与开发、调试或扩展本项目的开发者。

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **前端框架** | Vue 3 + TypeScript |
| **桌面框架** | Electron 31 |
| **UI 组件库** | Element Plus |
| **状态管理** | Vuex 4 |
| **路由** | Vue Router 4 |
| **构建工具** | Vue CLI + vue-cli-plugin-electron-builder |
| **样式** | SCSS |

---

## 📁 项目结构

```
src/
├── App.vue              # 根组件（布局 + 核心逻辑）
├── background.ts        # Electron 主进程入口
├── main.ts              # Vue 渲染进程入口
├── AppConfig/           # 应用配置管理
├── AppIO/               # 文件系统交互（读/写/配置）
│   ├── ConfigManager.ts # 路径配置管理
│   ├── Read.ts          # 文件读取
│   └── Write.ts         # 文件写入/导出
├── blueprint/           # 蓝图解析核心逻辑
│   ├── parser.ts        # 蓝图字符串解析
│   └── replace.ts       # 蓝图替换逻辑
├── components/          # 全局可复用组件
├── data/                # 游戏静态数据（物品、配方、图标）
├── DataType/            # 类型定义
├── MyIns/               # 单例实例管理
│   ├── MapData.ts       # 蓝图数据存储
│   └── SeleceManag.ts   # 筛选条件管理
├── router/              # 路由配置
├── store/               # Vuex 状态管理
├── Toop/                # 工具函数
└── views/               # 页面视图组件
```

---

## 🚀 开发环境设置

### 环境要求

- **Node.js** ≥ 22（使用 `nvm use` 自动切换）
- **Yarn** 包管理器

### 安装与运行

```bash
# 1. 安装依赖
yarn install

# 2. 启动开发服务（热重载）
yarn electron:serve

# 3. 构建生产版本
yarn electron:build
```

---

## 🔧 核心模块说明

### 蓝图解析 (`src/blueprint/parser.ts`)

负责将蓝图 Base64 字符串解码并解析为 JavaScript 对象：

```typescript
import { fromStr } from '@/blueprint/parser';

const blueprintData = fromStr(base64String);
// blueprintData.header - 蓝图头信息（名称、描述等）
// blueprintData.buildings - 建筑数组
```

### 文件操作 (`src/AppIO/`)

- `ConfigManager.ts` — 读写 `config.json` 配置
- `Read.ts` — 递归读取蓝图目录下所有 `.txt` 文件
- `Write.ts` — 导出蓝图、持久化缓存数据

### 数据管理 (`src/MyIns/`)

使用单例模式管理全局状态：

```typescript
// 获取蓝图数据实例
const mapData = MapData.getInstance();
mapData.testData; // Map<string, newBaseData>

// 获取筛选条件实例
const selectManager = SeleceManag.getInstance();
selectManager.seleceIconArr;  // 包含条件
selectManager.excludeIconArr; // 排除条件
```

---

## 📦 添加新物品/配方

游戏更新后需要添加新物品时，修改以下文件：

| 文件 | 作用 |
|------|------|
| `src/data/items.ts` | 物品 ID 与名称映射 |
| `src/data/recipes.ts` | 配方数据 |
| `src/data/icons.ts` | 物品图标映射 |

详细添加方法见 [EXTENSION_GUIDE.md](./EXTENSION_GUIDE.md)。

---

## 🧪 调试技巧

### 开发者工具

开发模式自动启用 Chrome DevTools，可直接在渲染进程中调试。

### 主进程日志

主进程日志输出在运行 `yarn electron:serve` 的终端中。

### 蓝图数据查看

在 DevTools 控制台中：

```javascript
// 查看已加载的蓝图
MapData.getInstance().testData

// 查看当前筛选条件
SeleceManag.getInstance().seleceIconArr
```

---

## 📝 代码规范

- 使用 **TypeScript** 编写所有业务逻辑
- 组件使用 **`<script setup>` 语法**
- 样式使用 **SCSS** + **BEM 命名**（可选）
- 提交信息遵循 **Conventional Commits** 格式

---

## 🔀 Git 分支策略

| 分支 | 用途 |
|------|------|
| `main` | 稳定发布版本 |
| `dev` | 开发主分支 |
| `feature/*` | 功能开发分支 |
| `fix/*` | Bug 修复分支 |

---

## 📤 发布流程

项目配置了 GitHub Actions 自动发布：

1. 更新 `package.json` 中的 `version`
2. 提交并推送 tag（如 `v0.1.1`）
3. CI 自动构建并发布到 Releases

手动构建：

```bash
yarn electron:build
# 产物在 dist_electron/ 目录
```

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 `git checkout -b feature/your-feature`
3. 提交变更 `git commit -m 'feat: add new feature'`
4. 推送分支 `git push origin feature/your-feature`
5. 提交 Pull Request

---

## 📚 相关文档

- [CLAUDE.md](./CLAUDE.md) — AI 辅助开发指引 & 架构概览
- [EXTENSION_GUIDE.md](./EXTENSION_GUIDE.md) — 扩展新建筑指南
