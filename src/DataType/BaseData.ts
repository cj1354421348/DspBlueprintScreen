interface BaseData {
    name:string,
    MD5:string,
    path:string,
    outPath:string,
}
/**
 * 所有蓝图的数据，要做持久化的
 * @param name 蓝图文件名称
 * @param md5 对应的md5
 * @param path 对应的原始路径
 * @param outPath 对应的解析后路径
 */
export class newBaseData implements BaseData{
    constructor(name:string,md5:string,path:string,outPath:string){
        this.name = name;
        this.MD5 = md5;
        this.path = path;
        this.outPath = outPath;
    }
    outPath: string;
    name: string;
    MD5: string;
    path: string;
}