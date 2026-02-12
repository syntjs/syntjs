import type { SyntVNode } from '@syntjs/core';
// 🔥 Импортируем createElement из core!
import { createElement, FragmentSymbol, TextSymbol } from '@syntjs/core';

export const Fragment = FragmentSymbol;

// ⚠️ jsx - это просто обертка над createElement
export function jsx(
    type: string | Function | symbol,
    props: Record<string, any> | null,
    key?: string | number
): SyntVNode {
    const { children, ...rest } = props || {};
    console.log('jsx call')
    // ✅ Просто передаем в createElement
    return createElement(
        type,
        { ...rest, key: key ?? rest?.key },
        ...(Array.isArray(children) ? children : [children])
    );
}

export const jsxs = jsx;
export const jsxDEV = jsx;