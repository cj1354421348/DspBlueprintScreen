<template>
	<div class="home">
		<img @click="aaa" alt="Vue logo" src="../assets/logo.png" />
		<HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
	</div>
	<div class="mb-4">
		<el-button>Default</el-button>
		<el-button type="primary">Primary</el-button>
		<el-button type="success">Success</el-button>
		<el-button type="info">Info</el-button>
		<el-button type="warning">Warning</el-button>
		<el-button type="danger">Danger</el-button>
	</div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { fromStr } from "@/blueprint/parser";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { getAllFiles, getExePath, readFiles } from "@/AppIO/Read";
import { MapData } from "@/MyIns/MapData";
import { newBaseData } from "@/DataType/BaseData";
import {createDir} from "@/AppIO/Write";
const aaa = async () => {
	let inputData;
	//let rootPath = getExePath("\\test");
	let rootPath = "D:\\project\\dsp_blueprint_screen\\test"; //网页测试
	let test = getAllFiles(rootPath);
	console.log(test);
	inputData = await readFiles(test);
	let blueprintData;
	inputData.forEach(async (element,index) => {
		try {
			blueprintData = fromStr(element);
			//let a = JSON.stringify(blueprintData);
			let outUrl = await createDir(index, blueprintData);
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
</script>
