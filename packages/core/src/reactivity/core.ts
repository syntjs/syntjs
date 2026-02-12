type Dep = Set<ReactiveEffect>;
type KeyToDepMap = Map<any, Dep>;
const targetMap = new WeakMap<any, KeyToDepMap>();

export interface ReactiveEffect<T = any> {
    (): T;
    deps: Dep[];
    active: boolean;
}

let activeEffect: ReactiveEffect | undefined;
const effectStack: ReactiveEffect[] = [];

export function track(target: object, key: unknown): void {
    if (!activeEffect) return;

    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }

    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
}

export function trigger(target: object, key: unknown): void {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;

    const dep = depsMap.get(key);
    if (dep) {
        const effects = new Set(dep);
        effects.forEach(effect => {
            if (effect !== activeEffect) {
                effect();
            }
        });
    }
}

export function effect<T = any>(fn: () => T): () => void {
    const effectFn: ReactiveEffect = () => {
        if (!effectFn.active) return fn();

        try {
            effectStack.push(effectFn);
            activeEffect = effectFn;
            return fn();
        } finally {
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1];
        }
    };

    effectFn.deps = [];
    effectFn.active = true;
    effectFn();

    return () => {
        if (effectFn.active) {
            for (const dep of effectFn.deps) {
                dep.delete(effectFn);
            }
            effectFn.deps.length = 0;
            effectFn.active = false;
        }
    };
}