# 模块: views (视图组件)

### 导航 (Navigation)
[返回根目录](../../CLAUDE.md)

---

## 模块概述 (Module Overview)

`views` 模块是应用的用户界面（UI）核心，负责向用户展示数据、提供交互操作。它基于 Vue 3 和 Element Plus 组件库构建，包含了应用的所有主要页面级视图。该模块与底层的 `AppIO`（文件交互）和 `blueprint`（核心逻辑）模块紧密协作，将强大的数据处理能力转化为直观的用户体验。

## 核心职责 (Core Responsibilities)

1.  **主功能界面**: 提供蓝图筛选器的主要操作界面，包括条件选择、执行筛选和导出结果。
2.  **应用配置**: 提供一个设置弹窗，允许用户配置应用的工作目录（源、暂存、输出）。
3.  **用户反馈**: 在执行长时间操作（如初始化、筛选）时，提供加载提示和进度反馈，提升用户体验。
4.  **数据可视化**: 通过自定义组件（如 `BuildingIcon`）将游戏内的物品和配方以图标形式展示给用户。

## 关键文件索引 (Key File Index)

| 文件路径 | 主要职责 | 关键组件/函数 |
| :--- | :--- | :--- |
| `HomeView.vue` | 蓝图筛选与管理的主界面 | `populateSpawnData()`, `simpleFilter()`, `exportFilterBluepr()` |
| `Settings.vue` | 应用路径配置弹窗 | `selectDirectory()`, `saveConfig()` |
| `AboutView.vue` | “关于”页面 (功能较简单) | (N/A) |
| `components/BuildingIcon.vue` | 建筑/物品图标展示组件 | (N/A) |

## 关键组件分析 (Key Component Analysis)

### `HomeView.vue`
这是应用的“主引擎”视图，承载了最核心的业务流程。它 orchestrates 了从读取原始蓝图文件，到解析、预处理（统计建筑和物品数量）、根据用户选择进行筛选，再到最终导出结果的完整工作流。

**技术亮点**:
- **异步与性能**: 对于“初始化”和“筛选”这两个可能耗时极长的操作，该组件巧妙地使用了 `setImmediate` 将任务分解到事件循环的多个批次中执行，并通过 `ElLoading` 服务为用户提供即时的进度反馈，有效避免了UI线程的阻塞，保证了应用的响应性。
- **模块协同**: `HomeView` 是一个典型的“指挥官”，它不亲自执行复杂的计算，而是高效地调用 `AppIO` 和 `blueprint` 模块提供的底层服务来完成任务。

### `Settings.vue`
一个职责单一但至关重要的组件。它为 `AppIO/ConfigManager` 模块提供了一个图形化界面，允许用户通过系统原生的文件对话框 (`remote.dialog`) 来安全、便捷地设置应用的三个核心工作目录。该组件通过 `configManager` 单例与底层配置服务直接通信，实现了配置的加载和保存。

### `components/BuildingIcon.vue`
一个可复用的、专门用于展示游戏内物品/建筑图标的子组件。它被 `HomeView` 大量使用，构成了筛选条件选择界面的基础。

## 依赖关系 (Dependencies)

- **Vue 3**: 应用的UI框架。
- **Element Plus**: 提供高质量的UI组件库，如按钮、对话框、表单等。
- **Electron**: 通过 `@electron/remote` 访问主进程的功能，如系统对话框。
- **内部模块**:
    - `@/AppIO/*`: 深度依赖文件I/O模块来读写蓝图和配置文件。
    - `@/blueprint/parser`: 依赖核心解析器来处理蓝图字符串。
    - `@/data/*`: 依赖游戏元数据来展示物品图标和信息。
    - `@/MyIns/*`, `@/Toop/*`: 依赖自定义的单例管理器和工具函数。

## AI 使用指引 (AI Usage Guide)

1.  **UI与逻辑分离**: 在修改或添加新功能时，应保持当前良好的分离模式。UI相关的变更应在 `.vue` 文件的 `<template>` 和 `<style>` 部分，而业务逻辑应封装在 `<script setup>` 中，并优先调用其他模块的服务。
2.  **用户体验**: 对于任何可能超过500毫秒的操作，都应借鉴 `HomeView` 的做法，使用 `ElLoading` 或类似机制向用户提供反馈。
3.  **状态管理**: 当应用变得更复杂时，可以考虑将 `HomeView` 中的一些本地状态（如筛选结果 `outBluepr`）提升到 `src/store` 中进行管理，以实现更好的组件间通信和状态持久化。
