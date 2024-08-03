export function Singleton<E>() {
    class SingletonE {
        protected constructor() {}
        private static _inst: SingletonE|null = null;
        public static get inst(): E {
            if(SingletonE._inst == null) {
                SingletonE._inst = new this();
            }
            return SingletonE._inst as E;
        }
    }

    return SingletonE;
}