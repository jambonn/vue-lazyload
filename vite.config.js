import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'vue-lazyload',
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: /^vue/,
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
