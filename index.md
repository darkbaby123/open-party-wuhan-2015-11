# Ionic 的最佳实践

---

# 关于我

- 陈璋
- 7 年全栈（gan）工程师
- 擅长 Ruby/JavaScript

---

# Hybrid App

- 混合应用
- 用 web 技术开发移动端 app

----

## 两种方式

- Web Hybrid
- Native Hybrid

----

## Web Hybrid

- 主体代码都用 Web 技术，几乎没有 native UI 组件
- 一个 webview 为主体，跑 web 代码
- 一层 native container，负责与硬件交互
- Cordova/PhoneGap 是其中代表

----

## Native Hybrid

- 框架结构是 native 代码，比如 navigation
- 在需要的部分嵌入 webview 做界面
- 往往有多个 webview

----

## Bigger 图

![web-hybrid-vs-native-hybrid](/web-hybrid-vs-native-hybrid.png)

---

# Ionic

- Web Hybrid
- 移动端 UI 框架
- Angular 提供项目架构
- Cordova 提供硬件交互能力

----

## 例子

```html
<ion-pane>

  <ion-header-bar class="bar-stable">
    <h1 class="title">Ionic Blank Starter</h1>
  </ion-header-bar>

  <ion-content class="has-header">

    <ion-list>
      <ion-item>Hello</ion-item>
      <ion-item>World</ion-item>
    </ion-list>

  </ion-content>

</ion-pane>
```

----

## 例子

![ionic-hello-world](/ionic-hello-world.png)

---

# 怎么写好一个 Ionic app

---

# 项目结构

----

## Ionic 默认给你的

![ionic-app-structure](/ionic-app-structure.png)

----

![you-tm](/you-tm-2.jpg)

----

## Ionic 项目结构 === Angular 项目结构

