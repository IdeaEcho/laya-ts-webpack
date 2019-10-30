# layabox-ts-webpack
LayaAir Typescript Webpack脚手架

由于layaAir编译器按F6编译运行，开发效率非常低，所以配置了webpack实现热更新，在代码模式修改代码保存后自动编译、自动刷新页面。

# Getting started

1.安装依赖
```
npm install
```

2.本地开发环境
```
npm run dev
```

3.打包

虽然编译器自带的打包时间比较久，一开始也想过用webpack来打包，但是由于发布项目可选择发布平台Web/Native、微信小游戏、百度小游戏、以及是否只拷贝index.js里引用的类库等多种定制化配置，用webpack反而有点凿隧入井了。所以先执行编译器的打包，再执行`npm run build`，用 webpack Copy 打包后的静态资源到生产环境的目录，以及生成ejs文件。也正是因为最终打包需要用到编译器原生的打包逻辑（页面只引入index.js，libs 以及 bundle.js 都由index.js动态创建script标签插入页面），所以webpack development环境的配置也和通常项目不太一样。


4.定制

webpack production配置了cdn地址的插槽，用于初始化Main.ts中的Laya.URL.basePath，不需要的话可以去掉。

# 最后
如有疑问，欢迎指出。
