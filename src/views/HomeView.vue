<template>
	<div class="home">
		<img @click="aaa" alt="Vue logo" src="../assets/logo.png" />
	</div>
	<BuildingIcon v-for="item in items" :key="item.id" :item="item" />
	<!-- <div class="mb-4">
		<el-button>Default</el-button>
		<el-button type="primary">Primary</el-button>
		<el-button type="success">Success</el-button>
		<el-button type="info">Info</el-button>
		<el-button type="warning">Warning</el-button>
		<el-button type="danger">Danger</el-button>
	</div> -->
</template>

<script setup lang="ts">
import { computed, defineComponent } from "vue";
import { BlueprintData, fromStr } from "@/blueprint/parser";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { getAllFiles, getExePath, readFiles } from "@/AppIO/Read";
import { MapData } from "@/MyIns/MapData";
import { newBaseData } from "@/DataType/BaseData";
import {createDir} from "@/AppIO/Write";
import {itemsMap,items} from "@/data/itemsData";
import { itemIconId, recipeIconId2 } from "@/data/icons";
import BuildingIcon from "./components/BuildingIcon.vue";
const aaa = async () => {
	let inputData;
	//let rootPath = getExePath("\\test");
	let rootPath = "D:\\project\\dsp_blueprint_screen\\test"; //网页测试
	let test = getAllFiles(rootPath);
	inputData = await readFiles(test);
	let blueprintData:BlueprintData;
	console.log(itemsMap);
	inputData.forEach(async (element,index) => {
		try {
			blueprintData = fromStr(element);
			let okData = buildingCounter(blueprintData);
			//let a = JSON.stringify(blueprintData);
			let outUrl = await createDir(index, okData);
			let oneBlueprintData = new newBaseData(blueprintData.header.shortDesc,index,"原始路径",outUrl);
			MapData.getInstance().setData(index,oneBlueprintData);
			console.log(MapData.getInstance().testData);
		} catch (e) {
			let msg = "导入的蓝图数据有误";
			console.error(msg, e);
			return;
		}
	});
		MapData.getInstance().saveData();

};
const buildingCounter = function(data:BlueprintData) {
	const counter = new Map<number, number>();
	for (const b of data.buildings) {
		if(b.recipeId == 0 )
			continue;
		const count = recipeIconId2(b.recipeId);
		count.forEach(c => {
			counter.set(c.item.id, (counter.get(c.item.id) ?? 0) + 1); 

		});
		
	}
	return counter;
	}
</script>
