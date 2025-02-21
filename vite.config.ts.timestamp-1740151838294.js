// vite.config.ts
import path from "path";
import { fileURLToPath, URL } from "node:url";
import process from "node:process";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import { visualizer } from "rollup-plugin-visualizer";
import Layouts from "vite-plugin-vue-layouts";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import Inspect from "vite-plugin-inspect";
import Unocss from "unocss/vite";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "~/": fileURLToPath(new URL("./src", "file:///home/runner/app/vite.config.ts")) + "/",
      "@": path.resolve("/home/runner/app", "src"),
      "@assets": path.resolve("/home/runner/app", "src/assets"),
      "@components": path.resolve("/home/runner/app", "src/components"),
      "@store": path.resolve("/home/runner/app", "src/store"),
      "~/enums": fileURLToPath(new URL("./src/enums", "file:///home/runner/app/vite.config.ts"))
    }
  },
  assetsInclude: [
    "**/*.yml",
    "**/*.svg",
    "**/*.png",
    "**/*.webp",
    "**/*.gif",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.ico"
  ],
  plugins: [
    visualizer({
      open: true,
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true
    }),
    Vue({
      script: {
        defineModel: true,
        propsDestructure: true
      },
      include: [/\.vue$/, /\.md$/]
    }),
    Pages({
      extensions: ["vue", "md"]
    }),
    Layouts(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/head",
        "@vueuse/core"
      ],
      dts: "src/auto-imports.d.ts"
    }),
    Components({
      extensions: ["vue", "md"],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: "src/components.d.ts"
    }),
    Unocss(),
    {
      name: "yaml-loader",
      transform(code, id) {
        if (!id.endsWith(".yml"))
          return;
        return `export default ${JSON.stringify(code)}`;
      }
    },
    Inspect({
      enabled: false
    })
  ],
  ssgOptions: {
    script: "async",
    formatting: "minify",
    format: "esm",
    dirStyle: "nested",
    onFinished() {
      process.exit(0);
    }
  },
  build: {
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1024,
    minify: "terser",
    assetsDir: "assets",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor": ["vue", "vue-router", "pinia"],
          "vue-use": ["@vueuse/core", "@vueuse/head"],
          "utils": ["nprogress", "zipson"],
          "i18n": ["vue-i18n"]
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp|ico)$/.test(name ?? "")) {
            return "assets/images/[name]-[hash][extname]";
          }
          if (/\.(ttf|woff|woff2|eot)$/.test(name ?? "")) {
            return "assets/fonts/[name]-[hash][extname]";
          }
          if (/\.(mp3|wav|ogg)$/.test(name ?? "")) {
            return "assets/audio/[name]-[hash][extname]";
          }
          return "assets/[ext]/[name]-[hash][extname]";
        }
      }
    }
  },
  server: {
    allowedHosts: true
  },
  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "@vueuse/core",
      "@vueuse/head",
      "pinia",
      "nprogress"
    ],
    exclude: [
      "vue-demi"
    ]
  },
  test: {
    include: ["test/**/*.test.ts"],
    environment: "jsdom",
    deps: {
      inline: ["@vue", "@vueuse", "vue-demi"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCBwcm9jZXNzIGZyb20gJ25vZGU6cHJvY2VzcydcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgVnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBQYWdlcyBmcm9tICd2aXRlLXBsdWdpbi1wYWdlcydcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXG5pbXBvcnQgTGF5b3V0cyBmcm9tICd2aXRlLXBsdWdpbi12dWUtbGF5b3V0cydcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcbmltcG9ydCBJbnNwZWN0IGZyb20gJ3ZpdGUtcGx1Z2luLWluc3BlY3QnXG5pbXBvcnQgVW5vY3NzIGZyb20gJ3Vub2Nzcy92aXRlJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICd+Lyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBcImZpbGU6Ly8vaG9tZS9ydW5uZXIvYXBwL3ZpdGUuY29uZmlnLnRzXCIpKSArICcvJyxcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKFwiL2hvbWUvcnVubmVyL2FwcFwiLCAnc3JjJyksXG4gICAgICAnQGFzc2V0cyc6IHBhdGgucmVzb2x2ZShcIi9ob21lL3J1bm5lci9hcHBcIiwgJ3NyYy9hc3NldHMnKSxcbiAgICAgICdAY29tcG9uZW50cyc6IHBhdGgucmVzb2x2ZShcIi9ob21lL3J1bm5lci9hcHBcIiwgJ3NyYy9jb21wb25lbnRzJyksXG4gICAgICAnQHN0b3JlJzogcGF0aC5yZXNvbHZlKFwiL2hvbWUvcnVubmVyL2FwcFwiLCAnc3JjL3N0b3JlJyksXG4gICAgICAnfi9lbnVtcyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvZW51bXMnLCBcImZpbGU6Ly8vaG9tZS9ydW5uZXIvYXBwL3ZpdGUuY29uZmlnLnRzXCIpKSxcbiAgICB9LFxuICB9LFxuICBhc3NldHNJbmNsdWRlOiBbXG4gICAgJyoqLyoueW1sJyxcbiAgICAnKiovKi5zdmcnLFxuICAgICcqKi8qLnBuZycsXG4gICAgJyoqLyoud2VicCcsXG4gICAgJyoqLyouZ2lmJyxcbiAgICAnKiovKi5qcGcnLFxuICAgICcqKi8qLmpwZWcnLFxuICAgICcqKi8qLmljbydcbiAgXSxcbiAgcGx1Z2luczogW1xuICAgIHZpc3VhbGl6ZXIoe1xuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIGZpbGVuYW1lOiAnZGlzdC9zdGF0cy5odG1sJyxcbiAgICAgIGd6aXBTaXplOiB0cnVlLFxuICAgICAgYnJvdGxpU2l6ZTogdHJ1ZVxuICAgIH0pLFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92aXRlanMvdml0ZS90cmVlL21haW4vcGFja2FnZXMvcGx1Z2luLXZ1ZVxuICAgIFZ1ZSh7XG4gICAgICBzY3JpcHQ6IHtcbiAgICAgICAgZGVmaW5lTW9kZWw6IHRydWUsXG4gICAgICAgIHByb3BzRGVzdHJ1Y3R1cmU6IHRydWVcbiAgICAgIH0sXG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwubWQkL11cbiAgICB9KSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9oYW5ub2VydS92aXRlLXBsdWdpbi1wYWdlc1xuICAgIFBhZ2VzKHtcbiAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywgJ21kJ10sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vSm9obkNhbXBpb25Kci92aXRlLXBsdWdpbi12dWUtbGF5b3V0c1xuICAgIExheW91dHMoKSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1hdXRvLWltcG9ydFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW1wb3J0czogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAndnVlLWkxOG4nLFxuICAgICAgICAnQHZ1ZXVzZS9oZWFkJyxcbiAgICAgICAgJ0B2dWV1c2UvY29yZScsXG4gICAgICBdLFxuICAgICAgZHRzOiAnc3JjL2F1dG8taW1wb3J0cy5kLnRzJyxcbiAgICB9KSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi12dWUtY29tcG9uZW50c1xuICAgIENvbXBvbmVudHMoe1xuICAgICAgLy8gYWxsb3cgYXV0byBsb2FkIG1hcmtkb3duIGNvbXBvbmVudHMgdW5kZXIgYC4vc3JjL2NvbXBvbmVudHMvYFxuICAgICAgZXh0ZW5zaW9uczogWyd2dWUnLCAnbWQnXSxcbiAgICAgIC8vIGFsbG93IGF1dG8gaW1wb3J0IGFuZCByZWdpc3RlciBjb21wb25lbnRzIHVzZWQgaW4gbWFya2Rvd25cbiAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXG4gICAgICBkdHM6ICdzcmMvY29tcG9uZW50cy5kLnRzJyxcbiAgICB9KSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bm9jc3NcbiAgICAvLyBzZWUgdW5vY3NzLmNvbmZpZy50cyBmb3IgY29uZmlnXG4gICAgVW5vY3NzKCksXG5cbiAgICAvLyBZQU1MIGxvYWRlclxuICAgIHtcbiAgICAgIG5hbWU6ICd5YW1sLWxvYWRlcicsXG4gICAgICB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcbiAgICAgICAgaWYgKCFpZC5lbmRzV2l0aCgnLnltbCcpKSByZXR1cm5cbiAgICAgICAgcmV0dXJuIGBleHBvcnQgZGVmYXVsdCAke0pTT04uc3RyaW5naWZ5KGNvZGUpfWBcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS92aXRlLXBsdWdpbi1pbnNwZWN0XG4gICAgSW5zcGVjdCh7XG4gICAgICAvLyBjaGFuZ2UgdGhpcyB0byBlbmFibGUgaW5zcGVjdCBmb3IgZGVidWdnaW5nXG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICB9KSxcbiAgXSxcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1zc2dcbiAgc3NnT3B0aW9uczoge1xuICAgIHNjcmlwdDogJ2FzeW5jJyxcbiAgICBmb3JtYXR0aW5nOiAnbWluaWZ5JyxcbiAgICBmb3JtYXQ6ICdlc20nLFxuICAgIGRpclN0eWxlOiAnbmVzdGVkJyxcbiAgICBvbkZpbmlzaGVkKCkge1xuICAgICAgcHJvY2Vzcy5leGl0KDApXG4gICAgfSxcbiAgfSxcblxuICBidWlsZDoge1xuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDI0LFxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJyxcbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBjb21wcmVzczoge1xuICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWVcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAndmVuZG9yJzogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYSddLFxuICAgICAgICAgICd2dWUtdXNlJzogWydAdnVldXNlL2NvcmUnLCAnQHZ1ZXVzZS9oZWFkJ10sXG4gICAgICAgICAgJ3V0aWxzJzogWyducHJvZ3Jlc3MnLCAnemlwc29uJ10sXG4gICAgICAgICAgJ2kxOG4nOiBbJ3Z1ZS1pMThuJ11cbiAgICAgICAgfSxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogKHsgbmFtZSB9KSA9PiB7XG4gICAgICAgICAgaWYgKC9cXC4oZ2lmfGpwZT9nfHBuZ3xzdmd8d2VicHxpY28pJC8udGVzdChuYW1lID8/ICcnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdhc3NldHMvaW1hZ2VzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV0nXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgvXFwuKHR0Znx3b2ZmfHdvZmYyfGVvdCkkLy50ZXN0KG5hbWUgPz8gJycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Fzc2V0cy9mb250cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoL1xcLihtcDN8d2F2fG9nZykkLy50ZXN0KG5hbWUgPz8gJycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Fzc2V0cy9hdWRpby9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJyBcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdhc3NldHMvW2V4dF0vW25hbWVdLVtoYXNoXVtleHRuYW1lXSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBzZXJ2ZXI6IHtcbiAgICBhbGxvd2VkSG9zdHM6IHRydWVcbiAgfSxcblxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXG4gICAgICAndnVlJyxcbiAgICAgICd2dWUtcm91dGVyJyxcbiAgICAgICdAdnVldXNlL2NvcmUnLFxuICAgICAgJ0B2dWV1c2UvaGVhZCcsXG4gICAgICAncGluaWEnLFxuICAgICAgJ25wcm9ncmVzcydcbiAgICBdLFxuICAgIGV4Y2x1ZGU6IFtcbiAgICAgICd2dWUtZGVtaScsXG4gICAgXSxcbiAgfSxcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZXN0LWRldi92aXRlc3RcbiAgdGVzdDoge1xuICAgIGluY2x1ZGU6IFsndGVzdC8qKi8qLnRlc3QudHMnXSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBkZXBzOiB7XG4gICAgICBpbmxpbmU6IFsnQHZ1ZScsICdAdnVldXNlJywgJ3Z1ZS1kZW1pJ10sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZUFBZSxXQUFXO0FBQ25DLE9BQU8sYUFBYTtBQUNwQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsa0JBQWtCO0FBQzNCLE9BQU8sYUFBYTtBQUNwQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUV2QixPQUFPLGFBQWE7QUFDcEIsT0FBTyxZQUFZO0FBSW5CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLE1BQU0sY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBd0MsQ0FBQyxJQUFJO0FBQUEsTUFDbEYsS0FBSyxLQUFLLFFBQVEsb0JBQW9CLEtBQUs7QUFBQSxNQUMzQyxXQUFXLEtBQUssUUFBUSxvQkFBb0IsWUFBWTtBQUFBLE1BQ3hELGVBQWUsS0FBSyxRQUFRLG9CQUFvQixnQkFBZ0I7QUFBQSxNQUNoRSxVQUFVLEtBQUssUUFBUSxvQkFBb0IsV0FBVztBQUFBLE1BQ3RELFdBQVcsY0FBYyxJQUFJLElBQUksZUFBZSx3Q0FBd0MsQ0FBQztBQUFBLElBQzNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsZUFBZTtBQUFBLElBQ2I7QUFB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
