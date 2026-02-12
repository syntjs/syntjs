import type { SyntVNode } from '../vnode';
export type VNodeDiff = {
    type: 'SET_ATTR' | 'REMOVE_ATTR' | 'SET_TEXT' | 'REPLACE' | 'UPDATE' | 'REMOVE' | 'INSERT';
    node?: HTMLElement | Text;
    parent?: HTMLElement;
    attrName?: string;
    attrValue?: any;
    text?: string;
    newVNode?: SyntVNode;
    oldVNode?: SyntVNode;
    vnode?: SyntVNode;
    index?: number;
};
export declare function diff(oldVNode?: SyntVNode, newVNode?: SyntVNode, patches?: VNodeDiff[], index?: number, container?: HTMLElement): VNodeDiff[];
