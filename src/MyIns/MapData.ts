import { newBaseData } from "@/DataType/BaseData";
import{BaseIns} from "@/MyIns/BaseIns";
export class MapData extends BaseIns {
    constructor(){
        super();

    }
    public testData = new Map<string,newBaseData>();
    public testData1(){
        this.testData.set("adadad",new newBaseData("a","aa","aaa","aaaa"));
    }
}