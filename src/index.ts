// src/index.ts - ТОЛЬКО реэкспорт из dist или локальные импорты

// Вариант 1: Импортируем напрямую из исходников (для сборки)
import { reactive as _reactive, ref as _ref, effect as _effect, computed as _computed } from '@syntjs/core';
import { createElement as _createElement, Fragment as _Fragment } from '@syntjs/jsx';
import { render as _render, createApp as _createApp } from '@syntjs/renderer';

// Реэкспортируем
export const reactive = _reactive;
export const ref = _ref;
export const effect = _effect;
export const computed = _computed;
export const createElement = _createElement;
export const Fragment = _Fragment;
export const render = _render;
export const createApp = _createApp;
export { useState, useStateSimple, useMemo } from '@syntjs/core';

// Version
export const version = '0.0.1-alpha.0';

// Default export
const SyntJS = {
    version,
    reactive: _reactive,
    ref: _ref,
    effect: _effect,
    computed: _computed,
    createElement: _createElement,
    Fragment: _Fragment,
    render: _render,
    createApp: _createApp,
};

export default SyntJS;