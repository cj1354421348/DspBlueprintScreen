[根目录](../../CLAUDE.md) > [src](../) > **blueprint**

# blueprint 模块职责 (Module Responsibilities)

## 模块职责

`src/blueprint/` 模块是应用程序的核心业务逻辑层，专门负责《戴森球计划》游戏蓝图的解析、处理和管理。它将原始的蓝图字符串转换为应用程序可操作的数据结构，并提供对蓝图内容进行分析、替换等功能。

## 入口与启动

核心文件包括 `parser.ts`, `buildingInfo.ts`, `planet.ts`, `replace.ts`, 和 `md5.ts`。其中 `parser.ts` 是蓝图解析的入口，`replace.ts` 处理蓝图内容的替换。

## 对外接口

通过导出的函数和类，提供蓝图字符串的解析、蓝图数据的访问、蓝图内容的修改（替换）以及蓝图 MD5 计算等功能。

## 关键依赖与配置

- **内部模块**: 可能依赖于 `src/DataType/` 中定义的数据类型 (`BaseData`, `tiemData`)，以及 `src/data/` 中的游戏静态数据（如 `building`, `items`, `recipes`）。
- **加密库**: `md5.ts` 用于计算蓝图内容的哈希值。

## 数据模型

- 定义了蓝图内部表示的数据结构，可能包括建筑列表、行星信息、配方信息等。
- `buildingInfo.ts` 和 `planet.ts` 可能定义了蓝图中建筑和行星相关的详细数据结构。

## 测试与质量

蓝图解析是核心且复杂的逻辑，强烈建议为其编写全面的单元测试和集成测试，以覆盖各种蓝图格式、边缘情况和错误数据。替换功能也应进行充分测试。

## 常见问题 (FAQ)

- 如何处理不同版本的蓝图格式？
- 如何在蓝图中查找特定建筑或配方？
- 如何安全地修改蓝图内容并确保其有效性？

## 相关文件清单

- `src/blueprint/parser.ts`
- `src/blueprint/buildingInfo.ts`
- `src/blueprint/planet.ts`
- `src/blueprint/replace.ts`
- `src/blueprint/md5.ts`

## 变更记录 (Changelog)

- **2025-09-04**: 更新了 `blueprint` 模块文档，合并了现有内容并完善了结构。
- **2025-09-04**: 首次创建 `blueprint` 模块文档骨架。
