<template>
  <div class="icon" :class="{ 'has-count': props.item.count !== undefined, selected: isSelected }" :title="props.item.alt"
    @click="toggleSelection">
    <img :src="src" :alt="props.item.alt" />
    <div v-if="props.item.count !== undefined" class="count">
      {{ props.item.count === 1 ? "" : props.item.count }}
    </div>
    <div class="name">{{ props.item.name }}</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import { iconUrl } from "@/data/icons";
import { SeleceManag } from "@/MyIns/SeleceManag";
import { iconType } from "@/DataType/typeEnum";
const props = defineProps<{
  item: {
    id: number;
    name: string;
    alt?: string;
    count?: number;
  };
  isHave: number;
}>();

const src = ref("");
const isSelected = ref(false);

watchEffect(async () => {
  src.value = "";
  src.value = await iconUrl(props.item.id);
});

const toggleSelection = () => {
  isSelected.value = !isSelected.value;
  switch (props.isHave) {
    case iconType.haven:
      SeleceManag.getInstance().setSeleceIcon(props.item.id, isSelected.value);
      console.log(SeleceManag.getInstance().seleceIconArr);
      break;
    case iconType.unhaven:
      SeleceManag.getInstance().setExcludeIcon(props.item.id, isSelected.value);
      console.log(SeleceManag.getInstance().excludeIconArr);
      break;
    case iconType.itemId:
    SeleceManag.getInstance().setContainBuild(props.item.id, isSelected.value);
    console.log(SeleceManag.getInstance().containBuildArr);
    default:
      // 处理其他情况（如果有需要的话）
      break;
  }
};
const clearSelection = () => {
  //console.log("clearSelection");
  isSelected.value = false;
}
defineExpose({ clearSelection })
// onMounted(() => {
//   isSelected.value =SeleceManag.getInstance().haveSeleceIcon(props.item.id);
// });
</script>

<style lang="scss" scoped>
.icon {
  display: inline-block;
  position: relative;
  width: 3.2rem;
  border: 2px solid transparent;
  border-radius: var(--dsp-border-radius-sm, 4px);
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;

  &:hover {
    background: rgba(64, 158, 255, 0.08);
    border-color: rgba(64, 158, 255, 0.3);
    transform: scale(1.05);
  }

  &.has-count {
    padding-bottom: 0.4em;
  }

  &.selected {
    border-color: var(--el-color-primary, #409eff);
    background: rgba(64, 158, 255, 0.15);
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }

  img {
    width: 100%;
    display: block;
    border-radius: 2px;
  }

  .count {
    position: absolute;
    right: 2px;
    bottom: 2px;
    font-size: 0.75em;
    font-weight: 600;
    color: #67c23a;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-size: 0.7em;
    text-align: center;
    color: var(--dsp-text-secondary, #909399);
    margin-top: 2px;
  }
}
</style>
