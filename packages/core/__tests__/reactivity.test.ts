import { describe, it, expect, vi } from 'vitest';
import { reactive, effect, computed, ref, readonly } from '../src';

describe('SyntJS Reactivity System', () => {
    it('should make object reactive', () => {
        const obj = reactive({ count: 0 });
        let dummy;

        effect(() => {
            dummy = obj.count;
        });

        expect(dummy).toBe(0);
        obj.count = 1;
        expect(dummy).toBe(1);
    });

    it('computed should update when dependencies change', () => {
        const obj = reactive({ a: 1, b: 2 });
        const sum = computed(() => obj.a + obj.b);

        expect(sum.value).toBe(3);
        obj.a = 2;
        expect(sum.value).toBe(4);
    });

    it('should not trigger effect for unchanged values', () => {
        const obj = reactive({ count: 0 });
        const fn = vi.fn(() => obj.count);

        effect(fn);
        expect(fn).toHaveBeenCalledTimes(1);

        obj.count = 0; // Same value
        expect(fn).toHaveBeenCalledTimes(1); // Should not trigger again
    });

    it('ref should work with primitive values', () => {
        const count = ref(0);
        let dummy;

        effect(() => {
            dummy = count.value;
        });

        expect(dummy).toBe(0);
        count.value = 1;
        expect(dummy).toBe(1);
    });

    it('readonly should prevent modifications', () => {
        const original = reactive({ foo: 1 });
        const readOnly = readonly(original);

        expect(readOnly.foo).toBe(1);

        // Should warn but not throw
        console.warn = vi.fn();
        readOnly.foo = 2;
        expect(console.warn).toHaveBeenCalled();
        expect(readOnly.foo).toBe(1);
    });

    it('effect should return cleanup function', () => {
        const obj = reactive({ count: 0 });
        let dummy = 0;

        const cleanup = effect(() => {
            dummy = obj.count;
        });

        expect(dummy).toBe(0);
        obj.count = 1;
        expect(dummy).toBe(1);

        cleanup();
        obj.count = 2;
        expect(dummy).toBe(1); // Should not update after cleanup
    });

    it('should track multiple properties', () => {
        const obj = reactive({ a: 1, b: 2 });
        let sum = 0;

        effect(() => {
            sum = obj.a + obj.b;
        });

        expect(sum).toBe(3);
        obj.a = 2;
        expect(sum).toBe(4);
        obj.b = 3;
        expect(sum).toBe(5);
    });

    it('computed should be lazy', () => {
        const obj = reactive({ a: 1 });
        const getter = vi.fn(() => obj.a);
        const computedValue = computed(getter);

        // Getter shouldn't be called until accessed
        expect(getter).toHaveBeenCalledTimes(0);

        // First access
        expect(computedValue.value).toBe(1);
        expect(getter).toHaveBeenCalledTimes(1);

        // Access again - should use cached value
        expect(computedValue.value).toBe(1);
        expect(getter).toHaveBeenCalledTimes(1);

        // Change dependency - getter should be called on next access
        obj.a = 2;
        expect(getter).toHaveBeenCalledTimes(1);
        expect(computedValue.value).toBe(2);
        expect(getter).toHaveBeenCalledTimes(2);
    });
});