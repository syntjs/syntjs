export declare const TextSymbol: unique symbol;
export declare const FragmentSymbol: unique symbol;
export interface SyntVNode {
    id: number;
    type: string | Function | symbol;
    props: Record<string, any>;
    children: SyntVNode[];
    el?: HTMLElement | Text | null;
    key?: string | number | null;
    parent: SyntVNode | null;
    __isVNode: boolean;
}
export declare function createElement(type: string | Function | symbol, props?: Record<string, any> | null, ...children: any[]): SyntVNode;
export declare function createTextVNode(text: string): SyntVNode;
export declare function isTextVNode(vnode: SyntVNode): boolean;
export declare function isFragmentVNode(vnode: SyntVNode): boolean;
