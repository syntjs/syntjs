import type { ComponentInstance } from '../types/component';
import { mountVNode } from './render';
import { diff, patch } from '../vdom';

let currentInstance: ComponentInstance | null = null;
let instanceId = 0;

export function getCurrentInstance(): ComponentInstance | null {
    return currentInstance;
}

export function setCurrentInstance(instance: ComponentInstance | null): void {
    currentInstance = instance;
}

export function createComponentInstance(
    fn: Function,
    props: any = {}
): ComponentInstance {
    const id = ++instanceId;

    const instance: ComponentInstance = {
        id,
        fn,
        props,
        vnode: null,
        container: null,
        isMounted: false,

        _hooks: [],
        _hookIndex: 0,
        _pendingEffects: [],
        _isUpdating: false,

        update: function() {
            if (!this.container || this._isUpdating || !this.isMounted) return;

            this._isUpdating = true;
            const prevInstance = currentInstance;
            setCurrentInstance(this);
            this._hookIndex = 0;

            try {
                const newVNode = this.fn(this.props);

                if (!newVNode?.__isVNode) {
                    console.error('Component must return a VNode');
                    return;
                }

                if (this.vnode && this.container) {
                    const patches = diff(this.vnode, newVNode, [], 0, this.container);
                    patch(this.container, patches);

                    // 🔥🔥🔥 ЕДИНСТВЕННОЕ ПРАВИЛЬНОЕ РЕШЕНИЕ!
                    this.vnode = {...newVNode, ...this.vnode};

                } else {
                    this.container.innerHTML = '';
                    mountVNode(newVNode, this.container);
                    this.vnode = newVNode;
                }

                if (this._pendingEffects && this._pendingEffects.length > 0) {
                    this._pendingEffects.forEach(effect => effect());
                    this._pendingEffects = [];
                }

            } catch (error) {
                console.error('Update error:', error);
            } finally {
                this._isUpdating = false;
                setCurrentInstance(prevInstance);
            }
        },

        unmount: function() {
            if (this.container) {
                this.container.innerHTML = '';
                this.container = null;
            }
            this.isMounted = false;
            this._hooks = [];
            this._pendingEffects = [];
            this.vnode = null;
        }
    };

    return instance;
}

export function mountComponent(
    instance: ComponentInstance,
    container: HTMLElement | string
): void {
    const el = typeof container === 'string'
        ? document.querySelector(container)
        : container;

    if (!el) throw new Error(`Container not found: ${container}`);

    instance.container = el as HTMLElement;
    instance.isMounted = true;
    instance.update();
}