# DspBlueprintScreen

本应用是一款用于《戴森球计划》蓝图的本地筛选和管理工具。

## 如何运行

本项目需要 **Node.js v22** 环境。

1.  **设置环境**
    ```bash
    nvm use
    ```

2.  **安装依赖**
    ```bash
    yarn install
    ```

3.  **启动应用**
    ```bash
    yarn electron:serve
    ```

## 配置

应用的路径配置在 `config.json` 文件中，您可以根据需要进行修改。

## 打包应用

```bash
yarn electron:build
```

---

## 扩展新建筑

如果需要添加对新建筑的支持，请查阅 [扩展建筑指南 (EXTENSION_GUIDE.md)](EXTENSION_GUIDE.md)。
