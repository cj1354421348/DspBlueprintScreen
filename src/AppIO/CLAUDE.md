[根目录](../../CLAUDE.md) > [src](../) > **AppIO**

# AppIO 模块职责 (Module Responsibilities)

## 模块职责

`src/AppIO/` 模块是本应用的文件系统交互层，封装了所有与本地文件相关的底层操作。它负责管理应用的配置文件、读取蓝图数据以及将处理结果写回磁盘，为上层业务逻辑提供了统一、可靠的文件操作接口。

## 入口与启动

核心文件包括 `ConfigManager.ts`, `Read.ts`, 和 `Write.ts`。这些文件分别负责配置管理、文件读取和文件写入。

## 对外接口

该模块通过导出的类和函数，提供统一的文件操作接口，例如 `ConfigManager` 的 `getConfig()`, `saveConfig()` 方法，`Read.ts` 的 `getAllFiles()`, `readJsonFile()`, `readFiles()` 函数，以及 `Write.ts` 的 `createDir()`, `copyFile()`, `itemDataToJson()` 函数。

## 关键依赖与配置

- **Node.js 核心模块**: `fs`, `path`, `crypto` 用于文件操作和哈希计算。
- **Electron 模块**: `@electron/remote` 用于获取应用级的路径信息（如 `app.getPath`）。
- **内部模块**: `@/Toop/Tips` 用于显示提示信息，`@/DataType/tiemData` 依赖于特定的数据结构定义。

## 数据模型

主要处理文件路径字符串和 JSON 序列化的数据结构（如 `config.json` 内容和 `itemDataToJson` 转换后的数据）。

## 测试与质量

建议对文件读写操作进行单元测试和集成测试，以确保在各种文件系统环境下都能正确、安全地工作。

## 常见问题 (FAQ)

- 如何处理文件不存在或权限不足的错误？
- 如何安全地覆盖或更新现有文件？

## 相关文件清单

- `src/AppIO/ConfigManager.ts`
- `src/AppIO/Read.ts`
- `src/AppIO/Write.ts`

## 变更记录 (Changelog)

- **2025-09-04**: 更新了 `AppIO` 模块文档，合并了现有内容并完善了结构。
- **2025-09-04**: 首次创建 `AppIO` 模块文档骨架。
