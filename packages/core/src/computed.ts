import { effect, track, trigger } from './reactivity';

export function computed<T>(getter: () => T) {
    let value: T;
    let dirty = true;

    const runner = effect(() => {
        if (dirty) {
            value = getter();
            dirty = false;
        }
    });

    const obj = {
        get value() {
            if (dirty) {
                value = getter();
                dirty = false;
            }
            track(obj, 'value');
            return value;
        },

        set value(newValue: T) {
            console.warn('Computed property is read-only');
        }
    };

    // Recompute when dependencies change
    effect(() => {
        getter();
        if (!dirty) {
            dirty = true;
            trigger(obj, 'value');
        }
    });

    return obj;
}

// Lazy computed (only computes when accessed)
export function lazyComputed<T>(getter: () => T) {
    let computedCache: { value: T } | null = null;

    return {
        get value() {
            if (!computedCache) {
                computedCache = computed(getter);
            }
            return computedCache.value;
        }
    };
}