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
        const mapObject = Object.fromEntries(this.testData);
        // 将对象转换为 JSON 字符串

        createDir("主文件", mapObject);
    }
}