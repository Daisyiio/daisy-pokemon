# Daisy Pokémon

Pokémon

采用 Vite + Vue3 + TypeScript 搭建的项目

## Remark

### 开发过程中的报错问题解决方式

"@types/node" ：引入后可以消除部分ts类型报错，以下为引入方式：

```sh
npm install --save-dev @types/node
yarn add --dev @types/node
```

如果还是有出现报错，例如**tsconfig.json**文件path路径问题报错，删除**node_modules**文件夹，重新安装依赖即可。

```sh
npm install
yarn install
```
