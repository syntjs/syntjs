import type { SyntVNode } from '../vnode';
import type { VNodeDiff } from './diff';
import { mountVNode } from '../component/render';
import { TextSymbol } from '../vnode';

function updateElRefs(vnode: SyntVNode, el: HTMLElement | Text) {
    vnode.el = el;
    if (vnode.type === TextSymbol) return;

    if (vnode.children && vnode.children.length && el instanceof HTMLElement) {
        for (let i = 0; i < vnode.children.length; i++) {
            const child = vnode.children[i];
            const childEl = el.children[i];
            if (child && childEl) {
                updateElRefs(child, childEl as HTMLElement);
            }
        }
    }
}

export function patch(container: HTMLElement, patches: VNodeDiff[]) {
    patches.forEach(patch => {
        switch (patch.type) {
            case 'INSERT':
                if (patch.newVNode && patch.parent) {
                    const temp = document.createElement('div');
                    mountVNode(patch.newVNode, temp);
                    const newEl = temp.firstChild;

                    if (newEl) {
                        if (patch.index !== undefined && patch.parent.children[patch.index]) {
                            patch.parent.insertBefore(newEl, patch.parent.children[patch.index]);
                        } else {
                            patch.parent.appendChild(newEl);
                        }
                        updateElRefs(patch.newVNode, newEl as HTMLElement);
                    }
                }
                break;

            case 'REPLACE':
                if (patch.oldVNode?.el?.parentNode && patch.newVNode) {
                    const parent = patch.oldVNode.el.parentNode;
                    const temp = document.createElement('div');
                    mountVNode(patch.newVNode, temp);
                    const newEl = temp.firstChild;

                    if (newEl) {
                        parent.replaceChild(newEl, patch.oldVNode.el);
                        updateElRefs(patch.newVNode, newEl as HTMLElement);
                        if (patch.oldVNode) {
                            patch.oldVNode.el = newEl as HTMLElement;
                        }
                    }
                }
                break;

            case 'REMOVE':
                if (patch.node?.parentNode) {
                    patch.node.parentNode.removeChild(patch.node);
                }
                break;

            case 'SET_TEXT':
                if (patch.node) {
                    patch.node.nodeValue = patch.text || '';
                    if (patch.vnode) {
                        patch.vnode.el = patch.node;
                    }
                    if (patch.oldVNode) {
                        patch.oldVNode.el = patch.node;
                        patch.oldVNode.props.nodeValue = patch.text;
                    }
                    if (patch.newVNode) {
                        patch.newVNode.el = patch.node;
                        patch.newVNode.props.nodeValue = patch.text;
                    }
                }
                break;

            case 'SET_ATTR':
                if (patch.node && patch.attrName) {
                    const el = patch.node as HTMLElement;

                    if (patch.attrName === 'className' || patch.attrName === 'class') {
                        el.className = String(patch.attrValue || '');
                    }
                    else if (patch.attrName.startsWith('on') && typeof patch.attrValue === 'function') {
                        const eventName = patch.attrName.slice(2).toLowerCase();
                        const oldHandler = (el as any)['__' + eventName];
                        if (oldHandler) {
                            el.removeEventListener(eventName, oldHandler);
                        }
                        el.addEventListener(eventName, patch.attrValue);
                        (el as any)['__' + eventName] = patch.attrValue;
                    }
                    else if (patch.attrName === 'style' && typeof patch.attrValue === 'object') {
                        Object.assign(el.style, patch.attrValue);
                    }
                    else if (patch.attrValue !== undefined && patch.attrValue !== null) {
                        el.setAttribute(patch.attrName, String(patch.attrValue));
                    }

                    if (patch.vnode) {
                        patch.vnode.el = el;
                    }
                }
                break;

            case 'REMOVE_ATTR':
                if (patch.node && patch.attrName) {
                    const el = patch.node as HTMLElement;
                    if (patch.attrName === 'className' || patch.attrName === 'class') {
                        el.className = '';
                    } else if (!patch.attrName.startsWith('on')) {
                        el.removeAttribute(patch.attrName);
                    }
                }
                break;
        }
    });
}