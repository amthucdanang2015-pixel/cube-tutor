import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default defineConfig([
  ...compat.config({ extends: ["next/core-web-vitals", "next/typescript"] }),
  {
    rules: {
      // App Store and product-catalogue image URLs are dynamic third-party data.
      // Their layouts explicitly reserve dimensions and lazy-load below the fold.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "amplify/**",
  ]),
]);
