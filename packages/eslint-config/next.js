/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: false,
  extends: ["./base.js"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@next/next/no-html-link-for-pages": "off",
  },
};
