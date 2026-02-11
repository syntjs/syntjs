// JSX types for SyntJS

// Virtual DOM Node
export interface SyntVNode {
    type: string | Function | symbol;
    props: Record<string, any>;
    children: SyntVNode[];
    el?: HTMLElement | Text;
    key?: string | number;
    __isVNode: true;
}

// JSX Element (what users create)
export type SyntJSXElement = SyntVNode;

// Fragment support
export const Fragment: unique symbol = Symbol('Fragment');

// Intrinsic elements types (HTML tags)
export interface SyntIntrinsicElements {
    // HTML elements
    div: {
        className?: string;
        id?: string;
        children?: any;
        style?: Record<string, string>;
        onClick?: (event: MouseEvent) => void;
        [key: string]: any;
    };

    span: {
        className?: string;
        children?: any;
        [key: string]: any;
    };

    button: {
        onClick?: (event: MouseEvent) => void;
        disabled?: boolean;
        children?: any;
        className?: string;
        [key: string]: any;
    };

    input: {
        type?: string;
        value?: string;
        onChange?: (event: Event) => void;
        placeholder?: string;
        [key: string]: any;
    };

    a: {
        href?: string;
        target?: string;
        children?: any;
        [key: string]: any;
    };

    // Add more as needed...
    [elemName: string]: {
        children?: any;
        [key: string]: any;
    };
}

// For TypeScript JSX support
declare global {
    namespace JSX {
        // This is required to differenciate from React's JSX
        interface Element extends SyntJSXElement {}

        interface ElementClass {
            __isSyntComponent?: boolean;
        }

        interface ElementAttributesProperty {
            props: {};
        }

        interface ElementChildrenAttribute {
            children: {};
        }

        // Intrinsic elements - we need to list them explicitly
        interface IntrinsicElements {
            // HTML
            div: {
                className?: string;
                id?: string;
                style?: Record<string, string> | string;
                children?: any;
                onClick?: (event: MouseEvent) => void;
                [key: string]: any;
            };

            span: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            button: {
                onClick?: (event: MouseEvent) => void;
                disabled?: boolean;
                type?: 'button' | 'submit' | 'reset';
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            input: {
                type?: string;
                value?: string;
                onChange?: (event: Event) => void;
                placeholder?: string;
                className?: string;
                style?: Record<string, string> | string;
                [key: string]: any;
            };

            a: {
                href?: string;
                target?: string;
                rel?: string;
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            ul: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            li: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            p: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            h1: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            h2: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            h3: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            form: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            label: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            select: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            option: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            textarea: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            img: {
                src?: string;
                alt?: string;
                className?: string;
                style?: Record<string, string> | string;
                [key: string]: any;
            };

            // SVG (basic)
            svg: {
                className?: string;
                style?: Record<string, string> | string;
                children?: any;
                [key: string]: any;
            };

            path: {
                d?: string;
                className?: string;
                style?: Record<string, string> | string;
                [key: string]: any;
            };

            circle: {
                cx?: number;
                cy?: number;
                r?: number;
                className?: string;
                style?: Record<string, string> | string;
                [key: string]: any;
            };

            // Generic fallback for any HTML element
            [elemName: string]: {
                children?: any;
                className?: string;
                style?: Record<string, string> | string;
                [key: string]: any;
            };
        }

        interface IntrinsicAttributes {
            key?: string | number;
            ref?: any;
        }
    }
}

// Helper type for component props
export type PropsWithChildren<P = {}> = P & { children?: any };