/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: false,
  extends: ["./base.js"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
