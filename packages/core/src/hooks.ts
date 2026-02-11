// hook.ts
import { ref, effect } from './reactivity';
import { ComponentInstance, getCurrentComponentInstance } from './component-system';

// Глобальные переменные для системы хуков
let hookIndex = 0;
let isRendering = false;

// Перехватчик для сброса индекса хуков перед рендером
export function prepareHooksForRender(instance: any): void {
    if (instance) {
        instance._hookIndex = 0;
    }
}

export function useState<T>(initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
    const instance = getCurrentComponentInstance() || {} as ComponentInstance ;

    if (!instance) {
        throw new Error('useState must be called within a component');
    }

    // Инициализируем хранилище хуков
    if (!instance?._hooks) {
        instance._hooks = [];
    }

    // Инициализируем индекс хуков для этого компонента
    if (instance._hookIndex === undefined) {
        instance._hookIndex = 0;
    }

    const currentHookIndex = instance._hookIndex;

    // Если хук с таким индексом уже существует - используем его
    if (instance._hooks[currentHookIndex] === undefined) {
        // Создаем новый хук
        const stateRef = ref(initialValue);

        // Создаем эффект для отслеживания изменений (только один раз!)
        let isFirstRun = true;
        const unsubscribe = effect(() => {
            // Просто читаем значение, чтобы активировать отслеживание
            const currentValue = stateRef.value;

            // При изменении - обновляем компонент (кроме первого запуска)
            if (!isFirstRun && instance && instance.update) {
                // Асинхронное обновление
                Promise.resolve().then(() => {
                    if (!isRendering) {
                        instance.update();
                    }
                });
            }

            isFirstRun = false;
        });

        instance._hooks[currentHookIndex] = {
            type: 'state',
            ref: stateRef,
            unsubscribe: unsubscribe,
            setter: null
        };
    }

    const hook = instance._hooks[currentHookIndex];

    // Создаем setter функцию если ее нет
    if (!hook.setter) {
        hook.setter = (value: T | ((prev: T) => T)) => {
            const oldValue = hook.ref.value;
            const newValue = typeof value === 'function'
                ? (value as (prev: T) => T)(oldValue)
                : value;

            // Обновляем значение
            hook.ref.value = newValue;
        };
    }

    // Увеличиваем индекс для следующего хука
    instance._hookIndex++;

    return [hook.ref.value, hook.setter];
}

// Более простая версия без effect (рекомендую эту)
export function useStateSimple<T>(initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
    const instance = getCurrentComponentInstance();

    if (!instance) {
        throw new Error('useState must be called within a component');
    }

    if (!instance._hooks) {
        instance._hooks = [];
    }

    if (instance._hookIndex === undefined) {
        instance._hookIndex = 0;
    }

    const currentHookIndex = instance._hookIndex;

    // Инициализация хука
    if (instance._hooks[currentHookIndex] === undefined) {
        const stateRef = ref(initialValue);

        instance._hooks[currentHookIndex] = {
            type: 'state',
            ref: stateRef,
            setter: null
        };
    }

    const hook = instance._hooks[currentHookIndex];

    // Создаем setter
    if (!hook.setter) {
        hook.setter = (value: T | ((prev: T) => T)) => {
            const oldValue = hook.ref.value;
            const newValue = typeof value === 'function'
                ? (value as (prev: T) => T)(oldValue)
                : value;

            if (oldValue !== newValue) {
                hook.ref.value = newValue;

                // Триггерим обновление компонента
                if (instance.update) {
                    // Асинхронное обновление для batch
                    Promise.resolve().then(() => {
                        if (!isRendering) {
                            isRendering = true;
                            instance.update();
                            isRendering = false;
                        }
                    });
                }
            }
        };
    }

    instance._hookIndex++;

    return [hook.ref.value, hook.setter];
}

export function useMemo<T>(factory: () => T, deps?: any[]): T {
    const instance = getCurrentComponentInstance();

    if (!instance) {
        throw new Error('useMemo must be called within a component');
    }

    if (!instance._hooks) {
        instance._hooks = [];
    }

    if (instance._hookIndex === undefined) {
        instance._hookIndex = 0;
    }

    const currentHookIndex = instance._hookIndex;

    // Инициализация
    if (instance._hooks[currentHookIndex] === undefined) {
        instance._hooks[currentHookIndex] = {
            type: 'memo',
            value: null as T,
            deps: deps,
            factory: factory
        };
    }

    const hook = instance._hooks[currentHookIndex];

    // Проверяем зависимости
    const shouldUpdate = !deps || !hook.deps || deps.some((dep, i) => dep !== hook.deps[i]);

    if (shouldUpdate) {
        hook.value = factory();
        hook.deps = deps;
    }

    instance._hookIndex++;

    return hook.value;
}

// Новый хук useEffect
export function useEffect(callback: () => void | (() => void), deps?: any[]): void {
    const instance = getCurrentComponentInstance();

    if (!instance) {
        throw new Error('useEffect must be called within a component');
    }

    if (!instance._hooks) {
        instance._hooks = [];
    }

    if (instance._hookIndex === undefined) {
        instance._hookIndex = 0;
    }

    const currentHookIndex = instance._hookIndex;

    // Инициализация
    if (instance._hooks[currentHookIndex] === undefined) {
        instance._hooks[currentHookIndex] = {
            type: 'effect',
            deps: deps,
            cleanup: null as (() => void) | null,
            needsRun: true
        };
    }

    const hook = instance._hooks[currentHookIndex];

    // Проверяем зависимости
    const hasChanged = !deps || !hook.deps || deps.some((dep, i) => dep !== hook.deps[i]);

    if (hasChanged) {
        // Помечаем для выполнения после рендера
        hook.needsRun = true;
        hook.deps = deps;
    }

    instance._hookIndex++;

    // Запускаем эффекты после рендера
    if (!instance._pendingEffects) {
        instance._pendingEffects = [];
    }
    instance._pendingEffects.push(() => {
        if (hook.needsRun) {
            // Очищаем предыдущий эффект
            if (hook.cleanup) {
                hook.cleanup();
            }

            // Запускаем новый
            const cleanup = callback();
            hook.cleanup = typeof cleanup === 'function' ? cleanup : null;
            hook.needsRun = false;
        }
    });
}