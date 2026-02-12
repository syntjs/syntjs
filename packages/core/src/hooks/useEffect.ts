import { getCurrentInstance } from '../component/instance';

export function useEffect(callback: () => void | (() => void), deps?: any[]): void {
    const instance = getCurrentInstance();
    if (!instance) {
        throw new Error('useEffect must be called within a component');
    }

    if (!instance._hooks) instance._hooks = [];
    const index = instance._hookIndex++;

    let hook = instance._hooks[index];
    if (!hook) {
        hook = {
            type: 'effect',
            deps,
            cleanup: null,
            needsRun: true
        };
        instance._hooks[index] = hook;
    }

    // Check deps
    const hasChanged = !deps ||
        !hook.deps ||
        deps.length !== hook.deps.length ||
        deps.some((dep, i) => dep !== hook.deps[i]);

    if (hasChanged) {
        hook.needsRun = true;
        hook.deps = deps ? [...deps] : undefined;
    }

    // Schedule effect
    instance._pendingEffects.push(() => {
        if (hook.needsRun) {
            if (hook.cleanup) hook.cleanup();
            const cleanup = callback();
            hook.cleanup = typeof cleanup === 'function' ? cleanup : null;
            hook.needsRun = false;
        }
    });
}