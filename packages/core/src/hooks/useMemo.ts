import { getCurrentInstance } from '../component/instance';

export function useMemo<T>(factory: () => T, deps?: any[]): T {
    const instance = getCurrentInstance();
    if (!instance) {
        throw new Error('useMemo must be called within a component');
    }

    if (!instance._hooks) instance._hooks = [];
    const index = instance._hookIndex++;

    let hook = instance._hooks[index];
    if (!hook) {
        hook = {
            type: 'memo',
            value: factory(),
            deps
        };
        instance._hooks[index] = hook;
    } else {
        const hasChanged = !deps ||
            !hook.deps ||
            deps.length !== hook.deps.length ||
            deps.some((dep, i) => dep !== hook.deps[i]);

        if (hasChanged) {
            hook.value = factory();
            hook.deps = deps ? [...deps] : undefined;
        }
    }

    return hook.value;
}