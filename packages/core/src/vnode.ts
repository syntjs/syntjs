// Единственное определение VNode во всем проекте
export const TextSymbol = Symbol('syntjs.text');
export const FragmentSymbol = Symbol('syntjs.fragment');

export interface SyntVNode {
    type: string | Function | symbol;
    props: Record<string, any>;
    children: SyntVNode[];
    el?: HTMLElement | Text | null;
    key?: string | number | null;
    __isVNode: true;
}

// Фабрики VNode
export function createElement(
    type: string | Function | symbol,
    props: Record<string, any> | null = null,
    ...children: any[]
): SyntVNode {
    const normalizedChildren = children
        .flat(Infinity)
        .filter(child => child != null && child !== false)
        .map(child => {
            if (child && typeof child === 'object' && '__isVNode' in child) {
                return child as SyntVNode;
            }
            if (typeof child === 'string' || typeof child === 'number') {
                return createTextVNode(String(child));
            }
            return createTextVNode('');
        });

    return {
        type,
        props: props || {},
        children: normalizedChildren,
        key: props?.key ?? null,
        el: null,
        __isVNode: true
    };
}

export function createTextVNode(text: string): SyntVNode {
    return {
        type: TextSymbol,
        props: { nodeValue: text },
        children: [],
        key: undefined,
        el: null,
        __isVNode: true
    };
}

export function isTextVNode(vnode: SyntVNode): boolean {
    return vnode.type === TextSymbol;
}

export function isFragmentVNode(vnode: SyntVNode): boolean {
    return vnode.type === FragmentSymbol;
}