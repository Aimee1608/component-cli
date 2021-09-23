# 安装

## npm 安装
推荐使用 `npm` 的方式安装

```bash
npm i component-cli -g
```

## 使用
项目初始化
```
component-cli init
```

```
npm run build
```

如果在不发布组件包的情况下，查看生成的dist,es,lib目录，可执行命令：

```
component-cli build --link links
```

## 问题
1 在npm link调试的时候，出现eslint的报错
Module Warning (from ./node_modules/eslint-loader/index.js):
error: Parsing error: The keyword 'const' is reserved 
解决方法： 在项目中配置.eslintignore文件 输出真实的包地址即可