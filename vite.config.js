import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/spend-expense-management/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
