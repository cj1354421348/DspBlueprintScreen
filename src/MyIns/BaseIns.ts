// export function Singleton<E>() {
//     class SingletonE {
//         protected constructor() {}
//         private static _inst: SingletonE|null = null;
//         public static get inst(): E {
//             if(SingletonE._inst == null) {
//                 SingletonE._inst = new this();
//             }
//             return SingletonE._inst as E;
//         }
//     }

//     return SingletonE;
// }

export class BaseIns {
    private static instance: BaseIns;

    static getInstance<T extends BaseIns>(this: new () => T): T {
        // 自动挂载子类到 window 对象
        const className = this.name; // 获取当前类名
        if (!(window as any)[className]) {
            (window as any)[className] = this; // 将类挂载到 window
        }
        // 创建单例实例
        if (!(this as any).instance) {
            (this as any).instance = new this();  // 创建实例
        }
        return (this as any).instance;
    }
}