import { createRoot} from './renderer';

export { render, hydrate, createRoot } from './renderer';
export type { RenderOptions, RenderResult } from './types';

// Convenience function for React-like API
export function createApp(rootComponent: Function, container?: HTMLElement) {
    let root: ReturnType<typeof createRoot> | null = null;
    let appContainer = container;

    return {
        mount(selectorOrElement: string | HTMLElement) {
            if (typeof selectorOrElement === 'string') {
                appContainer = document.querySelector(selectorOrElement) as HTMLElement;
            } else {
                appContainer = selectorOrElement;
            }

            if (!appContainer) {
                throw new Error('Container not found');
            }

            root = createRoot(appContainer);
            const vnode = rootComponent({});
            root.render(vnode);

            return this;
        },

        unmount() {
            if (root) {
                root.unmount();
                root = null;
            }
        }
    };
}