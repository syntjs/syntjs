type Dep = Set<ReactiveEffect>;
export interface ReactiveEffect<T = any> {
    (): T;
    deps: Dep[];
    active: boolean;
}
export declare function track(target: object, key: unknown): void;
export declare function trigger(target: object, key: unknown): void;
export declare function effect<T = any>(fn: () => T): () => void;
export {};
