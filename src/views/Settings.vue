<template>
  <el-dialog v-model="dialogVisible" title="设置" width="500">
    <el-form :model="config" label-width="120px">
      <el-form-item>
        <template #label>
          <span>蓝图源文件路径</span>
          <el-tooltip content="所有蓝图的路径" placement="top">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </template>
        <el-input v-model="config.rootPath" />
        <el-button @click="selectDirectory('rootPath')">选择</el-button>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span>蓝图暂存文件路径</span>
          <el-tooltip content="筛选出来的暂存路径" placement="top">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </template>
        <el-input v-model="config.stagingPath" />
        <el-button @click="selectDirectory('stagingPath')">选择</el-button>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span>蓝图输出文件路径</span>
          <el-tooltip content="一般填游戏蓝图文件夹" placement="top">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </template>
        <el-input v-model="config.outputPath" />
        <el-button @click="selectDirectory('outputPath')">选择</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConfig">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { configManager } from '../AppIO/ConfigManager';
import { QuestionFilled } from '@element-plus/icons-vue'

export interface SettingsDialogInstance {
  openDialog: () => void;
}

const remote = window.require('@electron/remote');

export default defineComponent({
  name: 'SettingsDialog',
  components: {
    QuestionFilled,
  },
  setup() {
    const dialogVisible = ref(false);
    const config = ref({
      rootPath: '',
      stagingPath: '',
      outputPath: '',
    });

    onMounted(() => {
      config.value = configManager.getConfig();
    });

    const selectDirectory = async (key: 'rootPath' | 'stagingPath' | 'outputPath') => {
      const result = await remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
      if (!result.canceled && result.filePaths.length > 0) {
        config.value[key] = result.filePaths[0];
      }
    };

    const saveConfig = () => {
      configManager.saveConfig(config.value);
      dialogVisible.value = false;
    };
    
    const openDialog = () => {
      config.value = configManager.getConfig();
      dialogVisible.value = true;
    };

    return {
      dialogVisible,
      config,
      selectDirectory,
      saveConfig,
      openDialog,
    };
  },
});
</script>
