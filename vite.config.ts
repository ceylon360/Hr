import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

const conditionalPlugins: [string, Record<string, any>][] = [];

// @ts-ignore
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    include: ["@clerk/clerk-react"],
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore certain warnings
        if (warning.code === "CIRCULAR_DEPENDENCY") return;
        if (warning.code === "EVAL") return;
        warn(warning);
      },
    },
    minify: true,
  },
  base: "/",
  plugins: [
    react({
      plugins: conditionalPlugins,
    }),
    tempo(),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
  },
  server: {
    // @ts-ignore
    allowedHosts: true,
  },
  define: {
    __PERFORMANCE_MONITORING__: false,
    __SENTRY_DEBUG__: false,
    __RRWEB_RECORDING__: false,
  },
});
