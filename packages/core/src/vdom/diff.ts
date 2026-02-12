import type { SyntVNode } from '../vnode';
import { TextSymbol } from '../vnode';

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

export function diff(
    oldVNode?: SyntVNode,
    newVNode?: SyntVNode,
    patches: VNodeDiff[] = [],
    index = 0,
    container?: HTMLElement
): VNodeDiff[] {
    if (!oldVNode && newVNode) {
        patches.push({
            type: 'INSERT',
            newVNode,
            parent: container,
            index
        });
        return patches;
    }

    if (oldVNode && !newVNode) {
        patches.push({
            type: 'REMOVE',
            node: oldVNode.el as HTMLElement,
            parent: container,
            index
        });
        return patches;
    }

    if (oldVNode?.type !== newVNode?.type) {
        patches.push({
            type: 'REPLACE',
            oldVNode,
            newVNode,
            index
        });
        return patches;
    }

    if (newVNode?.type === TextSymbol) {
        if (oldVNode?.props.nodeValue !== newVNode?.props.nodeValue) {
            patches.push({
                type: 'SET_TEXT',
                node: oldVNode?.el as Text,
                vnode: newVNode,
                oldVNode,
                newVNode,
                text: newVNode?.props.nodeValue
            });
        }
        return patches;
    }

    if (typeof newVNode?.type === 'string') {
        diffProps(oldVNode, newVNode, patches);
        diffChildren(oldVNode, newVNode, patches, container);
    }

    return patches;
}

function diffProps(oldVNode?: SyntVNode, newVNode?: SyntVNode, patches?: VNodeDiff[]) {
    const oldProps = oldVNode?.props || {};
    const newProps = newVNode?.props || {};
    const el = oldVNode?.el as HTMLElement;

    if (!el) return;

    Object.keys(oldProps).forEach(key => {
        if (key !== 'children' && key !== 'key' && !(key in newProps)) {
            patches?.push({
                type: 'REMOVE_ATTR',
                node: el,
                attrName: key
            });
        }
    });

    Object.keys(newProps).forEach(key => {
        if (key !== 'children' && key !== 'key') {
            if (oldProps[key] !== newProps[key]) {
                patches?.push({
                    type: 'SET_ATTR',
                    node: el,
                    vnode: newVNode,
                    attrName: key,
                    attrValue: newProps[key]
                });
            }
        }
    });
}

function diffChildren(
    oldVNode?: SyntVNode,
    newVNode?: SyntVNode,
    patches?: VNodeDiff[],
    container?: HTMLElement
) {
    const oldChildren = oldVNode?.children || [];
    const newChildren = newVNode?.children || [];
    const max = Math.max(oldChildren.length, newChildren.length);
    const parent = oldVNode?.el as HTMLElement || container;

    for (let i = 0; i < max; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];

        if (oldChild && newChild) {
            diff(oldChild, newChild, patches, i, parent);
        }
        else if (!oldChild && newChild) {
            patches?.push({
                type: 'INSERT',
                newVNode: newChild,
                parent,
                index: i
            });
        }
        else if (oldChild && !newChild) {
            patches?.push({
                type: 'REMOVE',
                node: oldChild.el as HTMLElement,
                parent,
                index: i
            });
        }
    }
}