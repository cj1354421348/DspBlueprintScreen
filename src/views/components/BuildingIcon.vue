<template>
  <div
    class="icon"
    :class="{ 'has-count': props.item.count !== undefined, selected: isSelected }"
    :title="props.item.alt"
    @click="toggleSelection"
  >
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
const props = defineProps<{
  item: {
    id: number;
    name: string;
    alt?: string;
    count?: number;
  };
  isHave: boolean;
}>();

const src = ref("");
const isSelected = ref(false);

watchEffect(async () => {
  src.value = "";
  src.value = await iconUrl(props.item.id);
});

const toggleSelection = () => {
  isSelected.value = !isSelected.value;
  if (props.isHave) {
    SeleceManag.getInstance().setSeleceIcon(props.item.id, isSelected.value);
    console.log(SeleceManag.getInstance().seleceIconArr);
  } else {
    SeleceManag.getInstance().setExcludeIcon(props.item.id, isSelected.value);
    console.log(SeleceManag.getInstance().excludeIconArr);
  }
};
// onMounted(() => {
//   isSelected.value =SeleceManag.getInstance().haveSeleceIcon(props.item.id);
// });
</script>

<style lang="scss">
.icon {
  display: inline-block;
  position: relative;
  width: 3.7rem;
  border: 2px solid transparent;
  transition: border-color 0.3s;

  &.has-count {
    padding-bottom: 0.4em;
  }

  &.selected {
    border-color: blue;
  }

  img {
    width: 100%;
    display: block;
  }

  .count {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 0.8em;
    color: cyan;
    text-shadow: 0 0 10px cyan;
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-size: 0.8em; /* 设置字体大小 */
  }
}
</style>
