import { describe, it, expect } from 'vitest';
import { jsx, jsxs, createElement, Fragment, h } from '../src';

describe('SyntJS JSX Runtime', () => {
    it('should create element with tag name', () => {
        const vnode = jsx('div', { className: 'test' });

        expect(vnode.type).toBe('div');
        expect(vnode.props.className).toBe('test');
        expect(vnode.children).toEqual([]);
        expect(vnode.__isVNode).toBe(true);
    });

    it('should handle children', () => {
        const vnode = jsx('div', { children: 'Hello' });
        expect(vnode.children).toHaveLength(1);
        expect(vnode.children[0].type).toBe('TEXT_ELEMENT');
        expect(vnode.children[0].props.nodeValue).toBe('Hello');
    });

    it('should normalize text children', () => {
        const vnode = createElement('div', null, 'Hello', ' ', 'World');

        expect(vnode.children).toHaveLength(3);
        expect(vnode.children[0].props.nodeValue).toBe('Hello');
        expect(vnode.children[1].props.nodeValue).toBe(' ');
        expect(vnode.children[2].props.nodeValue).toBe('World');
    });

    it('should handle nested elements', () => {
        const vnode = createElement('div', null,
            createElement('span', null, 'Hello'),
            createElement('span', null, 'World')
        );

        expect(vnode.children).toHaveLength(2);
        expect(vnode.children[0].type).toBe('span');
        expect(vnode.children[1].type).toBe('span');
    });

    it('should support Fragment', () => {
        const vnode = jsx(Fragment, { children: ['a', 'b'] });

        expect(vnode.type).toBe(Fragment);
        expect(vnode.children).toHaveLength(2);
    });

    it('should handle numeric children', () => {
        const vnode = createElement('div', null, 42);

        expect(vnode.children[0].props.nodeValue).toBe('42');
    });

    it('should filter out null/undefined children', () => {
        const vnode = createElement('div', null, 'Hello', null, 'World', undefined);

        expect(vnode.children).toHaveLength(2);
        expect(vnode.children[0].props.nodeValue).toBe('Hello');
        expect(vnode.children[1].props.nodeValue).toBe('World');
    });

    it('h helper should work like createElement', () => {
        const vnode1 = createElement('div', { id: 'test' }, 'Hello');
        const vnode2 = h('div', { id: 'test' }, 'Hello');

        expect(vnode1.type).toBe(vnode2.type);
        expect(vnode1.props.id).toBe(vnode2.props.id);
        expect(vnode1.children[0].props.nodeValue).toBe(vnode2.children[0].props.nodeValue);
    });

    it('should support key prop', () => {
        const vnode = jsx('div', { key: 'unique-key' });
        expect(vnode.key).toBe('unique-key');
    });
});