import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
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
        exclude: [
            'node_modules/**',
            '**/*.{d.ts,js}',
        ],
        env: {
            JQUANTS_API_MAIL_ADDRESS: 'test@example.com',
            JQUANTS_API_PASSWORD: 'password',
        },
    },
});
