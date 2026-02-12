import {track, trigger} from './core'
export { effect, track, trigger } from './core';
export { ref, isRef } from './ref';

// Create reactive object
export function reactive<T extends object>(target: T): T {
    return new Proxy(target, {
        get(target, key, receiver) {
            track(target, key);
            return Reflect.get(target, key, receiver);
        },
        set(target, key, value, receiver) {
            const oldValue = Reflect.get(target, key, receiver);
            const result = Reflect.set(target, key, value, receiver);
            if (oldValue !== value) {
                trigger(target, key);
            }
            return result;
        },
        deleteProperty(target, key) {
            const hadKey = Reflect.has(target, key);
            const result = Reflect.deleteProperty(target, key);
            if (hadKey && result) {
                trigger(target, key);
            }
            return result;
        }
    });
}