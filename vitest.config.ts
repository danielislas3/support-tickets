import { defineConfig, mergeConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import viteConfig from './vite.config'

export default defineConfig(
  mergeConfig(
    viteConfig,
    defineConfig({
      plugins: [
        react(),
        tailwindcss()
      ],
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/__tests__/setup.ts'],
        css: true,
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json', 'html'],
          exclude: [
            'node_modules/',
            'src/__tests__/',
            '**/*.d.ts',
            '**/*.config.*',
            '**/index.ts',
            '**/main.tsx',
          ],
        },
        // Match test files
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        // Exclude node_modules and build directories
        exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
        // TypeScript configuration for tests
        typecheck: {
          tsconfig: './tsconfig.test.json'
        }
      },
      resolve: {
        alias: {
          '@/app': path.resolve(__dirname, './src/app'),
          '@/features': path.resolve(__dirname, './src/features'),
          '@/shared': path.resolve(__dirname, './src/shared'),
        },
      },
    })
  )
)