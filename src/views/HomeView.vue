<template>
	<div class="mb-4">
		<el-button @click="populateSpawnData" type="primary">初始化蓝图</el-button>
		<el-button @click="simpleFilter" type="primary">筛选蓝图</el-button>
		<el-button @click="exportFilterBluepr" type="success">导出筛选的蓝图</el-button>
		<el-button @click="clearData" type="warning">清空选择数据</el-button>
		<!-- <el-button type="danger">Danger</el-button> -->
	</div>
	<el-divider>
		<span>限制建筑数量0为不限制</span>
	</el-divider>
	<el-input-number v-model="buildNum" :step="300" :min="0" :max="99999" clearable />
  <div style="margin: 20px 0" />
	<el-divider>
		<span>包含</span>
	</el-divider>
	<BuildingIcon ref="buildingIcons" v-for="item in items" :key="item.id" :item="item" :isHave=true />
	<el-divider>
		<span>不包含</span>
	</el-divider>
	<BuildingIcon ref="buildingIcons" v-for="item in items" :key="item.id" :item="item" :isHave=false />
	<el-button :plain="true" @click="open2">Success</el-button>
</template>

<script setup lang="ts">
import { BlueprintData, fromStr } from "@/blueprint/parser";
import { getAllFiles, getConfigPath, getExePath, readFiles, readJsonFile } from "@/AppIO/Read";
import { MapData } from "@/MyIns/MapData";
import { newBaseData } from "@/DataType/BaseData";
import { copyFile, createDir } from "@/AppIO/Write";
import { items } from "@/data/itemsData";
import { recipeIconId2 } from "@/data/icons";
import BuildingIcon from "./components/BuildingIcon.vue";
import { SeleceManag } from "@/MyIns/SeleceManag";
import { ElMessage } from "element-plus";
import { MapPool } from "@/Toop/MapPool";
import { onMounted, ref } from "vue";
const outBluepr = new Set<string>();
let config: config;
const buildingIcons = ref<any>([]);
const buildNum = ref(0);
onMounted(() => {
	config = getConfigPath() as config;
	MapData.getInstance().getDataforLong(config.stagingPath + "\\主文件.json");
})
/**
 * 初始化蓝图
 */
const populateSpawnData = async () => {
	MapPool._clear();
	MapData.getInstance().clearData();
	let rootPath = config.rootPath; // 网页测试
	let test = getAllFiles(rootPath);
	let inputData = await readFiles(test); // inputData 是一个 Map 对象
	let blueprintData: BlueprintData;
	// 将 Map 转换为 Promise 数组并并行处理所有异步操作
	const promises = Array.from(inputData.entries()).map(async ([index, element]) => {
		try {
			blueprintData = fromStr(element.data);
			let okData = buildingCounter(blueprintData, index);
			let outUrl = await createDir(index, okData);

			console.log(blueprintData.buildings.length);
			let oneBlueprintData = new newBaseData(blueprintData.header.shortDesc, index, element.filePath, outUrl);
			MapData.getInstance().setData(index, oneBlueprintData);
		} catch (e) {
			let msg = "导入的蓝图数据有误";
			console.error(msg, e);
			return;
		}
	});
	// 等待所有 Promise 完成
	await Promise.all(promises);
	// 确保在所有异步操作执行完成后再保存数据
	MapData.getInstance().saveData();
	console.log(MapData.getInstance().testData);
};

//筛选蓝图按钮
const simpleFilter = function () {
	outBluepr.clear();
	const data = MapData.getInstance().testData;
	const seleceData = SeleceManag.getInstance().seleceIconArr;
	const excludeData = SeleceManag.getInstance().excludeIconArr;
	console.log(MapPool.pool);
	data.forEach((element, index) => {
		const counter = MapPool._findFoOutPool(index, element.outPath);
		console
		if (counter) {
			let hasOverlap = false;
			let hasNoExclude = true;
			let isMax = true;
			if (seleceData.length)
				hasOverlap = seleceData.every(value => counter.has(value));
			if (excludeData.length)
				hasNoExclude = !excludeData.some(value => counter.has(value));

			if(buildNum.value&&counter.has(-1)){
				// eslint-disable-next-line 
				console.log(counter.get(-1),buildNum.value);
				isMax = counter.get(-1) as number<=buildNum.value;
			}
			console.log(hasOverlap, hasNoExclude);
			if (hasOverlap && hasNoExclude && isMax) {
				outBluepr.add(index);
			}
		}
	});
}
//导出筛选蓝图
const exportFilterBluepr = function () {
	console.log(outBluepr);
	outBluepr.forEach(index => {
		let data = MapData.getInstance().testData.get(index);
		if (data) {
			copyFile(data.path, config.outputPath);
		}
	});
}
const clearData = function () {
	SeleceManag.getInstance().clear();
	buildingIcons.value.forEach((icon: { clearSelection: () => void; }) => {
		icon.clearSelection() // 调用子组件的方法
	})
}
/**
 * 计算蓝图中每种建筑的数量
 * @param data 
 * @returns 
 */
const buildingCounter = function (data: BlueprintData, mapKey: string) {
	const counter = MapPool._get<number, number>(mapKey);
	for (const b of data.buildings) {
		if (b.recipeId == 0)
			continue;
		const count = recipeIconId2(b.recipeId);
		counter.set(-1,data.buildings.length);
		count.forEach(c => {
			counter.set(c.item.id, (counter.get(c.item.id) ?? 0) + 1);
		});
	}
	return counter;
}
const open2 = () => {
	let aaa = getExePath();
	ElMessage({
		showClose: true,
		message: aaa,
		type: 'success',
	})
}
</script>
