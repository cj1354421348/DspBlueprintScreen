<template>
  <div class="filter-panel">
    <h3 class="panel-title">📋 筛选条件</h3>

    <!-- 状态提示 -->
    <div v-if="!isInitialized" class="status-notice">
      <el-alert
        title="未加载蓝图数据"
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <span>请点击顶栏【重新初始化】加载数据</span>
        </template>
      </el-alert>
    </div>

    <!-- 搜索框 -->
    <div class="filter-section">
      <el-input
        v-model="searchText"
        placeholder="搜索物品名称..."
        :prefix-icon="Search"
        clearable
        size="small"
      />
    </div>

    <!-- 建筑数量限制 -->
    <div class="filter-section">
      <div class="section-header">
        <span class="section-title">建筑数量限制</span>
        <el-tooltip content="0 为不限制" placement="top">
          <el-icon class="info-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <el-input-number
        v-model="buildNum"
        :step="300"
        :min="0"
        :max="99999"
        size="small"
        class="build-num-input"
      />
    </div>

    <!-- 包含条件 -->
    <el-collapse v-model="activeCollapse" class="filter-collapse">
      <el-collapse-item name="include">
        <template #title>
          <div class="collapse-title">
            <el-tag type="success" size="small">包含</el-tag>
            <span class="collapse-desc">选择必须包含的配方</span>
          </div>
        </template>
        <div class="icon-grid">
          <BuildingIcon
            ref="includeIcons"
            v-for="item in filteredItems"
            :key="'include-' + item.id"
            :item="item"
            :isHave="iconType.haven"
          />
        </div>
      </el-collapse-item>

      <el-collapse-item name="exclude">
        <template #title>
          <div class="collapse-title">
            <el-tag type="warning" size="small">不包含</el-tag>
            <span class="collapse-desc">选择不能包含的配方</span>
          </div>
        </template>
        <div class="icon-grid">
          <BuildingIcon
            ref="excludeIcons"
            v-for="item in filteredItems"
            :key="'exclude-' + item.id"
            :item="item"
            :isHave="iconType.unhaven"
          />
        </div>
      </el-collapse-item>

      <el-collapse-item name="building">
        <template #title>
          <div class="collapse-title">
            <el-tag type="info" size="small">铺设建筑</el-tag>
            <span class="collapse-desc">选择必须铺设的建筑</span>
          </div>
        </template>
        <div class="icon-grid">
          <BuildingIcon
            ref="buildingIcons"
            v-for="item in filteredItems"
            :key="'building-' + item.id"
            :item="item"
            :isHave="iconType.itemId"
          />
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <div class="button-row">
        <el-button
          type="primary"
          :loading="isFiltering"
          :disabled="!isInitialized"
          @click="$emit('filter')"
        >
          筛选蓝图
        </el-button>
        <el-button
          type="success"
          :disabled="!isInitialized"
          @click="$emit('export')"
        >
          导出
        </el-button>
      </div>
      <el-button
        type="warning"
        plain
        @click="handleClear"
        class="clear-btn"
      >
        清空选择
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { QuestionFilled, Search } from '@element-plus/icons-vue';
import { items } from '@/data/itemsData';
import { iconType } from '@/DataType/typeEnum';
import BuildingIcon from '@/views/components/BuildingIcon.vue';
import { SeleceManag } from '@/MyIns/SeleceManag';

defineProps<{
  isFiltering?: boolean;
  isInitialized?: boolean;
}>();

const emit = defineEmits<{
  (e: 'filter'): void;
  (e: 'export'): void;
  (e: 'clear'): void;
}>();

const buildNum = defineModel<number>('buildNum', { default: 0 });
const activeCollapse = ref(['include']);
const searchText = ref('');

// 根据搜索文本过滤物品
const filteredItems = computed(() => {
  if (!searchText.value.trim()) {
    return items;
  }
  const keyword = searchText.value.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(keyword) ||
    (item.alt && item.alt.toLowerCase().includes(keyword))
  );
});

const includeIcons = ref<any[]>([]);
const excludeIcons = ref<any[]>([]);
const buildingIcons = ref<any[]>([]);

const handleClear = () => {
  SeleceManag.getInstance().clear();
  [...includeIcons.value, ...excludeIcons.value, ...buildingIcons.value].forEach(
    (icon) => icon?.clearSelection?.()
  );
  emit('clear');
};

defineExpose({
  clearSelection: handleClear,
});
</script>

<style lang="scss" scoped>
.filter-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--dsp-spacing-md);
  background: var(--dsp-bg-sidebar);
  overflow-y: auto;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--dsp-text-primary);
  margin: 0 0 var(--dsp-spacing-md) 0;
  padding-bottom: var(--dsp-spacing-sm);
  border-bottom: 1px solid var(--dsp-border-light);
}

.status-notice {
  margin-bottom: var(--dsp-spacing-md);
}

.filter-section {
  margin-bottom: var(--dsp-spacing-md);
  padding: var(--dsp-spacing-sm);
  background: var(--dsp-bg-page);
  border-radius: var(--dsp-border-radius-sm);
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--dsp-spacing-xs);
  margin-bottom: var(--dsp-spacing-sm);
}

.section-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--dsp-text-regular);
}

.info-icon {
  color: var(--dsp-text-secondary);
  cursor: help;
}

.build-num-input {
  width: 100%;
}

.filter-collapse {
  flex: 1;
  border: none;
  --el-collapse-header-bg-color: var(--dsp-bg-page);
  overflow-y: auto;
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: var(--dsp-spacing-sm);
}

.collapse-desc {
  font-size: 12px;
  color: var(--dsp-text-secondary);
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dsp-spacing-xs);
  padding: var(--dsp-spacing-sm) 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--dsp-spacing-sm);
  padding-top: var(--dsp-spacing-md);
  border-top: 1px solid var(--dsp-border-light);
  margin-top: auto;
  flex-shrink: 0;
}

.button-row {
  display: flex;
  gap: var(--dsp-spacing-sm);
  
  .el-button {
    flex: 1;
  }
}

.clear-btn {
  width: 100%;
}
</style>
