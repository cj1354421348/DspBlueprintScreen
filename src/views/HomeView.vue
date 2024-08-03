<template>
	<div class="home">
		<img @click="aaa" alt="Vue logo" src="../assets/logo.png" />
		<HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
	</div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { fromStr } from "@/blueprint/parser";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import {getAllFiles,getExePath,readFiles} from "@/AppIO/Read";
import {MapData} from "@/MyIns/MapData";
const aaa = () => {
	let inputData ='';
	//let rootPath = getExePath("\\test");
	let rootPath = "D:\\project\\dsp_blueprint_screen\\test";//网页测试
	let test = getAllFiles(rootPath);
	// console.log(test);
	// readFiles(test);
	MapData.getInstance().testData1();
	console.log(MapData.getInstance().testData.get("adadad"));
	let blueprintData;
	try {
		blueprintData = fromStr(inputData);
		let a = JSON.stringify(blueprintData);
		console.log(a);
	} catch (e) {
		let msg = "导入的蓝图数据有误";
		console.error(msg, e);
		//this.warning(msg);
		return;
	}
};
// export default defineComponent({
// 	name: "HomeView",
// 	// components: {
// 	//   HelloWorld,
// 	// },
// });
</script>
