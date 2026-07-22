import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

const requiredPublicConfig = [
  "VITE_FORMSPREE_FORM_ID",
  "VITE_TURNSTILE_SITE_KEY",
] as const;

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  if (command === "build" && mode === "production") {
    const missing = requiredPublicConfig.filter((key) => !env[key]?.trim());
    if (missing.length > 0) {
      throw new Error(`Missing production configuration: ${missing.join(", ")}`);
    }
    if (
      process.env.CI &&
      (env.VITE_FORMSPREE_FORM_ID === "testformid" ||
        env.VITE_TURNSTILE_SITE_KEY === "1x00000000000000000000AA")
    ) {
      throw new Error("Production CI cannot deploy public contact test identifiers");
    }
  }

  return {
    base: "/",
    plugins: [react(), tailwindcss()],
    build: {
      sourcemap: false,
      assetsInlineLimit: 4096,
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
      restoreMocks: true,
      css: true,
      globals: true,
    },
  };
});
