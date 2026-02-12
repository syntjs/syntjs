import type { SyntVNode } from '../vnode';
import { TextSymbol, FragmentSymbol, isTextVNode, isFragmentVNode } from '../vnode';

export function mountVNode(
    vnode: SyntVNode | null | undefined,
    container: HTMLElement
): void {
    if (!vnode?.__isVNode) return;

    // 1. Text node
    if (isTextVNode(vnode)) {
        const textNode = document.createTextNode(vnode.props.nodeValue || '');
        vnode.el = textNode;
        container.appendChild(textNode);
        return;
    }

    // 2. Fragment
    if (isFragmentVNode(vnode)) {
        vnode.children.forEach(child => mountVNode(child, container));
        return;
    }

    // 3. Component - handled by parent
    if (typeof vnode.type === 'function') {
        const div = document.createElement('div');
        vnode.el = div;
        container.appendChild(div);
        return;
    }

    // 4. HTML element
    if (typeof vnode.type === 'string') {
        const el = document.createElement(vnode.type);
        vnode.el = el;

        // Set props
        Object.entries(vnode.props || {}).forEach(([key, value]) => {
            if (value == null) return;

            if (key === 'className' || key === 'class') {
                el.className = String(value);
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.slice(2).toLowerCase();
                el.addEventListener(eventName, value as EventListener);
            } else if (key !== 'children' && key !== 'key') {
                el.setAttribute(key, String(value));
            }
        });

        // Mount children
        vnode.children.forEach(child => mountVNode(child, el));
        container.appendChild(el);
    }
}