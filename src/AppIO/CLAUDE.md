# 模块: AppIO (文件交互)

### 导航 (Navigation)
[返回根目录](../../CLAUDE.md)

---

## 模块概述 (Module Overview)

`AppIO` 模块是本应用的文件系统交互层，封装了所有与本地文件相关的底层操作。它负责管理应用的配置文件、读取蓝图数据以及将处理结果写回磁盘，为上层业务逻辑提供了统一、可靠的文件操作接口。

## 核心职责 (Core Responsibilities)

1.  **配置管理**: 加载、创建、校验和保存应用的 `config.json` 文件，统一管理文件路径。
2.  **文件读取**: 提供递归扫描目录、安全读取 JSON、批量读取文本文件并计算哈希值等功能。
3.  **文件写入**: 支持将特定数据结构（如 `Map`）序列化为 JSON 文件，并能安全地复制文件，避免覆盖。

## 关键文件索引 (Key File Index)

| 文件路径 | 主要职责 | 关键组件/函数 |
| :--- | :--- | :--- |
| `ConfigManager.ts` | 应用配置管理器 | `ConfigManager` (单例), `getConfig()`, `saveConfig()` |
| `Read.ts` | 文件读取工具集 | `getAllFiles()`, `readJsonFile()`, `readFiles()` (with MD5) |
| `Write.ts` | 文件写入工具集 | `createDir()` (保存Map), `copyFile()`, `itemDataToJson()` |

## 关键组件分析 (Key Component Analysis)

### `ConfigManager.ts`
采用单例模式 (`ConfigManager.getInstance()`) 确保全局只有一个配置实例。它智能处理开发和生产环境的路径差异，并对 `config.json` 中配置的路径进行存在性检查和安全回退，极大地提升了应用的健壮性。

### `Read.ts`
提供了多样化的文件读取能力。`getAllFiles()` 是蓝图文件扫描的入口。`readFiles()` 函数通过异步读取并结合 MD5 哈希计算，为蓝图文件的唯一性识别和内容比对提供了高效的基础。

### `Write.ts`
封装了数据写入的通用逻辑。`copyFile()` 在处理文件复制时，通过自动重命名来防止意外覆盖，是一个非常实用的功能。`createDir()` 和 `itemDataToJson()` 则为特定数据结构的持久化提供了便捷的接口。

## 依赖关系 (Dependencies)

- **Node.js 核心模块**: `fs`, `path`, `crypto` 用于文件操作和哈希计算。
- **Electron 模块**: `@electron/remote` 用于获取应用级的路径信息（如 `app.getPath`）。
- **内部模块**:
    - `@/Toop/Tips`: 用于向用户显示操作提示和错误信息。
    - `@/DataType/tiemData`: 依赖于特定的数据结构定义。

## AI 使用指引 (AI Usage Guide)

1.  **文件操作入口**: 当需要与文件系统交互时，应优先调用本模块提供的函数，而不是直接使用 `fs` 模块，以复用已有的安全检查和错误处理逻辑。
2.  **路径获取**: 任何需要获取根目录、暂存目录或输出目录的地方，都应通过 `configManager.getConfig()` 来获取，以确保路径的一致性。
3.  **扩展功能**: 若需添加新的文件读写功能，应在本模块内进行扩展，并遵循现有代码的异步和错误处理模式。
