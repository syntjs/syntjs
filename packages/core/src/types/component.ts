import type { SyntVNode } from '../vnode';

export interface ComponentInstance {
    // Core
    id: number;
    fn: Function;
    props: any;
    vnode: SyntVNode | null;
    container: HTMLElement | null;
    isMounted: boolean;

    // Methods
    update: () => void;
    unmount: () => void;

    // Hooks system
    _hooks: any[];
    _hookIndex: number;
    _pendingEffects: Array<() => void>;

    // Flags
    _isUpdating: boolean;
}