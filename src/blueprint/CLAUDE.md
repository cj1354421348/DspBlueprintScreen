# 模块: blueprint (核心逻辑)

### 导航 (Navigation)
[返回根目录](../../CLDE.md)

---

## 模块概述 (Module Overview)

`blueprint` 模块是本应用的核心业务逻辑引擎，负责处理《戴森球计划》蓝图的所有相关操作。它封装了从蓝图字符串的解析、校验，到数据结构的转换、空间坐标计算，再到批量编辑的全部功能。这是一个高度内聚、功能完备的模块，为上层UI和业务功能提供了坚实的数据基础。

## 核心职责 (Core Responsibilities)

1.  **蓝图解析与序列化**: 将游戏中的蓝图字符串与应用内的 TypeScript 数据结构 (`BlueprintData`) 进行相互转换。
2.  **数据校验**: 通过 MD5 哈希算法确保蓝图数据的完整性和有效性。
3.  **结构分析**: 将扁平的建筑列表转换为图数据结构，以分析建筑间的连接关系。
4.  **空间计算**: 将蓝图的二维网格坐标映射为行星表面的三维坐标，支持可视化。
5.  **批量编辑**: 提供可撤销的、基于命令模式的蓝图内容批量替换功能。

## 关键文件索引 (Key File Index)

| 文件路径 | 主要职责 | 关键组件/函数 |
| :--- | :--- | :--- |
| `parser.ts` | 蓝图字符串解析与序列化核心 | `fromStr()`, `toStr()`, `BlueprintData` (接口) |
| `md5.ts` | 跨环境的 MD5 哈希实现 | `digest()` |
| `buildingInfo.ts` | 建筑连接关系图构建 | `BuildingInfo` (class) |
| `planet.ts` | 蓝图空间坐标转换 | `findPosForAreas()`, `calcBuildingTrans()` |
| `replace.ts` | 蓝图内容批量替换 | `ReplaceCommand` (class) |

## 关键组件分析 (Key Component Analysis)

### `parser.ts`
本模块的基石。它通过自定义的 `BufferReader` 和 `BufferWriter`，实现了对 zlib 压缩和 Base64 编码后的二进制蓝图数据的高效读写。文件内为游戏中几乎所有可配置的建筑都定义了专门的参数解析器 (`*ParamParser`)，展现了对蓝图数据结构的深刻理解。`fromStr` 和 `toStr` 是模块对外暴露的主要接口。

### `md5.ts`
一个纯 TypeScript 实现的 MD5 算法。选择手写实现是为了保证在 Electron 的渲染器进程和主进程中都能有一致、可靠的哈希计算能力，从而避免了对 Node.js `crypto` 模块的依赖，保证了代码的跨环境兼容性。

### `buildingInfo.ts`
将 `parser.ts` 解析出的建筑列表 (`BlueprintBuilding[]`) 转换为邻接表，构建了建筑间的连接关系图。这是一个关键的数据结构转换，为后续进行蓝图的逻辑分析和可视化奠定了基础。

### `planet.ts`
一个数学密集型的空间几何计算模块。它理解游戏内行星的网格划分规则，能够将抽象的蓝图区域精确地定位到行星表面的经纬度上，并最终通过 `three.js` 的 `Matrix4` 为每个建筑生成可用于3D渲染的变换矩阵。

### `replace.ts`
采用命令模式 (`ReplaceCommand`) 实现的强大编辑工具。它能够根据灵活的范围设置，对蓝图中的配方、物品、过滤器和图标进行批量查找和替换。其内置的 `do`/`undo` 机制为实现可撤销的编辑器功能提供了完美的模型。

## 依赖关系 (Dependencies)

- **pako**: 用于 zlib (de)compression。
- **three**: 用于三维空间变换计算 (`Matrix4`, `Euler`)。
- **内部模块**:
    - `@/data/*`: 大量依赖于预定义的游戏数据，如物品ID (`items`)、配方 (`recipes`) 和图标 (`icons`)。
    - `@/command`: `replace.ts` 依赖于应用级的命令接口定义。

## AI 使用指引 (AI Usage Guide)

1.  **数据入口**: 所有对蓝图数据的操作都应始于调用 `parser.ts` 的 `fromStr()` 函数，获取结构化的 `BlueprintData` 对象。
2.  **功能组合**: 在实现新功能时，应充分利用本模块提供的不同组件。例如，要开发一个检查蓝图错误的工具，可以先用 `parser.ts` 解析，然后用 `buildingInfo.ts` 建图，最后在图上进行逻辑遍历和检查。
3.  **避免重复造轮子**: 模块内已包含 MD5 实现和二进制 I/O 工具，在扩展功能时应优先复用。
4.  **编辑操作**: 任何对蓝图数据的修改，都推荐封装成类似 `ReplaceCommand` 的命令对象，以便接入应用的撤销/重做系统。
