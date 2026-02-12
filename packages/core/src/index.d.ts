import type { ComponentInstance } from './types';
export type { SyntVNode, ComponentInstance } from './types';
export { TextSymbol, FragmentSymbol, createElement } from './vnode';
export { reactive, ref, effect, isRef } from './reactivity';
export { createComponentInstance, mountComponent, getCurrentInstance, setCurrentInstance, mountVNode, } from './component';
export { useState, useStateSimple, useEffect, useMemo } from './hooks';
export declare function createApp(component: Function): {
    mount(selector: string | HTMLElement): /*elided*/ any;
    unmount(): void;
    getInstance(): ComponentInstance | null;
};
export { diff, patch } from './vdom';
