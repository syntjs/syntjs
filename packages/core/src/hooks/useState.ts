import { ref } from '../reactivity';
import { getCurrentInstance } from '../component';

export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void] {
    const instance = getCurrentInstance();
    if (!instance) throw new Error('useState must be called within a component');

    if (!instance._hooks) instance._hooks = [];
    if (instance._hookIndex === undefined) instance._hookIndex = 0;

    // ⚠️ ВАЖНО: берем индекс, НО НЕ ИНКРЕМЕНТИРУЕМ сразу!
    const index = instance._hookIndex;

    // Создаем хук если нужно
    if (!instance._hooks[index]) {
        const stateRef = ref(initial);

        const setter = (value: T | ((prev: T) => T)) => {
            const oldValue = stateRef.value;
            const newValue = typeof value === 'function'
                ? (value as (prev: T) => T)(oldValue)
                : value;

            if (oldValue !== newValue) {
                stateRef.value = newValue;

                if (instance.update && instance.isMounted && !instance._isUpdating) {
                    queueMicrotask(() => instance.update());
                }
            }
        };

        instance._hooks[index] = {
            ref: stateRef,
            setter
        };
    }

    // ✅ ИНКРЕМЕНТ ТОЛЬКО ПОСЛЕ ВСЕХ ОПЕРАЦИЙ!
    instance._hookIndex++;

    const hook = instance._hooks[index];
    return [hook.ref.value, hook.setter];
}

export const useStateSimple = useState;