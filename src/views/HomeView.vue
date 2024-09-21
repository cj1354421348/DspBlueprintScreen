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
import { Tipsessage } from "@/Toop/Tips";
const outBluepr = new Set<string>();
let config: config;
const buildingIcons = ref<any>([]);
const buildNum = ref(0);
const options = ref({
	text: '',
	background: 'rgba(0, 0, 0, 0.7)',
})
onMounted(() => {
	config = getConfigPath() as config;
	MapData.getInstance().getDataforLong(config.stagingPath + "\\主文件.json");
})
/**
 * 初始化蓝图
 */
 const populateSpawnData = async () => { 
    const loading = ElLoading.service(options.value); 
    MapPool._clear(); 
    MapData.getInstance().clearData(); 
 
    let rootPath = config.rootPath; // 网页测试 
    let test = getAllFiles(rootPath); 
    let inputData = await readFiles(test); // inputData 是一个 Map 对象 
 
    let blueprintData; 
    let processedCount = 1;  
	loading.setText(`${processedCount}/${inputData.size}`); 
    const processEntry = async ([index, element]: [string, { filePath: string, data: string }]) => {
        try { 
            blueprintData = fromStr(element.data); 
            let okData = buildingCounter(blueprintData, index); 
            let outUrl = await createDir(index, okData); 
            let oneBlueprintData = new newBaseData(blueprintData.header.shortDesc, index, element.filePath, outUrl); 
            MapData.getInstance().setData(index, oneBlueprintData); 
        } catch (e) { 
            console.error("导入的蓝图数据有误", e); 
            return; 
        } finally { 
            processedCount++; 
            loading.setText(`${processedCount}/${inputData.size}`); 
        } 
    };
    // 使用 setImmediate 分解任务
    for (let entry of inputData.entries()) {
        await new Promise<void>((resolve) => {
            setImmediate(async () => {
                await processEntry(entry);
                resolve();
            });
        });
    }
    MapData.getInstance().saveData(); 
    console.log(MapData.getInstance().testData); 
	Tipsessage("蓝图数据导入完成:"+MapData.getInstance().testData.size);
    loading.close(); 
};



//筛选蓝图按钮
const simpleFilter = async function () { 
    options.value.text = '筛选中...'; 
    const loading = ElLoading.service(options.value); 
    outBluepr.clear(); 
    const data = MapData.getInstance().testData; 
    const seleceData = SeleceManag.getInstance().seleceIconArr; 
    const excludeData = SeleceManag.getInstance().excludeIconArr; 
    console.log(MapPool.pool); 
    // 使用 for...of 循环，配合 setImmediate 分解任务
    for (const [index, element] of data.entries()) { 
        // 将每个处理操作推迟到事件循环的下一次迭代
        await new Promise<void>((resolve) => { 
            setImmediate(async () => { 
                try {
                    const counter = await MapPool._findFoOutPool(index, element.outPath);
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
                } catch (error) {
                    console.error(`Error processing element at index ${index}:`, error);
                } finally {
                    // 任务完成后解除 Promise 挂起
                    resolve(); 
                }
            });
        });
    }
    // 所有数据处理完成后，关闭 loading
    loading.close(); 
	Tipsessage("筛选完成:"+outBluepr.size);
};



//导出筛选蓝图
const exportFilterBluepr = async function () {
	options.value.text = '导出中...';
	const loading = ElLoading.service(options.value)
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
