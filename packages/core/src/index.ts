// Сначала импортируем всё что нужно
import { reactive, ref, readonly, shallowReactive, effect } from './reactivity';
import { computed, lazyComputed } from './computed';
// Core reactivity exports
export { reactive, ref, readonly, shallowReactive } from './reactivity';
export { computed, lazyComputed } from './computed';
export { effect } from './reactivity';
export {createComponentInstance, mountComponent} from './component-system'


// React-like API for React developers
export { useState, useStateSimple, useMemo } from './hooks'; //

// Vue-like API for Vue developers (alias)
export { reactive as defineReactive };
export { ref as defineRef };
export { computed as defineComputed };

// Utility functions
export function isReactive(value: any): boolean {
    return value && typeof value === 'object' && '__v_isReactive' in value;
}

export function isRef(value: any): boolean {
    return value && typeof value === 'object' && 'value' in value;
}

// Batch updates for performance
let batchQueue: (() => void)[] = [];
let batchScheduled = false;

export function batch(callback: () => void): void {
    if (batchScheduled) {
        callback();
        return;
    }

    batchScheduled = true;
    batchQueue.push(callback);

    Promise.resolve().then(() => {
        const queue = batchQueue;
        batchQueue = [];
        batchScheduled = false;

        queue.forEach(fn => fn());
    });
}