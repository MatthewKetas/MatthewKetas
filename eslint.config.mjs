import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "graphify-out/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
      ".agents/**",
      ".claude/**",
      ".codex/**",
      ".impeccable/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default config;
