import { effect } from './reactivity';

// Глобальные переменные для отслеживания текущего компонента
let currentComponentInstance: ComponentInstance | null = null;
let componentIdCounter = 0; // Добавил объявление

export interface ComponentInstance {
    id: number;
    fn: Function;
    props: any;
    vnode: any;
    container: HTMLElement | null;
    cleanup: (() => void) | null; // Храним cleanup функцию
    isMounted: boolean;
    update: () => void;
    unmount: () => void;
    _hooks?: any[];
    _hookIndex?: number;
    _pendingEffects?: Array<() => void>;
    _effectsCleanup?: Array<(() => void) | null>;
}

// Создаем инстанс компонента с реактивными обновлениями
export function createComponentInstance(
    fn: Function,
    props: any
): ComponentInstance {
    const id = ++componentIdCounter;
    let vnode: any;
    let isMounted = false;

    const instance: ComponentInstance = {
        id,
        fn,
        props,
        vnode: null,
        container: null,
        cleanup: null,
        isMounted: false,
        update: () => {
            if (!instance.container) return;

            // Останавливаем предыдущий эффект если есть
            if (instance.cleanup) {
                instance.cleanup();
            }

            // Запускаем новый эффект рендеринга
            instance.cleanup = effect(() => {
                // Сохраняем текущий инстанс
                const prevInstance = currentComponentInstance;
                currentComponentInstance = instance;

                try {
                    vnode = fn(props);
                    instance.vnode = vnode;

                    if (isMounted && instance.container) {
                        // TODO: Здесь будет умное обновление (patch)
                        // Пока просто перерисовываем
                        instance.container.innerHTML = '';
                        mountComponent(instance, instance.container);
                    }
                } finally {
                    currentComponentInstance = prevInstance;
                }
            });
        },
        unmount: () => {
            if (instance.cleanup) {
                // Вызываем cleanup функцию
                instance.cleanup();
                instance.cleanup = null;
            }
            instance.container = null;
            isMounted = false;
        }
    };

    // Первоначальный рендер
    instance.update();
    isMounted = true;

    return instance;
}

// Монтируем компонент в DOM
export function mountComponent(
    instance: ComponentInstance,
    container: HTMLElement
): void {
    instance.container = container;

    if (instance.vnode) {
        // TODO: Использовать существующий рендерер
        // Пока просто вызовем update
        instance.update();
    }

    setCurrentComponentInstance(instance);
}
export function setCurrentComponentInstance(instance: ComponentInstance | null): void {
    currentComponentInstance = instance;
}
// Хук для получения текущего инстанса (для useState и др.)
export function getCurrentComponentInstance(): ComponentInstance | null {
    return currentComponentInstance;
}

// Force update текущего компонента
export function forceUpdate(): void {
    if (currentComponentInstance) {
        currentComponentInstance.update();
    }
}