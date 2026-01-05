<template>
  <div class="result-view">
    <!-- 结果头部 -->
    <div class="result-header">
      <div class="header-left">
        <h2 class="result-title">📊 筛选结果</h2>
        <el-tag v-if="resultCount > 0" type="success" size="large">
          {{ resultCount }} 个蓝图
        </el-tag>
        <el-tag v-if="selectedCount > 0" type="primary" size="small">
          已选 {{ selectedCount }} 个
        </el-tag>
      </div>
      <div v-if="resultCount > 0" class="header-actions">
        <el-button size="small" @click="selectAll">全选</el-button>
        <el-button size="small" @click="clearSelection">清空选择</el-button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!isInitialized" class="empty-state">
      <el-empty description="">
        <template #description>
          <div class="empty-content">
            <p class="empty-title">🔍 请先加载蓝图数据</p>
            <p class="empty-desc">如果之前已初始化过，会自动加载缓存</p>
            <p class="empty-desc">否则请点击顶栏【重新初始化】扫描蓝图</p>
          </div>
        </template>
      </el-empty>
    </div>

    <!-- 无结果状态 -->
    <div v-else-if="resultCount === 0" class="empty-state">
      <el-empty description="">
        <template #description>
          <div class="empty-content">
            <p class="empty-title">📭 暂无匹配的蓝图</p>
            <p class="empty-desc">请设置筛选条件后点击【筛选蓝图】</p>
          </div>
        </template>
      </el-empty>
    </div>

    <!-- 结果网格 -->
    <div v-else class="result-grid">
      <BlueprintCard
        v-for="bp in results"
        :key="bp.id"
        :blueprint="bp"
        :selected="localSelectedIds.has(bp.id)"
        @toggle="toggleSelection(bp.id)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import BlueprintCard from '@/components/BlueprintCard.vue';

const props = defineProps<{
  results: any[];
  isInitialized: boolean;
  resultCount: number;
  selectedIds: Set<string>;
}>();

const emit = defineEmits<{
  (e: 'update:selected-ids', value: Set<string>): void;
}>();

// 本地维护选中状态
const localSelectedIds = ref<Set<string>>(new Set());

// 同步父组件状态
watch(() => props.selectedIds, (newVal) => {
  localSelectedIds.value = new Set(newVal);
}, { immediate: true });

const selectedCount = computed(() => localSelectedIds.value.size);

const toggleSelection = (id: string) => {
  const newSet = new Set(localSelectedIds.value);
  if (newSet.has(id)) {
    newSet.delete(id);
  } else {
    newSet.add(id);
  }
  localSelectedIds.value = newSet;
  emit('update:selected-ids', newSet);
};

const selectAll = () => {
  const newSet = new Set(props.results.map(bp => bp.id));
  localSelectedIds.value = newSet;
  emit('update:selected-ids', newSet);
};

const clearSelection = () => {
  localSelectedIds.value = new Set();
  emit('update:selected-ids', new Set());
};
</script>

<style lang="scss" scoped>
.result-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--dsp-spacing-lg);
  padding-bottom: var(--dsp-spacing-md);
  border-bottom: 1px solid var(--dsp-border-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--dsp-spacing-sm);
}

.result-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--dsp-text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--dsp-spacing-xs);
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-content {
  text-align: center;
}

.empty-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--dsp-text-primary);
  margin: 0 0 var(--dsp-spacing-md) 0;
}

.empty-desc {
  font-size: 14px;
  color: var(--dsp-text-secondary);
  margin: 0 0 var(--dsp-spacing-xs) 0;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--dsp-spacing-md);
  overflow-y: auto;
  padding-bottom: var(--dsp-spacing-lg);
}
</style>
