import { defineConfig } from "vite";

export default defineConfig({
    root: "static",
    build: {
        outDir: "../dist",
        emptyOutDir: true
    },
    server: {
        port: 4444,
        strictPort: true
    },
    preview: {
        port: 4444,
        strictPort: true
    }
});
