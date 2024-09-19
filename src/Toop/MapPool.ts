import { readJsonFile } from "@/AppIO/Read";

/**
 * 该类实现了一个 Map 对象池，用于重用 Map 对象
 * @class MapPool
 */
export class MapPool {
  /**
   * 私有静态变量，用于存储 Map 对象
   * @private
   * @type {Map<string, Map<any, any>>} //里面map的key为-1时代表蓝图的建筑数量
   */
  public static pool: Map<string, Map<any, any>> = new Map(); 
  /**
   * 获取一个 Map 对象
   * 如果对象池中有可用的 Map 对象，则从对象池中取出一个
   * 否则，创建一个新的 Map 对象
   * @returns {Map<K, V>}
   */
  public static _get<K, V>(key: string): Map<K, V> {
    let map = MapPool.pool.get(key);
    if (!map) {
      map = new Map<K, V>();
      MapPool.pool.set(key, map);
    }
    return map;
  }

  /**
   * 将 Map 对象放回对象池中
   * 如果对象池中已经有 10 个 Map 对象，则不再放回
   * @param {string} key
   * @param {Map<K, V>} map
   */
  public static _release<K, V>(key: string, map: Map<K, V>) {
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
   * @returns {Map<K, V>}
   */
  public static _find<K, V>(key: string): Map<K, V> | undefined {
    return MapPool.pool.get(key);
  }
  public static _findFoOutPool(key: string,outPath:string):Map<number,number>{
    if(this.pool.has(key)) return this.pool.get(key)!;
    console.log("从文件中读取数据");
    let outMap = readJsonFile(outPath);
    let map = this._get<number,number>(key);
    for (const key in outMap) {
      if (Object.prototype.hasOwnProperty.call(outMap, key)) {
        map?.set(Number(key), outMap[key]);
      }
    }
    return map;
  }
}