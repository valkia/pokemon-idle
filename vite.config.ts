import path from 'path'
import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import { visualizer } from 'rollup-plugin-visualizer'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VitePWA } from 'vite-plugin-pwa'
import Inspect from 'vite-plugin-inspect'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/

export default defineConfig({
  resolve: {
    alias: {
      '~/': fileURLToPath(new URL('./src', import.meta.url)) + '/',
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@store': path.resolve(__dirname, 'src/store'),
      '~/enums': fileURLToPath(new URL('./src/enums', import.meta.url)),
    },
  },
  assetsInclude: [
    '**/*.yml',
    '**/*.svg',
    '**/*.png',
    '**/*.webp',
    '**/*.gif',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.ico'
  ],
  plugins: [
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true
    }),
    // https://github.com/vitejs/vite/tree/main/packages/plugin-vue
    Vue({
      script: {
        defineModel: true,
        propsDestructure: true
      },
      include: [/\.vue$/, /\.md$/]
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    // YAML loader
    {
      name: 'yaml-loader',
      transform(code, id) {
        if (!id.endsWith('.yml')) return
        return `export default ${JSON.stringify(code)}`
      },
    },

    // https://github.com/antfu/vite-plugin-inspect
    Inspect({
      // change this to enable inspect for debugging
      enabled: false,
    }),
  ],

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    format: 'esm',
    dirStyle: 'nested',
    onFinished() {
      process.exit(0)
    },
  },

  build: {
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1024,
    minify: 'terser',
    assetsDir: 'assets',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'vue-use': ['@vueuse/core', '@vueuse/head'],
          'utils': ['nprogress', 'zipson'],
          'i18n': ['vue-i18n']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp|ico)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.(ttf|woff|woff2|eot)$/.test(name ?? '')) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          if (/\.(mp3|wav|ogg)$/.test(name ?? '')) {
            return 'assets/audio/[name]-[hash][extname]' 
          }
          return 'assets/[ext]/[name]-[hash][extname]'
        }
      }
    }
  },

  server: {
    allowedHosts: true
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      '@vueuse/head',
      'pinia',
      'nprogress'
    ],
    exclude: [
      'vue-demi',
    ],
  },

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi'],
    },
  },
})
