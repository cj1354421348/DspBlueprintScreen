<template>
	<div class="mb-4">
		<el-button @click="populateSpawnData" type="primary">初始化蓝图</el-button>
		<el-button @click="simpleFilter" type="primary">筛选蓝图</el-button>
		<el-button @click="exportFilterBluepr" type="success">导出筛选的蓝图</el-button>
		<el-button @click = "clearData" type="warning">清空选择数据</el-button>
		<el-button type="danger">Danger</el-button>
	</div>
	<el-divider>
		<span>包含</span>
	</el-divider>
	<BuildingIcon v-for="item in items" :key="item.id" :item="item" :isHave=true />
	<el-divider>
		<span>不包含</span>
	</el-divider>
	<BuildingIcon v-for="item in items" :key="item.id" :item="item" :isHave=false />
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
const outBluepr = new Set<string>();
const config:config = getConfigPath() as config;


/**
 * 初始化蓝图
 */
const populateSpawnData = async () => {
	//console.log(config.outputPath);
	let inputData;
	console.log();
	//let rootPath = getExePath("\\test");
	let rootPath = config.rootPath; //网页测试
	let test = getAllFiles(rootPath);
	inputData = await readFiles(test);
	let blueprintData: BlueprintData;
	inputData.forEach(async (element, index) => {
		try {
			//console.log(index);
			blueprintData = fromStr(element.data);
			let okData = buildingCounter(blueprintData);
			let outUrl = await createDir(index, okData);
			let oneBlueprintData = new newBaseData(blueprintData.header.shortDesc, index, element.filePath, outUrl);
			MapData.getInstance().setData(index, oneBlueprintData);
			//console.log(MapData.getInstance().testData);
		} catch (e) {
			let msg = "导入的蓝图数据有误";
			console.error(msg, e);
			return;
		}
	});
	MapData.getInstance().saveData();
	console.log(MapData.getInstance().testData);

};
const simpleFilter = function () {
	outBluepr.clear();
	const data = MapData.getInstance().testData;
	const excludeData = SeleceManag.getInstance().seleceIconArr;
	data.forEach((element,index) => {
		const counter:{} = readJsonFile(element.outPath);
		if (counter) {
			let hasOverlap = excludeData.every(value => Object.keys(counter).includes(String(value)));
			if (hasOverlap) {
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
			copyFile(data.path,config.outputPath);
		}
	});
}
const clearData = function () {
	SeleceManag.getInstance().clear();
}
/**
 * 计算蓝图中每种建筑的数量
 * @param data 
 * @returns 
 */
const buildingCounter = function (data: BlueprintData) {
	const counter = new Map<number, number>();
	for (const b of data.buildings) {
		if (b.recipeId == 0)
			continue;
		const count = recipeIconId2(b.recipeId);
		count.forEach(c => {
			counter.set(c.item.id, (counter.get(c.item.id) ?? 0) + 1);
		});
	}
	return counter;
}
</script>
