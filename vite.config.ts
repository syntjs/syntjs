import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'SyntJS',
            fileName: (format) => {
                if (format === 'es') return 'index.js';
                if (format === 'cjs') return 'index.cjs';
                return `syntjs.${format}.js`;
            },
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            // КРИТИЧЕСКИ ВАЖНО: Убираем ВСЕ external
            // Пусть Rollup включает всё в бандл
            external: [],
            output: {
                // Это заставляет Rollup включать все импорты в один файл
                inlineDynamicImports: true,
                globals: {},
                exports: 'named'
            }
        },
        // Увеличим лимит для больших бандлов
        chunkSizeWarningLimit: 1000
    },
    test: {
        globals: true,
        environment: 'jsdom'
    },

    // Настраиваем alias чтобы TypeScript и Vite находили файлы
    resolve: {
        alias: {
            '@syntjs/core': resolve(__dirname, 'packages/core/src'),
            '@syntjs/jsx': resolve(__dirname, 'packages/jsx/src'),
            '@syntjs/renderer': resolve(__dirname, 'packages/renderer/src')
        }
    }
});