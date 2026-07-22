import presetsTypescript from "@cybozu/eslint-config/flat/presets/typescript.js";
import presetsPrettier from "@cybozu/eslint-config/flat/presets/prettier.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...presetsTypescript,
  {
    ignores: ["**/*.d.ts"],
    languageOptions: {
      globals: {
        kintone: "readonly",
      },
    },
  },
  ...presetsPrettier,
];
