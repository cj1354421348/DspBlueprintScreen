<template>
  <el-container class="app-layout">
    <!-- 顶栏 -->
    <el-header class="app-header">
      <div class="header-left">
        <div class="logo-icon">⚡</div>
        <span class="logo-text">DSP 蓝图筛选</span>
        <div v-if="isInitialized" class="status-badge">
          <span class="status-dot"></span>
          {{ dataCount }} 个蓝图
        </div>
      </div>
      <div class="header-right">
        <el-popconfirm
          title="初始化会重新扫描所有蓝图，耗时较长，确定执行吗？"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="handleInit"
        >
          <template #reference>
            <button class="header-btn" :disabled="isInitializing">
              <span v-if="isInitializing" class="loading-spinner"></span>
              <span v-else>🔄</span>
              重新初始化
            </button>
          </template>
        </el-popconfirm>
        <button class="header-btn header-btn--icon" @click="openSettingsDialog">
          ⚙️
        </button>
      </div>
    </el-header>

    <el-container class="app-body">
      <!-- 侧边栏 -->
      <el-aside class="app-sidebar" width="340px">
        <FilterPanel
          ref="filterPanel"
          v-model:build-num="buildNum"
          :is-filtering="isFiltering"
          :is-initialized="isInitialized"
          @filter="handleFilter"
          @export="handleExport"
          @clear="handleClear"
        />
      </el-aside>

      <!-- 主内容区 -->
      <el-main class="app-main">
        <router-view
          :results="filterResults"
          :is-initialized="isInitialized"
          :result-count="filterResults.length"
          :selected-ids="selectedIds"
          @update:selected-ids="selectedIds = $event"
        />
      </el-main>
    </el-container>

    <SettingsDialog ref="settingsDialog" />

    <!-- 首次使用设置引导弹窗 -->
    <el-dialog
      v-model="showSetupGuide"
      title="⚙️ 初次使用设置"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-alert
        title="请先配置蓝图路径"
        type="warning"
        :closable="false"
        show-icon
        class="setup-alert"
      >
        使用前需要设置以下路径，否则无法正常工作。
      </el-alert>
      <div class="setup-content">
        <p>1. <strong>蓝图源文件路径</strong> - 存放所有蓝图的文件夹</p>
        <p>2. <strong>蓝图暂存文件路径</strong> - 用于缓存解析数据</p>
        <p>3. <strong>蓝图输出文件路径</strong> - 筛选后导出的目标位置</p>
      </div>
      <template #footer>
        <el-button type="primary" @click="openSettingsFromGuide">
          立即设置
        </el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, provide, onMounted, computed } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import { ElLoading } from 'element-plus';
import SettingsDialog from './views/Settings.vue';
import FilterPanel from './components/FilterPanel.vue';
import { configManager } from '@/AppIO/ConfigManager';
import { MapData } from '@/MyIns/MapData';
import { MapPool } from '@/Toop/MapPool';
import { SeleceManag } from '@/MyIns/SeleceManag';
import { getAllFiles, readFiles } from '@/AppIO/Read';
import { copyFile, itemDataToJson } from '@/AppIO/Write';
import { fromStr } from '@/blueprint/parser';
import { recipeIconId2 } from '@/data/icons';
import { BuilToop } from '@/Toop/BuilToop';
import { Tipsessage } from '@/Toop/Tips';
import { newBaseData } from '@/DataType/BaseData';

// 状态
const settingsDialog = ref<any>(null);
const filterPanel = ref<any>(null);
const buildNum = ref(0);
const isInitializing = ref(false);
const isFiltering = ref(false);
const isInitialized = ref(false);
const filterResults = ref<newBaseData[]>([]);
const selectedIds = ref<Set<string>>(new Set());
const outBluepr = new Set<string>();
const showSetupGuide = ref(false);

// 计算属性
const dataCount = computed(() => MapData.getInstance().testData.size);

// 提供给子组件
provide('buildNum', buildNum);

// 挂载时恢复持久化数据
onMounted(() => {
  const config = configManager.getConfig();
  
  // 检查是否已配置路径
  if (!config.rootPath || !config.stagingPath || !config.outputPath) {
    showSetupGuide.value = true;
    return;
  }
  
  // 从持久化文件恢复数据
  MapData.getInstance().getDataforLong(config.stagingPath + "\\主文件.json");
  
  // 如果有缓存数据，标记为已初始化
  if (MapData.getInstance().testData.size > 0) {
    isInitialized.value = true;
  }
});

const openSettingsDialog = () => {
  settingsDialog.value?.openDialog();
};

const openSettingsFromGuide = () => {
  showSetupGuide.value = false;
  settingsDialog.value?.openDialog();
};

// 初始化蓝图（重新扫描）
const handleInit = async () => {
  const config = configManager.getConfig();
  
  if (!config.rootPath) {
    showSetupGuide.value = true;
    return;
  }
  
  isInitializing.value = true;
  
  const loading = ElLoading.service({
    text: '初始化中...',
    background: 'rgba(255, 255, 255, 0.9)',
  });

  try {
    MapPool._clear();
    MapData.getInstance().clearData();
    outBluepr.clear();
    filterResults.value = [];
    selectedIds.value.clear();

    const rootPath = config.rootPath;
    const files = getAllFiles(rootPath);
    const inputData = await readFiles(files);

    let processedCount = 0;
    loading.setText(`${processedCount}/${inputData.size}`);

    for (const [index, element] of inputData.entries()) {
      await new Promise<void>((resolve) => {
        setImmediate(async () => {
          try {
            const blueprintData = fromStr(element.data);
            const counter = buildingCounter(blueprintData, index);
            const outUrl = await itemDataToJson(index, counter);

            const oneBlueprintData = new newBaseData(
              blueprintData.header.shortDesc,
              index,
              element.filePath,
              outUrl
            );
            MapData.getInstance().setData(index, oneBlueprintData);
          } catch (e) {
            console.error('导入的蓝图数据有误', e);
          } finally {
            processedCount++;
            loading.setText(`${processedCount}/${inputData.size}`);
            resolve();
          }
        });
      });
    }

    MapData.getInstance().saveData();
    isInitialized.value = true;
    Tipsessage('蓝图数据导入完成: ' + MapData.getInstance().testData.size);
  } finally {
    loading.close();
    isInitializing.value = false;
  }
};

