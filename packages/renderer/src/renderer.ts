import type { SyntVNode } from '../../jsx/src/types';
import { Fragment } from '../../jsx/src/jsx-runtime';
import { createComponentInstance, mountComponent } from '../../core/src/component-system';

// Добавляем обратно типы если нужно
export interface RenderResult {
    unmount: () => void;
    update: (vnode: SyntVNode) => void;
    container: HTMLElement;
}

let currentApp: any = null;

// Основной render
export function render(vnode: SyntVNode, container: HTMLElement): RenderResult {
    // Очищаем контейнер
    container.innerHTML = '';

    // Рендерим
    if (typeof vnode.type === 'function') {
        // Создаем инстанс компонента
        const instance = createComponentInstance(vnode.type, {
            ...vnode.props,
            children: vnode.children
        });

        // Монтируем
        mountComponent(instance, container);
        currentApp = instance;

        return {
            unmount: () => {
                instance.unmount();
                currentApp = null;
            },
            update: (newVNode: SyntVNode) => {
                // Для простоты пересоздаем инстанс
                instance.unmount();
                const newInstance = createComponentInstance(newVNode.type as Function, {
                    ...newVNode.props,
                    children: newVNode.children
                });
                mountComponent(newInstance, container);
                currentApp = newInstance;
            },
            container
        };
    } else {
        // Рендерим обычный элемент
        mountElement(vnode, container);

        return {
            unmount: () => {
                container.innerHTML = '';
            },
            update: (newVNode: SyntVNode) => {
                container.innerHTML = '';
                mountElement(newVNode, container);
            },
            container
        };
    }
}

// Добавляем hydrate (простая заглушка)
export function hydrate(vnode: SyntVNode, container: HTMLElement): RenderResult {
    // Пока hydrate работает так же как render
    // В будущем добавим настоящую гидратацию
    console.warn('hydrate() is currently the same as render()');
    return render(vnode, container);
}

// Добавляем createRoot (React 18 style)
export function createRoot(container: HTMLElement) {
    return {
        render: (vnode: SyntVNode) => render(vnode, container),
        unmount: () => { container.innerHTML = ''; }
    };
}

// Остальные функции остаются как были
function mountElement(vnode: SyntVNode, container: HTMLElement): void {
    const el = createDOMFromVNode(vnode);
    if (el) {
        container.appendChild(el);
        vnode.el = el;
    }
}

function createDOMFromVNode(vnode: SyntVNode): HTMLElement | Text | null {
    if (vnode.type === 'TEXT_ELEMENT') {
        return document.createTextNode(vnode.props.nodeValue || '');
    }

    // Проверка на Fragment
    if (vnode.type && (vnode.type as any).toString().includes('Fragment')) {
        const wrapper = document.createElement('span');
        wrapper.style.display = 'contents';

        vnode.children.forEach(child => {
            const childEl = createDOMFromVNode(child);
            if (childEl) {
                wrapper.appendChild(childEl);
            }
        });

        return wrapper;
    }

    if (typeof vnode.type === 'function') {
        // Для вложенных компонентов
        const instance = createComponentInstance(vnode.type, {
            ...vnode.props,
            children: vnode.children
        });

        // Создаем контейнер для компонента
        const componentContainer = document.createElement('div');
        mountComponent(instance, componentContainer);

        return componentContainer;
    }

    if (typeof vnode.type === 'string') {
        const el = document.createElement(vnode.type as string);

        for (const [key, value] of Object.entries(vnode.props)) {
            if (key === 'className') {
                el.className = String(value);
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.slice(2).toLowerCase();
                el.addEventListener(eventName, value as EventListener);
            } else if (key !== 'children' && value !== undefined) {
                el.setAttribute(key, String(value));
            }
        }

        vnode.children.forEach(child => {
            const childEl = createDOMFromVNode(child);
            if (childEl) {
                el.appendChild(childEl);
            }
        });

        return el;
    }

    return null;
}

// createApp остается как был
export function createApp(rootComponent: Function) {
    return {
        mount(selector: string | HTMLElement) {
            const container = typeof selector === 'string'
                ? document.querySelector(selector) as HTMLElement
                : selector;

            if (!container) {
                throw new Error('Container not found');
            }

            const vnode = {
                type: rootComponent,
                props: {},
                children: [],
                __isVNode: true
            } as SyntVNode;

            render(vnode, container);

            return this;
        }
    };
}