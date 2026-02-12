import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'SyntJS',
            formats: ['es', 'cjs', 'umd'],
            fileName: (format) => {
                if (format === 'es') return 'index.js';
                if (format === 'cjs') return 'index.cjs';
                return `syntjs.${format}.js`;
            }
        },
        rollupOptions: {
            external: [],
            output: {
                inlineDynamicImports: true,
                exports: 'named'
            }
        },
        sourcemap: true,
        emptyOutDir: true
    },
    resolve: {
        alias: {
            '@syntjs/core': resolve(__dirname, 'packages/core/src'),
            '@syntjs/jsx': resolve(__dirname, 'packages/jsx/src')
        }
    }
});