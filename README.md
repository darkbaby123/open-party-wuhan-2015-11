# Impressive Ionic for Hybrid App

Open Party Wuhan 2015-11 的演讲, 使用 Markdown 和 Reveal.js 制作

## Agenda

移动互联网的崛起，使 app 开发成了很多公司的必备技能。其中 hybrid app 以更快的迭代优势，更灵活的 UI 组织，和更低的开发成本受到越来越多开发者的关注。而 Ionic 则是构建 hybrid app 的主流选择之一。本次演讲以 Cordova + Ionic 为主题，分享如何构建一个真正的 Ionic app，包括项目组织，build 工具，调试，自定义插件，和开发中的一些最佳实践。

## 运行

```bash
# 安装 reveal-md 命令
npm install -g reveal-md

# 在 repo 根目录下执行，这会启动一个 Node 服务器，浏览器页面会自动打开
reveal-md .
```

# Ionic Demo

`ionic-demo` 目录是一个完整的 Ionic 应用，你可以 `cd` 进去运行它。

这个应用包含了以下演讲内容的例子，你也可以看 Git commit 了解每一步是怎么实现的。

- 项目结构
- 模块加载（build 流程)
- 使用 ES2015 (Babel.js)
- 环境切换
- clean task 的写法
- Angular 模板预加载

以下是一些常用的命令。

开发模式，启动 dev server 在浏览器里开发调试：

```bash
ionic serve
ionic serve -b   # 同上，不自动打开浏览器页面
```

Gulp 构建流程，编译 JS/SASS 到 `www/compiled` 目录：

```bash
gulp build
ENV=staging gulp build  # 用 ENV 指定环境
```

Ionic (Cordova) 构建流程，生成 iOS/Android 代码

```bash
ionic build ios
ionic build android
# 生成的文件放在 platforms 目录下，程序代码会在下次 build 时自动覆盖
```

构建并在模拟器或设备上运行：

```bash
# 在 iOS 模拟器上运行
ionic emulate ios

# 在 Genymotion 或 Android 设备上运行。因为 Genymotion 相当于开了一个真实设备，所以用 run
ionic run android
```
