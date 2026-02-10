import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    // Vite build config
    build: {
        lib: {
            entry: resolve(__dirname, 'packages/core/src/index.ts'),
            name: 'SyntJS',
            fileName: (format) => {
                if (format === 'es') return 'syntjs.esm.js';
                if (format === 'cjs') return 'syntjs.cjs.js';
                if (format === 'umd') return 'syntjs.umd.js';
                return `syntjs.${format}.js`;
            },
            formats: ['es', 'cjs', 'umd']
        },
        rollupOptions: {
            external: [],
            output: {
                globals: {},
                exports: 'named'
            }
        },
        sourcemap: true,
        minify: true
    },

    // Vitest test config
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['packages/**/*.{test,spec}.{js,ts}'],
        exclude: ['node_modules', 'dist'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['**/*.test.ts', '**/*.spec.ts']
        }
    },

    // Опционально: Vite dev server config
    server: {
        port: 3000
    }
});