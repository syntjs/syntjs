import type { SyntVNode } from '@syntjs/jsx';

export interface RenderOptions {
    container: HTMLElement;
    hydrate?: boolean;
}

export interface RenderResult {
    unmount: () => void;
    update: (vnode: SyntVNode) => void;
    container: HTMLElement;
}

export interface ComponentInstance {
    vnode: SyntVNode;
    container: HTMLElement;
    isMounted: boolean;
    effects: (() => void)[];
    update: () => void;
    unmount: () => void;
}