// Core reactive system for SyntJS
// Inspired by Vue 3 but with performance optimizations

type Dep = Set<ReactiveEffect>;
type KeyToDepMap = Map<any, Dep>;
const targetMap = new WeakMap<any, KeyToDepMap>();

export interface ReactiveEffect<T = any> {
    (): T;
    deps: Dep[];
    active: boolean;
}

let activeEffect: ReactiveEffect | undefined;
let effectStack: ReactiveEffect[] = [];

// Track dependencies
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

// Trigger updates
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

// Create reactive object
export function reactive<T extends object>(target: T): T {
    return new Proxy(target, {
        get(target, key, receiver) {
            track(target, key);
            return Reflect.get(target, key, receiver);
        },

        set(target, key, value, receiver) {
            const oldValue = Reflect.get(target, key, receiver);
            const result = Reflect.set(target, key, value, receiver);

            if (oldValue !== value) {
                trigger(target, key);
            }

            return result;
        },

        deleteProperty(target, key) {
            const hadKey = Reflect.has(target, key);
            const result = Reflect.deleteProperty(target, key);

            if (hadKey && result) {
                trigger(target, key);
            }

            return result;
        }
    });
}

// Effects (similar to useEffect, watch)
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
            cleanup(effectFn);
            effectFn.active = false;
        }
    };
}

function cleanup(effectFn: ReactiveEffect): void {
    for (const dep of effectFn.deps) {
        dep.delete(effectFn);
    }
    effectFn.deps.length = 0;
}

// Reactive references (like Vue ref)
export function ref<T>(value: T) {
    return reactive({ value });
}

// Readonly reactive objects
export function readonly<T extends object>(target: T): T {
    return new Proxy(target, {
        get(target, key, receiver) {
            return Reflect.get(target, key, receiver);
        },
        set() {
            console.warn('Cannot modify readonly object');
            return true;
        },
        deleteProperty() {
            console.warn('Cannot delete from readonly object');
            return true;
        }
    });
}

// Shallow reactive (only first level)
export function shallowReactive<T extends object>(target: T): T {
    return new Proxy(target, {
        get(target, key, receiver) {
            track(target, key);
            const result = Reflect.get(target, key, receiver);
            return result;
        },

        set(target, key, value, receiver) {
            const oldValue = Reflect.get(target, key, receiver);
            const result = Reflect.set(target, key, value, receiver);

            if (oldValue !== value) {
                trigger(target, key);
            }

            return result;
        }
    });
}