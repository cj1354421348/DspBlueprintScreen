/*
* 单个蓝图处理后的数据
**/
interface tiemData {
    longItem:number;//建筑数量
    typtItem:Map<number,number>;//产出物品
    numItem:Map<number,number>;//建筑要求
}

export class newitemData implements tiemData{
    longItem: number;
    typtItem: Map<number, number>;
    numItem: Map<number, number>;
    constructor(){
        this.longItem = 0;
        this.typtItem = new Map();
        this.numItem = new Map();

    }
    clear(){
        this.longItem = 0;
        this.typtItem?.clear();
        this.numItem?.clear();
    }
}