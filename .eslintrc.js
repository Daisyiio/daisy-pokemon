/** .eslintrc.js
 * 在VSCode中安装ESLint插件，编写过程中检测代码质量
 * ESLint 代码质量校验相关配置
 * 这里使用prettier作为代码格式化工具，用ESLint做代码质检
 * 相关配置使用下面extends扩展先做默认设置
 * 在.prettierrc.js文件中配置好后，格式化规则会以.prettierrc.js作为最终格式，所以不建议在本文件中做代码格式化相关配置
 * 相关prettier配置ESLint会默认加载为代码质检 格式化以prettier为主
 * 在本配置文件中只做代码质量约束规范配置
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint-config-prettier",
    "eslint:recommended", // 使用推荐的eslint
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended", // 使用插件支持vue3
    "plugin:vue/vue3-essential",
    //1.继承.prettierrc.js文件规则  2.开启rules的 "prettier/prettier": "error"  3.eslint fix的同时执行prettier格式化
    "plugin:prettier/recommended",
    "@vue/eslint-config-prettier"
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    parser: "@typescript-eslint/parser",
  },
  plugins: [],
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
    WebControl: true,
  },
  rules: {
    "no-console": "off",
    "no-debugger": "off", //生产默认不允许使用debugger
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: ".*", args: "none" },
    ], //变量声明未使用
    "@typescript-eslint/no-explicit-any": "off", // 允许ts使用any
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto", // 换行cr检查
        arrowParens: "always",
        bracketSameLine: true,
        tabWidth: 2,
        "trailing-comma": "all",
        "print-width": 100,
      },
    ],
    "vue/multi-word-component-names": [
      "warn",
      {
        ignores: ["index"], //需要忽略的组件名
      },
    ],
  },
};
