/**
 * 该类实现了一个 Map 对象池，用于重用 Map 对象 * 
 * @class MapPool
 */
class MapPool {
  /**
   * 私有静态变量，用于存储 Map 对象
   * @private
   * @type {Map<any, any>[]}
   */
  private static pool: Map<any, any>[] = [];

  /**
   * 获取一个 Map 对象
   * 如果对象池中有可用的 Map 对象，则从对象池中取出一个
   * 否则，创建一个新的 Map 对象
   * @returns {Map<any, any>}
   */
  public static get(): Map<any, any> {
    let map = MapPool.pool.shift();
    if (!map) {
      map = new Map();
    }
    return map;
  }

  /**
   * 释放一个 Map 对象
   * 
   * 将 Map 对象放回对象池中
   * 如果对象池中已经有 10 个 Map 对象，则不再放回
   * @param {Map<any, any>} map
   */
  public static release(map: Map<any, any>) {
    map.clear();
    if (MapPool.pool.length < 10) {
      MapPool.pool.push(map);
    }
  }
}

