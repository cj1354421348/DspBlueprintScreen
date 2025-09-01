# 模块: store (状态管理)

### 导航 (Navigation)
[返回根目录](../../CLAUDE.md)

---

## 模块概述 (Module Overview)

`store` 模块负责应用的全局状态管理，基于 Vuex 4 构建。它的主要职责是提供一个集中式的、可预测的方式来存储和管理跨组件共享的数据。

## 当前状态 (Current Status)

**该模块目前处于骨架阶段，并未实现任何具体的状态管理逻辑。**

在对 `src/store/index.ts` 的分析中发现，该文件仅初始化并导出了一个空的 Vuex store 实例。`state`、`getters`、`mutations` 和 `actions` 均为空。

这表明，当前应用的核心数据流是通过自定义的单例服务（如 `MapData`, `SeleceManag`）和组件的本地状态来管理的，而没有利用 Vuex。

## 架构意义与未来展望 (Architectural Significance & Future Outlook)

尽管当前未使用，但 `store` 模块的存在为应用的未来扩展奠定了重要的架构基础。

-   **集中化管理**: 当应用功能变得更加复杂，需要在多个视图（如 `HomeView` 和 `Settings`）之间共享和同步状态时，应将这些共享状态迁移到本模块中进行管理。
-   **可预测性**: 通过遵循 Vuex 的“单向数据流”模式（State -> View -> Actions -> Mutations），可以使状态变化变得更加明确和易于调试。
-   **组件解耦**: 将状态从组件中抽离出来，可以降低组件间的耦合度，使组件本身更专注于UI展示。

## AI 使用指引 (AI Usage Guide)

1.  **优先考虑迁移**: 在开发新功能或重构现有功能时，如果遇到需要跨多个组件传递 props 或事件（prop drilling）的情况，应优先考虑将相关状态提升到本 Vuex store 中。
2.  **遵循Vuex规范**: 添加新的状态时，应遵循 Vuex 的最佳实践：
    *   在 `state` 中定义数据。
    *   通过 `mutations` 同步地修改数据。
    *   通过 `actions` 提交 `mutations`，并处理任何异步逻辑。
    *   通过 `getters` 派生或计算状态。
3.  **模块化**: 如果未来全局状态变得庞大，可以将 store 拆分为多个模块（Modules），以保持代码的组织性和可维护性。
