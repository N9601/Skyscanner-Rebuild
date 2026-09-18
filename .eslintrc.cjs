module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: ["eslint:recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
  ignorePatterns: ["dist", "node_modules"],
};
