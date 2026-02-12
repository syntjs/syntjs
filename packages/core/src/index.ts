import type { ComponentInstance } from './types';
import { createComponentInstance, mountComponent } from './component'
// Types
export type { SyntVNode, ComponentInstance } from './types';
export { TextSymbol, FragmentSymbol, createElement } from './vnode';
// Reactivity
export { reactive, ref, effect, isRef } from './reactivity';
// Component
export {
    createComponentInstance,
    mountComponent,
    getCurrentInstance,
    setCurrentInstance,
    mountVNode,
} from './component';

// Hooks
export { useState, useStateSimple, useEffect, useMemo } from './hooks';

// Public API
export function createApp(component: Function) {
    let instance: ComponentInstance | null = null;

    return {
        mount(selector: string | HTMLElement) {
            instance = createComponentInstance(component, {});
            mountComponent(instance, selector);
            return this;
        },
        unmount() {
            instance?.unmount();
            instance = null;
        },
        getInstance() {
            return instance;
        }
    };
}

export { diff, patch } from './vdom'
// Re-export createElement from jsx
//export { jsx as createElement } from '@syntjs/jsx';