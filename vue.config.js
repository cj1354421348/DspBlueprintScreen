const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  devServer:{
    port:3000
  },
  pluginOptions: {
    electronBuilder: {
        builderOptions: {
          appId: 'com.example.dsqtool', // 项目唯一标识
          productName: 'DSQ', // 打包产物的前缀
          //copyright: 'Copyright © year ${author}', // 可用使用${}引用package.json里面配置项，配置项不存在会报错
          win: {  
            "icon": "./src/img/Frame.png",
            "target": [
              {
                "target": "nsis" // 我们要的目标安装包
              }
            ]
          },
          nsis: {
            "oneClick": false, // 是否一键安装
            "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
            "allowToChangeInstallationDirectory": true, // 允许修改安装目录
            // "installerIcon": "./src/img/Frame.png",// 安装图标
            // "uninstallerIcon": "./src/img/Frame.png",//卸载图标
            // "installerHeaderIcon": "./src/img/Frame.png", // 安装时头部图标
            "createDesktopShortcut": true, // 创建桌面图标
            "createStartMenuShortcut": true,// 创建开始菜单图标
            "shortcutName": "xxxx", // 图标名称
            //"include": "build/script/installer.nsh", // 包含的自定义nsis脚本 这个对于构建需求严格得安装过程相当有用。
          },
          extraResources: [
            { "from": "./config.json", "to": "../" }
        ],

        },
        nodeIntegration:true,
        
    },
},
//configureWebpack: { externals:{"fs": 'require("fs")',"path": 'require("path")'},target: 'electron-renderer' }
})
