import type { ComponentInstance } from '../types/component';
export declare function getCurrentInstance(): ComponentInstance | null;
export declare function setCurrentInstance(instance: ComponentInstance | null): void;
export declare function createComponentInstance(fn: Function, props?: any): ComponentInstance;
export declare function mountComponent(instance: ComponentInstance, container: HTMLElement | string): void;
