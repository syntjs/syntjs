import { createElement } from '@syntjs/jsx'
export { jsx, jsxs, jsxDEV, createElement, Fragment } from './jsx-runtime';
export type { SyntVNode, SyntJSXElement } from './types';

// Auto-set JSX pragma for TypeScript
if (typeof global !== 'undefined') {
    (global as any).JSX = { Fragment: Symbol('Fragment') };
}

// Helper for manual JSX usage
export function h(
    type: string | Function,
    props: Record<string, any> | null,
    ...children: any[]
) {
    return createElement(type, props, ...children);
}