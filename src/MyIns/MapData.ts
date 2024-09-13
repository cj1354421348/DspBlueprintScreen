import { readJsonFile } from "@/AppIO/Read";
import { createDir } from "@/AppIO/Write";
import { newBaseData } from "@/DataType/BaseData";
import { BaseIns } from "@/MyIns/BaseIns";
export class MapData extends BaseIns {

    constructor() {
        super();

    }
    public testData = new Map<string, newBaseData>();
    public setData(md5: string, data: newBaseData) {
        this.testData.set(md5, data);
    }
    public saveData() {
        // 将对象转换为 JSON 字符串
        createDir("主文件", this.testData);
    }
    public getDataforLong(mainPath:string){
        const data = readJsonFile(mainPath)  as { [key: string]: any } ;
        Object.keys(data).forEach((key) => {
            const element = data[key];
            this.setData(key, element);
            // 处理每个元素
        });
    }
}