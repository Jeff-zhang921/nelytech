import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTypeScript from "eslint-config-next/typescript.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...compat.config(nextVitals),
  ...compat.config(nextTypeScript),
];

export default eslintConfig;
