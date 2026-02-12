import type { SyntVNode } from '@syntjs/core';
declare global {
    namespace JSX {
        interface Element extends SyntVNode {
        }
        interface IntrinsicElements {
            [elem: string]: any;
        }
        interface ElementAttributesProperty {
            props: {};
        }
        interface ElementChildrenAttribute {
            children: {};
        }
    }
}
