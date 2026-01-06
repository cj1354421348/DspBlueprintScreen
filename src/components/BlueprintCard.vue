<template>
  <el-popover
    placement="right"
    :width="isCompactMode ? 360 : 420"
    trigger="hover"
    :show-after="200"
    :hide-after="500"
    :enterable="true"
    @before-enter="loadPreviewData"
  >
    <template #reference>
      <div 
        class="blueprint-card" 
        :class="{ selected: selected }" 
        @click="$emit('toggle')"
      >
        <div class="card-header">
          <el-checkbox :model-value="selected" @click.stop="$emit('toggle')" class="card-checkbox" />
          <span class="card-title" :title="blueprint.name">{{ blueprint.name || '未命名蓝图' }}</span>
        </div>
        <div class="card-body">
          <div class="card-info">
            <el-icon><Document /></el-icon>
            <span class="info-text" :title="blueprint.MD5">{{ blueprint.MD5.slice(0, 8) }}...</span>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Popover 内容 -->
    <div class="preview-content">
      <div class="preview-header">
        <span class="preview-title">{{ blueprint.name || '未命名蓝图' }}</span>
        <span class="preview-count">共 {{ previewData?.longItem || 0 }} 个建筑</span>
      </div>
      
      <!-- 配方/产出物品 -->
      <div v-if="recipeItems.length > 0" class="preview-section">
        <div class="section-title">🧪 配方产出</div>
        <div class="preview-grid" :class="{ 'preview-grid--compact': isCompactMode }">
          <div 
            v-for="item in recipeItems" 
            :key="'recipe-' + item.id"
            class="preview-item"
            :class="{ 'preview-item--compact': isCompactMode }"
            :title="item.name + ' x' + item.count"
          >
            <img :src="item.iconUrl" :alt="item.name" class="item-icon" />
            <span v-if="!isCompactMode" class="item-name">{{ item.name }}</span>
            <span class="item-count">x{{ item.count }}</span>
          </div>
        </div>
      </div>
      
      <!-- 建筑类型 -->
      <div v-if="buildingItems.length > 0" class="preview-section">
        <div class="section-title">🏭 建筑统计</div>
        <div class="preview-grid" :class="{ 'preview-grid--compact': isCompactMode }">
          <div 
            v-for="item in buildingItems" 
            :key="'building-' + item.id"
            class="preview-item"
            :class="{ 'preview-item--compact': isCompactMode }"
            :title="item.name + ' x' + item.count"
          >
            <img :src="item.iconUrl" :alt="item.name" class="item-icon" />
            <span v-if="!isCompactMode" class="item-name">{{ item.name }}</span>
            <span class="item-count">x{{ item.count }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="!previewData" class="preview-empty">
        暂无数据
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Document } from '@element-plus/icons-vue';
import { MapPool } from '@/Toop/MapPool';
import { itemsMap } from '@/data/items';
import { itemRecipeIconUrl } from '@/data/icons';
import { newitemData } from '@/DataType/tiemData';

interface PreviewItem {
  id: number;
  name: string;
  iconUrl: string;
  count: number;
}

const props = defineProps<{
  blueprint: {
    MD5: string;
    name: string;
    path: string;
    outPath: string;
  };
  selected: boolean;
}>();

defineEmits<{
  (e: 'toggle'): void;
}>();

const previewData = ref<newitemData | null>(null);
const recipeItems = ref<PreviewItem[]>([]);
const buildingItems = ref<PreviewItem[]>([]);

// 判断是否使用紧凑模式
const isCompactMode = computed(() => {
  return recipeItems.value.length + buildingItems.value.length > 50;
});

// 加载预览数据
const loadPreviewData = async () => {
  if (previewData.value) return; // 已加载过
  
  try {
    const data = await MapPool._findFoOutPool(props.blueprint.MD5, props.blueprint.outPath);
    previewData.value = data;
    
    // 转换配方产出数据
    const recipeList: PreviewItem[] = [];
    for (const [id, count] of data.typtItem.entries()) {
      const item = itemsMap.get(id);
      if (item) {
        const iconUrl = await itemRecipeIconUrl(item.icon);
        recipeList.push({ id, name: item.name, iconUrl, count });
      }
    }
    recipeItems.value = recipeList.sort((a, b) => b.count - a.count);
    
    // 转换建筑统计数据
    const buildingList: PreviewItem[] = [];
    for (const [id, count] of data.numItem.entries()) {
      const item = itemsMap.get(id);
      if (item) {
        const iconUrl = await itemRecipeIconUrl(item.icon);
        buildingList.push({ id, name: item.name, iconUrl, count });
      }
    }
    buildingItems.value = buildingList.sort((a, b) => b.count - a.count);
  } catch (e) {
    console.error('加载蓝图预览数据失败:', e);
  }
};
</script>

<style lang="scss" scoped>
.blueprint-card {
  background: var(--dsp-bg-card);
  border: 2px solid var(--dsp-border-light);
  border-radius: var(--dsp-border-radius);
  padding: var(--dsp-spacing-md);
  cursor: pointer;
  transition: all var(--dsp-transition-base);

  &:hover:not(.selected) {
    border-color: var(--dsp-border-color);
    box-shadow: var(--dsp-shadow-base);
    transform: translateY(-2px);
  }

  &.selected {
    border-color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--dsp-spacing-sm);
  margin-bottom: var(--dsp-spacing-sm);
}

.card-checkbox {
  flex-shrink: 0;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--dsp-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.card-body {
  padding-left: calc(14px + var(--dsp-spacing-sm));
}

.card-info {
  display: flex;
  align-items: center;
  gap: var(--dsp-spacing-xs);
  color: var(--dsp-text-secondary);
  font-size: 12px;
}

.info-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Preview 样式 */
.preview-content {
  max-height: 400px;
  overflow-y: auto;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 12px;
}

.preview-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.preview-count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  padding: 2px 8px;
  border-radius: 10px;
}

.preview-section {
  margin-bottom: 12px;
}

.section-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  
  &--compact {
    gap: 4px;
  }
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
  font-size: 12px;
  
  &--compact {
    padding: 3px 5px;
  }
}

.item-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  
  .preview-item--compact & {
    width: 16px;
    height: 16px;
  }
}

.item-name {
  color: var(--el-text-color-regular);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-count {
  color: var(--el-text-color-secondary);
  font-size: 11px;
}

.preview-empty {
  text-align: center;
  color: var(--el-text-color-placeholder);
  padding: 20px;
}
</style>
