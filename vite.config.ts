import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            exclude: [
                '**/__tests__/**',
                'bin/*',
                'cdk.out/*',
                '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
                '**/*{.,-}{test,spec,bench,benchmark}?(-d).?(c|m)[jt]s?(x)',
            ],
        },
        env: {
            JQUANTS_API_MAIL_ADDRESS: 'test@example.com',
            JQUANTS_API_PASSWORD: 'password',
        },
    },
});