// 筛选蓝图
const handleFilter = async () => {
  if (!isInitialized.value) {
    Tipsessage('请先初始化或等待缓存加载完成');
    return;
  }
  
  isFiltering.value = true;
  
  const loading = ElLoading.service({
    text: '筛选中...',
    background: 'rgba(255, 255, 255, 0.9)',
  });

  try {
    outBluepr.clear();
    filterResults.value = [];
    selectedIds.value.clear();

    const data = MapData.getInstance().testData;
    const seleceData = SeleceManag.getInstance().seleceIconArr;
    const excludeData = SeleceManag.getInstance().excludeIconArr;
    const itemIdData = SeleceManag.getInstance().containBuildArr;

    for (const [index, element] of data.entries()) {
      await new Promise<void>((resolve) => {
        setImmediate(async () => {
          try {
            const counter = await MapPool._findFoOutPool(index, element.outPath);
            if (counter) {
              let hasOverlap = false;
              let hasNoExclude = true;
              let isMax = true;
              let hasitemId = true;

              if (seleceData.length) {
                hasOverlap = seleceData.every((value) => counter.typtItem.has(value));
              }
              if (excludeData.length) {
                hasNoExclude = !excludeData.some((value) => counter.typtItem.has(value));
              }
              if (buildNum.value && counter.longItem) {
                isMax = (counter.longItem as number) <= buildNum.value;
              }
              if (itemIdData.length) {
                hasitemId = itemIdData.every((value) => counter.numItem.has(value));
              }

              const test = (!seleceData.length && itemIdData.length) || hasOverlap;
              if (test && hasNoExclude && isMax && hasitemId) {
                outBluepr.add(index);
                filterResults.value.push(element);
              }
            }
          } catch (error) {
            console.error(`Error processing element at index ${index}:`, error);
          } finally {
            resolve();
          }
        });
      });
    }

    Tipsessage('筛选完成: ' + outBluepr.size);
  } finally {
    loading.close();
    isFiltering.value = false;
  }
};

// 导出蓝图 - 只导出选中的，如果没选中则导出全部
const handleExport = async () => {
  const config = configManager.getConfig();
  
  // 确定要导出的蓝图
  const toExport = selectedIds.value.size > 0 
    ? [...selectedIds.value] 
    : [...outBluepr];
  
  if (toExport.length === 0) {
    Tipsessage('没有可导出的蓝图');
    return;
  }
  
  const loading = ElLoading.service({
    text: '导出中...',
    background: 'rgba(255, 255, 255, 0.9)',
  });

  try {
    const promises: Promise<void>[] = [];
    
    toExport.forEach((index) => {
      const data = MapData.getInstance().testData.get(index);
      if (data) {
        promises.push(copyFile(data.path, config.outputPath));
      }
    });

    await Promise.all(promises);
    Tipsessage(`导出完成: ${toExport.length} 个蓝图`);
  } finally {
    loading.close();
  }
};

// 清空选择
const handleClear = () => {
  outBluepr.clear();
  filterResults.value = [];
  selectedIds.value.clear();
};

// 计算蓝图中每种建筑的数量
const buildingCounter = (data: any, mapKey: string) => {
  const counter = MapPool._get(mapKey);
  for (const b of data.buildings) {
    counter.numItem.set(b.itemId, (counter.numItem.get(b.itemId) ?? 0) + 1);
    BuilToop.changeRecipeId(b);
    if (b.recipeId === 0) continue;
    const count = recipeIconId2(b.recipeId);
    counter.longItem = data.buildings.length;
    count.forEach((c: any) => {
      counter.typtItem.set(c.item.id, (counter.typtItem.get(c.item.id) ?? 0) + 1);
    });
  }
  return counter;
};
</script>

<style lang="scss">
@import './assets/scss/theme.scss';

.app-layout {
  height: 100vh;
  overflow: hidden;
  background: var(--dsp-bg-page);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--dsp-header-height);
  padding: 0 var(--dsp-spacing-lg);
  background: var(--dsp-bg-header);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--dsp-spacing-md);
}

.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 20px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #67c23a;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--dsp-spacing-sm);
}

.header-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &--icon {
    width: 36px;
    height: 36px;
    padding: 0;
    justify-content: center;
  }
}

.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.app-body {
  height: calc(100vh - var(--dsp-header-height));
  overflow: hidden;
}

.app-sidebar {
  background: var(--dsp-bg-sidebar);
  border-right: 1px solid var(--dsp-border-light);
  overflow: hidden;
}

.app-main {
  background: var(--dsp-bg-page);
  padding: var(--dsp-spacing-lg);
  overflow-y: auto;
}

.setup-alert {
  margin-bottom: var(--dsp-spacing-md);
}

.setup-content {
  padding: var(--dsp-spacing-md) 0;
  
  p {
    margin: var(--dsp-spacing-sm) 0;
    color: var(--dsp-text-regular);
  }
}
</style>
