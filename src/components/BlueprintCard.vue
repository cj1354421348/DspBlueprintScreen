<template>
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
        <span class="info-text">{{ blueprint.id }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Document } from '@element-plus/icons-vue';

defineProps<{
  blueprint: {
    id: string;
    name: string;
    path: string;
    outPath: string;
  };
  selected: boolean;
}>();

defineEmits<{
  (e: 'toggle'): void;
}>();
</script>

<style lang="scss" scoped>
.blueprint-card {
  background: var(--dsp-bg-card);
  border: 1px solid var(--dsp-border-light);
  border-radius: var(--dsp-border-radius);
  padding: var(--dsp-spacing-md);
  cursor: pointer;
  transition: all var(--dsp-transition-base);

  &:hover {
    border-color: var(--el-color-primary-light-5);
    box-shadow: var(--dsp-shadow-base);
    transform: translateY(-2px);
  }

  &.selected {
    border-color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
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
</style>
