import { readJsonFile } from "@/AppIO/Read";
import { newitemData } from "@/DataType/tiemData";
/**
 * 该类实现了一个 Map 对象池，用于重用 Map 对象
 * @class MapPool
 */
export class MapPool {
  /**
   * 私有静态变量，用于存储 Map 对象
   * @private
   * @type {Map<string, tiemData>} //里面map的key为-1时代表蓝图的建筑数量
   */
  public static pool: Map<string, newitemData> = new Map(); 
  /**
   * 获取一个 Map 对象
   * 如果对象池中有可用的 Map 对象，则从对象池中取出一个
   * 否则，创建一个新的 Map 对象
   * @returns newtiemData
   */
  public static _get(key: string): newitemData {
    let map = MapPool.pool.get(key);
    if (!map) {
      map = new newitemData();
      MapPool.pool.set(key, map);
    }
    return map;
  }

  /**
   * 将 Map 对象放回对象池中
   * 如果对象池中已经有 10 个 Map 对象，则不再放回
   * 
   */
  public static _release(key: string, map:newitemData) {
    this.pool.clear();
    if (MapPool.pool.size < 10) {
      MapPool.pool.set(key, map);
    } else {
      MapPool.pool.delete(key);
    }
  }
  /**
   * 清空全部的 Map 对象
   */
  public static _clear() {
    for (let key of MapPool.pool.keys()) {
      MapPool.pool.get(key)?.clear();
    }
    MapPool.pool.clear();
  }
  /**
   * 查找一个 Map 对象
   * 
   * 根据 key 查找 Map 对象
   * @param {string} key
   */
  public static _find<K, V>(key: string): newitemData | undefined {
    return MapPool.pool.get(key);
  }
  public static async _findFoOutPool(key: string, outPath: string): Promise<newitemData> {
    if (this.pool.has(key)) return this.pool.get(key)!;
    console.log("从文件中读取数据");
    const outMap = await readJsonFile(outPath);
    const map = this._get(key);
    map.longItem = outMap.longItem;
    map.typtItem = new Map(Object.entries(outMap.typtItem).map(([key, value]) => [Number(key), value as number]));
    map.numItem = new Map(Object.entries(outMap.numItem).map(([key, value]) => [Number(key), value as number]));
    // for (const key in outMap) {
    //   if (Object.prototype.hasOwnProperty.call(outMap, key)) {
    //     console.log(outMap, key);
    //     //map?.set(Number(key), outMap[key]);
    //   }
    // }
    return map;
  }
}