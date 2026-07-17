import path from 'node:path';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    test: {
        environment: 'happy-dom',
        globals: true,
        include: ['tests/javascript/**/*.{test,spec}.{ts,tsx}'],
    },
});
