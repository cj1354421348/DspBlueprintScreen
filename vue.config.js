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
          extraResources: [
            { "from": "./config.json", "to": "../" }
        ],
        },
        nodeIntegration:true,
        
    },
},
//configureWebpack: { externals:{"fs": 'require("fs")',"path": 'require("path")'},target: 'electron-renderer' }
})
