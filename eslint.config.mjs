import presetsRecommended from "@cybozu/eslint-config/flat/presets/typescript-recommended.js";
import presetsPrettier from "@cybozu/eslint-config/flat/presets/prettier.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...presetsRecommended,
  {
    languageOptions: {
      globals: {
        kintone: "readonly",
      },
    },
  },
  ...presetsPrettier,
];
