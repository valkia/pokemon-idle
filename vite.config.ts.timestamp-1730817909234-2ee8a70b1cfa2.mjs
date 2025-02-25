// vite.config.ts
import path from "path";
import { defineConfig } from "file:///C:/Users/du/IdeaProjects/pokemon-idle/node_modules/vite/dist/node/index.ts";
import Vue from "file:///C:/Users/du/IdeaProjects/pokemon-idle/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///C:/Users/du/IdeaProjects/pokemon-idle/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///C:/Users/du/IdeaProjects/pokemon-idle/node_modules/unplugin-auto-import/dist/vite.js";
import Unocss from "file:///C:/Users/du/IdeaProjects/pokemon-idle/node_modules/unocss/dist/vite.mjs";
import VueMacros from "file:///C:/Users/du/IdeaProjects/pokemon-idle/node_modules/unplugin-vue-macros/dist/vite.js";
import VueRouter from "file:///C:/Users/du/IdeaProjects/pokemon-idle/node_modules/unplugin-vue-router/dist/vite.js";
var __vite_injected_original_dirname = "C:\\Users\\du\\IdeaProjects\\pokemon-idle";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__vite_injected_original_dirname, "src")}/`,
      "~/enums": `${path.resolve(__vite_injected_original_dirname, "src")}/enums`
    }
  },
  plugins: [
    VueMacros({
      defineOptions: false,
      defineModels: false,
      plugins: {
        vue: Vue({
          script: {
            propsDestructure: true,
            defineModel: true
          }
        })
      }
    }),
    // https://github.com/posva/unplugin-vue-router
    VueRouter(),
    Vue({
      include: [/\.vue$/, /\.md$/]
    }),
    // https://github.com/antfu/unplugin-auto-import
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
    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue", "md"],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: "src/components.d.ts"
    }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss()
    // https://github.com/antfu/vite-plugin-md
    // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
  ],
  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "@vueuse/core",
      "@vueuse/head"
    ],
    exclude: [
      "vue-demi"
    ]
  },
  // https://github.com/vitest-dev/vitest
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkdVxcXFxJZGVhUHJvamVjdHNcXFxccG9rZW1vbi1pZGxlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkdVxcXFxJZGVhUHJvamVjdHNcXFxccG9rZW1vbi1pZGxlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9kdS9JZGVhUHJvamVjdHMvcG9rZW1vbi1pZGxlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgVnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSdcbmltcG9ydCBWdWVNYWNyb3MgZnJvbSAndW5wbHVnaW4tdnVlLW1hY3Jvcy92aXRlJ1xuaW1wb3J0IFZ1ZVJvdXRlciBmcm9tICd1bnBsdWdpbi12dWUtcm91dGVyL3ZpdGUnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ34vJzogYCR7cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpfS9gLFxuICAgICAgJ34vZW51bXMnOiBgJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyl9L2VudW1zYCxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgVnVlTWFjcm9zKHtcbiAgICAgIGRlZmluZU9wdGlvbnM6IGZhbHNlLFxuICAgICAgZGVmaW5lTW9kZWxzOiBmYWxzZSxcbiAgICAgIHBsdWdpbnM6IHtcbiAgICAgICAgdnVlOiBWdWUoe1xuICAgICAgICAgIHNjcmlwdDoge1xuICAgICAgICAgICAgcHJvcHNEZXN0cnVjdHVyZTogdHJ1ZSxcbiAgICAgICAgICAgIGRlZmluZU1vZGVsOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcG9zdmEvdW5wbHVnaW4tdnVlLXJvdXRlclxuICAgIFZ1ZVJvdXRlcigpLFxuICAgIFZ1ZSh7XG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwubWQkL10sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tYXV0by1pbXBvcnRcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgJ3Z1ZScsXG4gICAgICAgICd2dWUtcm91dGVyJyxcbiAgICAgICAgJ3Z1ZS1pMThuJyxcbiAgICAgICAgJ0B2dWV1c2UvaGVhZCcsXG4gICAgICAgICdAdnVldXNlL2NvcmUnLFxuICAgICAgXSxcbiAgICAgIGR0czogJ3NyYy9hdXRvLWltcG9ydHMuZC50cycsXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIC8vIGFsbG93IGF1dG8gbG9hZCBtYXJrZG93biBjb21wb25lbnRzIHVuZGVyIGAuL3NyYy9jb21wb25lbnRzL2BcbiAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywgJ21kJ10sXG4gICAgICAvLyBhbGxvdyBhdXRvIGltcG9ydCBhbmQgcmVnaXN0ZXIgY29tcG9uZW50cyB1c2VkIGluIG1hcmtkb3duXG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kJC9dLFxuICAgICAgZHRzOiAnc3JjL2NvbXBvbmVudHMuZC50cycsXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5vY3NzXG4gICAgLy8gc2VlIHVub2Nzcy5jb25maWcudHMgZm9yIGNvbmZpZ1xuICAgIFVub2NzcygpLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3ZpdGUtcGx1Z2luLW1kXG4gICAgLy8gRG9uJ3QgbmVlZCB0aGlzPyBUcnkgdml0ZXNzZS1saXRlOiBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZXNzZS1saXRlXG5cbiAgXSxcblxuXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcbiAgICAgICd2dWUnLFxuICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgJ0B2dWV1c2UvY29yZScsXG4gICAgICAnQHZ1ZXVzZS9oZWFkJyxcbiAgICBdLFxuICAgIGV4Y2x1ZGU6IFtcbiAgICAgICd2dWUtZGVtaScsXG4gICAgXSxcbiAgfSxcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZXN0LWRldi92aXRlc3RcbiAgdGVzdDoge1xuICAgIGluY2x1ZGU6IFsndGVzdC8qKi8qLnRlc3QudHMnXSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBkZXBzOiB7XG4gICAgICBpbmxpbmU6IFsnQHZ1ZScsICdAdnVldXNlJywgJ3Z1ZS1kZW1pJ10sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJTLE9BQU8sVUFBVTtBQUM1VCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZUFBZTtBQUN0QixPQUFPLGVBQWU7QUFQdEIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsTUFBTSxHQUFHLEtBQUssUUFBUSxrQ0FBVyxLQUFLLENBQUM7QUFBQSxNQUN2QyxXQUFXLEdBQUcsS0FBSyxRQUFRLGtDQUFXLEtBQUssQ0FBQztBQUFBLElBQzlDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsVUFBVTtBQUFBLE1BQ1IsZUFBZTtBQUFBLE1BQ2YsY0FBYztBQUFBLE1BQ2QsU0FBUztBQUFBLFFBQ1AsS0FBSyxJQUFJO0FBQUEsVUFDUCxRQUFRO0FBQUEsWUFDTixrQkFBa0I7QUFBQSxZQUNsQixhQUFhO0FBQUEsVUFDZjtBQUFBLFFBQ0YsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLENBQUM7QUFBQTtBQUFBLElBRUQsVUFBVTtBQUFBLElBQ1YsSUFBSTtBQUFBLE1BQ0YsU0FBUyxDQUFDLFVBQVUsT0FBTztBQUFBLElBQzdCLENBQUM7QUFBQTtBQUFBLElBR0QsV0FBVztBQUFBLE1BQ1QsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBO0FBQUEsSUFHRCxXQUFXO0FBQUE7QUFBQSxNQUVULFlBQVksQ0FBQyxPQUFPLElBQUk7QUFBQTtBQUFBLE1BRXhCLFNBQVMsQ0FBQyxVQUFVLGNBQWMsT0FBTztBQUFBLE1BQ3pDLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQTtBQUFBO0FBQUEsSUFJRCxPQUFPO0FBQUE7QUFBQTtBQUFBLEVBS1Q7QUFBQSxFQUdBLGNBQWM7QUFBQSxJQUNaLFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1A7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFHQSxNQUFNO0FBQUEsSUFDSixTQUFTLENBQUMsbUJBQW1CO0FBQUEsSUFDN0IsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLE1BQ0osUUFBUSxDQUFDLFFBQVEsV0FBVyxVQUFVO0FBQUEsSUFDeEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
