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
import { ElLoading } from 'element-plus'
const outBluepr = new Set<string>();
let config: config;
const buildingIcons = ref<any>([]);
const buildNum = ref(0);
const options = {
	text: '',
	background: 'rgba(0, 0, 0, 0.7)',
}
onMounted(() => {
	config = getConfigPath() as config;
	MapData.getInstance().getDataforLong(config.stagingPath + "\\主文件.json");
})
/**
 * 初始化蓝图
 */
const populateSpawnData = async () => {
	const loading = ElLoading.service(options)
	MapPool._clear();
	MapData.getInstance().clearData();
	let rootPath = config.rootPath; // 网页测试
	let test = getAllFiles(rootPath);
	let inputData = await readFiles(test); // inputData 是一个 Map 对象
	let blueprintData: BlueprintData;
	// 将 Map 转换为 Promise 数组并并行处理所有异步操作
	let processedCount = 1;
	const promises = Array.from(inputData.entries()).map(async ([index, element]) => {
		options.text = `${processedCount}/${inputData.size}`;
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
		processedCount++;
	});
	// 等待所有 Promise 完成
	await Promise.all(promises);
	// 确保在所有异步操作执行完成后再保存数据
	MapData.getInstance().saveData();
	console.log(MapData.getInstance().testData);
	loading.close();
};

//筛选蓝图按钮
const simpleFilter = async function () {
	options.text = '筛选中...';
	const loading = ElLoading.service(options);
    outBluepr.clear();
    const data = MapData.getInstance().testData;
    const seleceData = SeleceManag.getInstance().seleceIconArr;
    const excludeData = SeleceManag.getInstance().excludeIconArr;
    console.log(MapPool.pool);
    // 存储所有的 Promise
    const promises: Promise<void>[] = [];
    // 使用 forEach 收集所有的异步操作
    data.forEach((element, index) => {
        const promise = MapPool._findFoOutPool(index, element.outPath)
            .then((counter) => {
                if (counter) {
                    let hasOverlap = false;
                    let hasNoExclude = true;
                    let isMax = true;

                    if (seleceData.length)
                        hasOverlap = seleceData.every(value => counter.has(value));
                    
                    if (excludeData.length)
                        hasNoExclude = !excludeData.some(value => counter.has(value));
                    
                    if (buildNum.value && counter.has(-1)) {
                        console.log(counter.get(-1), buildNum.value);
                        isMax = (counter.get(-1) as number) <= buildNum.value;
                    }
					console.log(hasOverlap, hasNoExclude);
                    if (hasOverlap && hasNoExclude && isMax) {
                        outBluepr.add(index);
                    }
                }
            })
            .catch((error) => {
                console.error(`Error processing element at index ${index}:`, error);
            });

        // 将每个异步操作添加到 promises 数组中
        promises.push(promise);
    });
    // 等待所有 Promise 完成
    await Promise.all(promises);
	loading.close();
};


//导出筛选蓝图
const exportFilterBluepr = async function () {
	options.text = '导出中...';
	const loading = ElLoading.service(options)
    console.log(outBluepr);
    // 用于存储所有的 Promise
    const promises: Promise<void>[] = [];
    // 遍历 outBluepr 集合
    outBluepr.forEach(index => {
        const data = MapData.getInstance().testData.get(index);
        if (data) {
            // 将每个 copyFile 调用返回的 Promise 存储到 promises 数组中
            const promise = copyFile(data.path, config.outputPath);
            promises.push(promise);
        }
    });
    // 等待所有的拷贝操作完成
    await Promise.all(promises);
	loading.close();
};

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
		counter.set(-1, data.buildings.length);
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
