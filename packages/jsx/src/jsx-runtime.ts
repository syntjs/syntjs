import type { SyntVNode } from './types';
export { Fragment } from './types';

// Main JSX runtime function (compatible with React)
export function jsx(
    type: string | Function | symbol,
    props: Record<string, any>,
    key?: string | number
): SyntVNode {
    const { children, ...restProps } = props || {};

    return {
        type,
        props: restProps || {},
        children: normalizeChildren(children),
        key,
        __isVNode: true
    };
}

// For multiple children (jsxs)
export function jsxs(
    type: string | Function | symbol,
    props: Record<string, any>,
    key?: string | number
): SyntVNode {
    return jsx(type, props, key);
}

// Classic createElement (for compatibility)
export function createElement(
    type: string | Function,
    props: Record<string, any> | null,
    ...children: any[]
): SyntVNode {
    const finalProps = props || {};
    if (children.length > 0) {
        finalProps.children = children;
    }

    return jsx(type, finalProps, finalProps.key);
}

// For development (jsx-dev-runtime)
export function jsxDEV(
    type: string | Function | symbol,
    props: Record<string, any>,
    key?: string | number,
    isStaticChildren?: boolean,
    source?: any,
    self?: any
): SyntVNode {
    // Add debug info in dev mode
    const vnode = jsx(type, props, key);
    if (process.env.NODE_ENV !== 'production') {
        (vnode as any)._source = source;
        (vnode as any)._self = self;
    }
    return vnode;
}

// Helper to normalize children
function normalizeChildren(children: any): SyntVNode[] {
    if (children == null) return [];

    // Single child
    if (!Array.isArray(children)) {
        return [createVNodeFromChild(children)];
    }

    // Multiple children - flatten and filter
    return children.flat(Infinity).filter(Boolean).map(createVNodeFromChild);
}

function createVNodeFromChild(child: any): SyntVNode {
    // Text node
    if (typeof child === 'string' || typeof child === 'number') {
        return {
            type: 'TEXT_ELEMENT',
            props: { nodeValue: String(child) },
            children: [],
            __isVNode: true
        };
    }

    // Already a VNode
    if (child && child.__isVNode) {
        return child;
    }

    // Other primitives (boolean, null, undefined were filtered)
    return {
        type: 'TEXT_ELEMENT',
        props: { nodeValue: String(child) },
        children: [],
        __isVNode: true
    };
}