- [Angular Style Guide](https://github.com/johnpapa/angular-styleguide)
- 针对 ES6 做一点改变

----

## 我们用的项目结构

```
app/
  app.js                    <- 应用程序入口，引用所以模块
  mod-1/                    <- 按功能划分模块，内部文件名 func.type.js
    mod-1.route.js          <- 模块路由
    func-1.controller.js    <- 子功能 1 相关
    func-1.service.js
    func-1.html
    func-2.controller.js    <- 子功能 2 相关
    ...
  mod-2/
    mod-2.module.js
    ...
```

----

```js
// func-1.controller.js

(() => {  // <- 简单的闭包，避免污染全局

class Func1Controller {
  constructor($scope) {
    this.$scope = $scope
  }
}

angular.module('app.mod-1').controller('Func1Controller', Func1Controller)

})()
```

----

```js
// func-1.service.js

(() => {

class Func1Service {
  constructor(anotherService) {
  }
}

angular.module('app.mod-1').controller('func1Service', Func1Service)

})()
```

----

## 概括

- 以功能划分模块
- 文件名 [feature].[type].js
- 文件结构尽量扁平，避免多层嵌套

---

# 模块加载

----

## Bad

```html
<!--
<script src="app/app.js"></script>
<script src="app/feature-1/feature-1.route.js"></script>
<script src="app/feature-1/func-1.controller.js"></script>
<script src="app/feature-1/func-1.service.js"></script>
50 more script tags...
-->
```

----

## 缺点

- 手动管理文件，调整加载顺序
- 不好压缩打包
- 不能用预处理器（Babel）

----

## 用 Gulp 打包

```js
// gulpfile.js

var paths = {
  appConfig: './config/app-config.json',
  js: ['./app/**/*.js'],
  sass: ['./scss/**/*.scss'],
  template: ['./app/**/*.html'],
  compiled: ['www/app/*', 'www/css/*'],
}

gulp.task('build', function(done) {
  runSequence(
    'clean',
    ['js-polyfill', 'js', 'app-config', 'template', 'sass'],
    done
  )
})

gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', displayBabelError)
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('www/app/'))
})

gulp.task('sass', function() {
  return gulp.src('./scss/app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css'))
})
```

----

## 项目结构

```
app/
  app.js           <- JavaScript 入口
  feature-1/
  feature-2/
scss/
  app.scss         <- SASS 入口
  ...
www/
  app/all.js       <- 编译后的 JavaScript
  css/style.css    <- 编译后的 CSS
  index.html
```

```html
<!-- www/index.html
<link href="css/style.css" rel="stylesheet">
<script src="app/all.js"></script>
-->
```

---

# ES2015 (ES6)

----

## 用语言特性简化开发

```js
// Template string
let fullName = `${firstName} ${lastName}`

// Arrow function
someArray.map(i => i.upcase)

// Class
class Person {
  constructor() {}
}

// Destructuring
let [a, b, ...rest] = [1, 2, 3, 4]
let {name, gender} = {name: 'David', gender: 'male'}

// Generator as async flow control
function *process() {
  let users = yield ajax('/users')
}
```

----

## 入门

[Learn ES2015](https://babeljs.io/docs/learn-es2015/)

----

## 集成进 build 流程

```js
// use gulp-babel

gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', displayBabelError)
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('www/app/'))
})
```

---

# 环境切换

----

## 解法

- 使用 ENV 环境变量 (dev, staging, prod)
- 使用 gulp-ng-config 编译成 Angular module
- 最后用 Gulp 合并加载

----

## app-config.js

```js
{
  "dev": {
    "appConfig": {
      "apiHost": ""
    }
  }
  "staging": {
    "appConfig": {
      "apiHost": "http://staging.yourapp.com"
    }
  }
  "prod": {
    "appConfig": {
      "apiHost": "https://api.yourapp.com"
    }
  }
}
```

----

## Gulp task

```js
var env = process.env.ENV || 'dev'

gulp.task('app-config', function() {
  return gulp.src(paths.appConfig)
    .pipe(gulpNgConfig('app', {
      createModule: false,
      environment: env
    }))
    .on('error', displayBabelError)
    .pipe(gulp.dest('./www/app'))
})
```

----

## 使用

```bash
ENV=staging gulp build

ENV=prod ionic serve    <- 使用 ENV 的好处，不影响 Ionic CLI
```

---

# 开发 & 调试

----

## 平时开发，在浏览器上调试

![dev-on-chrome](/dev-on-chrome.png)

----

## 善用 Chrome

- 模拟设备 (尺寸，横竖屏，网络延时)
- 模拟感应器 (geolocation, accelerometer)

----

![chrome-emulate](/chrome-emulate.png)

----

## 在模拟器/真机上调试

```bash
gulp build
ionic run android
ionic run ios
```

----

## Genymotion

- 一个 Android 模拟器
- 可以选择众多 Android 镜像
- 比自带的模拟器 **快很多**

----

## 还是可以接浏览器调试

- iOS 可以接 Safari
- Android 可以接 Chrome

----

## 在 Android 上调试

![android-debug](/android-debug.png)

----

## 在 iOS 上调试

![ios-debug](/ios-debug.png)

----

## Live Reload

```bash
# 有时有点小问题，不过基本能用
ionic run --livereload
```

---

# 问题和技巧

---

## Build 之前清理临时文件

- Gulp 的设计目标是尽量并行地执行任务
- 我们有时需要按顺序执行任务
- clean 就是一个典型例子

----

## 解决方法：run-sequence

```js
gulp.task('build', function(done) {
  runSequence(
    'clean',
    ['js-polyfill', 'js', 'app-config', 'template', 'sass'],
    done    // 注意要加 done，告诉 Gulp 任务何时完成
  )
})
```

---

## 缓存 Angular 模板

- Angular 通过 AJAX 加载指定了 url 的模板 (templateUrl, ng-include)
- 如果等进入页面时才加载模板，就会影响页面展现速度
- Ionic 为了速度，会在项目启动时加载 20 个模板
- 每次 `ionic serve` 就是 20 个请求，拖慢开发速度
- 配合 Live reload 就是神一般的体验

----

## 解决方法：gulp-angular-templatecache

```js
// 预编译模板成 JavaScript，放到 app.templates 模块下
gulp.task('template', function() {
  return gulp.src(paths.template)
    .pipe(templateCache({
      root: 'app',
      module: 'app.templates',
    }))
    .pipe(gulp.dest('www/app'))
})
```

---

## Ionic view cache

- 设计目的是为了提升 UI 性能
- 对 back 的动画效果尤其有用
- 改变了 scope 的生命周期
- [ion-view Doc](http://ionicframework.com/docs/api/directive/ionView/)

----

## 影响

- controller 的构造函数往往只执行一次
- directive 的 link 函数往往也只执行一次

----




- View cache (controller constructor, directive link)
- Crosswalk on Android
- form under directive









## Build process

separate environment
use Browsersync instead of LiveReload

## Replace ionic serve with gulp task

- full control, more flexible
- prevent `ionic serve` error

# Hole

- View cache (controller constructor, directive link)
- form under directive

# Improve

## Use Webpack

# 技巧

- angular template cache
- gulp run sequence

# Hybrid app 感想

混合不同方面的技能去完成一件事情
容易上手，但不一定简单


http://docs.phonegap.com/develop/1-embed-webview/ios/
http://phonegap.com/blog/2015/03/12/mobile-choices-post1/


## Gulp

Write your own gulp tasks, remember to tell other tasks you're done:
- execute the callback.
- return a promise.
- return a stream.
