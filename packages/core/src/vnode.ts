// Единственное определение VNode во всем проекте
export const TextSymbol = Symbol('syntjs.text');
export const FragmentSymbol = Symbol('syntjs.fragment');

export interface SyntVNode {
    id: number,
    type: string | Function | symbol;
    props: Record<string, any>;
    children: SyntVNode[];
    el?: HTMLElement | Text | null;
    key?: string | number | null;
    parent: SyntVNode | null;  // 👈 ДОБАВЛЯЕМ!
    __isVNode: boolean;
}

let vnodeId = 0;
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

    const vnode = {
        id: ++vnodeId,
        type,
        props: props || {},
        children: normalizedChildren,
        key: props?.key ?? null,
        el: null,
        parent: null,  // 👈 БУДЕТ УСТАНОВЛЕНО ПОЗЖЕ
        __isVNode: true
    };

    // Устанавливаем parent для детей
    vnode.children.forEach(child => child.parent = vnode);

    return vnode;
}

export function createTextVNode(text: string): SyntVNode {
    return {
        id: ++vnodeId,
        type: TextSymbol,
        props: { nodeValue: text },
        children: [],
        key: undefined,
        el: null,
        parent: null,  // 👈 БУДЕТ УСТАНОВЛЕНО ПОЗЖЕ
        __isVNode: true
    };
}

export function isTextVNode(vnode: SyntVNode): boolean {
    return vnode.type === TextSymbol;
}

export function isFragmentVNode(vnode: SyntVNode): boolean {
    return vnode.type === FragmentSymbol;
}