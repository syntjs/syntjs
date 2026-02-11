import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, createApp } from '../src';
import { createElement } from '@syntjs/jsx';

describe('SyntJS Renderer', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it('should render div element', () => {
        const vnode = createElement('div', { className: 'test' }, 'Hello');
        const result = render(vnode, container);

        expect(container.innerHTML).toBe('<div class="test">Hello</div>');
        result.unmount();
    });

    it('should handle multiple children', () => {
        const vnode = createElement('div', null,
            createElement('span', null, 'Hello'),
            createElement('span', null, 'World')
        );

        render(vnode, container);
        expect(container.querySelectorAll('span')).toHaveLength(2);
    });

    it('should handle event listeners', () => {
        const onClick = vi.fn();
        const vnode = createElement('button', { onClick }, 'Click me');

        render(vnode, container);
        container.querySelector('button')!.click();

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should handle style object', () => {
        const vnode = createElement('div', {
            style: { color: 'red', fontSize: '16px' }
        }, 'Styled');

        render(vnode, container);
        const div = container.querySelector('div')!;

        expect(div.style.color).toBe('red');
        expect(div.style.fontSize).toBe('16px');
    });

    it('should render function component', () => {
        const Hello = ({ name }: { name: string }) =>
            createElement('div', null, `Hello ${name}`);

        const vnode = createElement(Hello, { name: 'World' });
        render(vnode, container);

        expect(container.textContent).toBe('Hello World');
    });

    it('createApp should mount to container', () => {
        const App = () => createElement('div', null, 'App Content');

        const app = createApp(App);
        app.mount(container);

        expect(container.innerHTML).toBe('<div>App Content</div>');
    });

    it('should unmount properly', () => {
        const vnode = createElement('div', null, 'Content');
        const result = render(vnode, container);

        expect(container.innerHTML).toBe('<div>Content</div>');
        result.unmount();
        expect(container.innerHTML).toBe('');
    });

    it('should update with patch', () => {
        const vnode1 = createElement('div', { className: 'old' }, 'Old');
        const result = render(vnode1, container);

        expect(container.innerHTML).toBe('<div class="old">Old</div>');

        const vnode2 = createElement('div', { className: 'new' }, 'New');
        result.update(vnode2);

        expect(container.innerHTML).toBe('<div class="new">New</div>');
    });
});