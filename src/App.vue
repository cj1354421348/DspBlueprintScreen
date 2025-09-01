<template>
  <div class="app-container">
    <el-button class="settings-button" :icon="Setting" circle @click="openSettingsDialog" />
    <router-view />
    <SettingsDialog ref="settingsDialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SettingsDialog, { SettingsDialogInstance } from './views/Settings.vue';
import { Setting } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'App',
  components: {
    SettingsDialog,
  },
  setup() {
    const settingsDialog = ref<SettingsDialogInstance | null>(null);

    const openSettingsDialog = () => {
      if (settingsDialog.value) {
        settingsDialog.value.openDialog();
      }
    };

    return {
      settingsDialog,
      openSettingsDialog,
      Setting,
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.app-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.settings-button {
  position: absolute;
  top: -45px;
  right: 15px;
  z-index: 100;
}
</style>
