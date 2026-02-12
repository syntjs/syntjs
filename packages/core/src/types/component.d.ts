import type { SyntVNode } from '../vnode';
export interface ComponentInstance {
    id: number;
    fn: Function;
    props: any;
    vnode: SyntVNode | null;
    container: HTMLElement | null;
    isMounted: boolean;
    update: () => void;
    unmount: () => void;
    _hooks: any[];
    _hookIndex: number;
    _pendingEffects: Array<() => void>;
    _isUpdating: boolean;
}
