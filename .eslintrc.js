import { plugin } from "postcss";

export default {
  env: {
    browser: true,
    es2021: true,
    node: true, // 添加 node 环境支持
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential", // 或 vue3-recommended
    "plugin:vue/vue3-recommended", // 或其他适合的 vue 配置
    "prettier", // 确保 Prettier 配置与 ESLint 不冲突
    "plugin:prettier/recommended", // 开启 Prettier 支持
    "prettier",
  ],
  plugin: ["prettier"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },

  rules: {
    "prettier/prettier": "error", // 将 Prettier 的格式问题视为错误
    "vue/multi-word-component-names": "off", // 关闭多单词校验
    "vue/singleline-html-element-content-newline": [
      "error",
      {
        element: "always",
      },
    ],
    "vue/multiline-html-element-content-newline": [
      "error",
      {
        normalize: "always",
      },
    ],
  },
};
