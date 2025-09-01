# 模块: MyIns (单例服务实例)

### 导航 (Navigation)
[返回根目录](../../CLAUDE.md)

---

## 模块概述 (Module Overview)

`MyIns` (My Instances) 模块是应用中所有**单例服务**的集中管理中心。它采用了单例设计模式，确保应用在运行时，对于一些核心的服务和数据管理器，只存在唯一的实例。这种模式对于管理全局状态、共享数据和提供统一的服务接口非常有效。

该模块不仅定义了各个单例类，还提供了一个通用的 `BaseIns` 基类，简化了单例的创建过程。

## 核心职责 (Core Responsibilities)

1.  **提供单例基类**: `BaseIns` 类提供了一个可继承的通用 `getInstance()` 静态方法，使得任何子类都能轻松实现单例模式。
2.  **管理蓝图元数据**: `MapData` 单例负责在内存中维护所有已处理蓝图的索引，并将其持久化到本地的 `主文件.json` 缓存中。
3.  **管理UI筛选状态**: `SeleceManag` 单例负责实时跟踪和管理用户在主界面上选择的所有筛选条件。

## 关键文件索引 (Key File Index)

| 文件路径 | 主要职责 | 关键组件/函数 |
| :--- | :--- | :--- |
| `BaseIns.ts` | 通用单例模式基类 | `BaseIns` (class), `getInstance()` |
| `MapData.ts` | 蓝图元数据索引管理器 | `MapData` (class), `saveData()`, `getDataforLong()` |
| `SeleceManag.ts` | UI筛选条件状态管理器 | `SeleceManag` (class), `setSeleceIcon()`, `seleceIconArr` (getter) |

## 架构模式与分析 (Architectural Pattern & Analysis)

### `BaseIns` 与继承式单例
模块通过 `BaseIns` 基类巧妙地实现了一种可复用的单例模式。子类只需 `extends BaseIns` 即可，无需重复编写 `getInstance` 的逻辑。`getInstance` 内部通过 `this` 关键字对子类的引用，是其实现的关键。此外，它还将子类自动挂载到 `window` 对象，为调试提供了便利。

### `MapData`：数据持久化与缓存层
`MapData` 是一个典型的**数据访问对象（DAO）**与**缓存**的结合体。
- 作为DAO，它抽象了对 `主文件.json` 的读写操作（通过调用 `AppIO` 模块）。
- 作为缓存，它将 `主文件.json` 的内容加载到内存的 `Map` 对象中，为 `HomeView` 提供了对蓝图元数据的高效访问，避免了在每次筛选时都进行文件I/O。

### `SeleceManag`：UI状态的“外部存储”
`SeleceManag` 体现了**将UI状态从组件中分离**的思想。`HomeView` 本可以将筛选条件作为本地的 `ref` 或 `reactive` 对象来管理，但通过将其移入一个专用的单例服务，获得了以下好处：
- **逻辑解耦**: `HomeView` 更专注于业务流程的编排，而 `SeleceManag` 则专注于筛选条件这一具体状态的管理。
- **易于扩展**: 如果未来有其他组件也需要访问或修改筛选条件，它们可以直接与 `SeleceManag` 交互，而无需通过复杂的 props 和事件与 `HomeView` 通信。
- **替代Vuex**: 在一个小型应用中，这种单例服务模式可以作为 Vuex 的一种轻量级替代方案来管理全局或跨组件状态。

## AI 使用指引 (AI Usage Guide)

1.  **访问实例**: 在应用代码中，应始终通过 `ClassName.getInstance()` 的方式来获取这些单例服务的唯一实例，绝不能手动 `new ClassName()`。
2.  **添加新服务**: 如果需要添加一个新的全局服务（例如，一个管理用户偏好的服务），推荐的做法是创建一个新的类继承自 `BaseIns`，并将其放在本模块中。
3.  **职责分离**: 在使用这些服务时，应尊重它们的职责划分。例如，UI组件应与 `SeleceManag` 交互来更新筛选条件，而数据处理逻辑则应与 `MapData` 交互来获取蓝图信息。
