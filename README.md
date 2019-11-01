# layabox-ts-webpack
LayaAir Typescript Webpack 脚手架

由于 layaAir 编译器按F6编译运行，开发效率非常低，所以配置了 webpack 实现热更新，在代码模式修改代码保存后自动编译、自动刷新页面。

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

虽然编译器自带的打包时间比较久，一开始也想过用 webpack 来打包，但是由于发布项目可选择发布平台 Web/Native 、微信小游戏、百度小游戏、以及是否只拷贝 index.js 里引用的类库等多种定制化配置，用 webpack 反而有点凿隧入井了。

所以build的流程是：先执行编译器的打包，再执行`npm run build`。

npm run build主要的作用是用 webpack Copy 打包后的静态资源到生产环境的目录，以及生成ejs文件，不需要的话，可以省去这个操作。

也正是因为最终打包需要用到编译器原生的打包逻辑（页面只引入index.js，libs 以及 bundle.js 都由index.js动态创建script标签插入页面），所以webpack development环境的配置也和通常项目不太一样。


4.定制
- webpack production 配置了cdn地址的插槽，用于初始化 Main.ts 中的 Laya.URL.basePath，不需要的话可以去掉。
- webpack production `clean-webpack-plugin` 配置了 `dangerouslyAllowCleanPatternsOutsideProject: true,`，由于从 `clean-webpack-plugin` 2.0.0 开始去掉了root配置，root取output参数的值，clean插件删除不在webpack工作目录下的文件都会报 `operation not permitted`，所以如果你的 output 配置是在webpack工作目录下，就不需要配置这个参数。

# 最后
如有疑问，欢迎指教。
