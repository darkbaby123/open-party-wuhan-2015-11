# Impressive Ionic for Hybrid App

---

# 关于我

- 陈璋 (David Chen)
- 7 年全栈（gan）工程师
- 擅长前端 (JavaScript) 的后端 (Ruby)
- 为 Ember.js 做过一点小贡献
- [Blog](http://segmentfault.com/u/darkbaby123)

---

# Hybrid App

混合 web 和 native 技术开发的移动端应用

----

## 两种方式

- Web Hybrid
- Native Hybrid

----

## Web Hybrid

- 主体代码都用 Web 技术，几乎没有 native UI 组件
- 一个 webview 为主体，跑 web 代码
- 一层 native container，负责与硬件交互
- [Ionic 是其中代表](http://ionicframework.com/)

----

## Native Hybrid

- 框架结构是 native 代码，比如 navigation
- 在需要的部分嵌入 webview 做界面
- 可能有多个 webview
- [Basecamp 是其中代表](https://signalvnoise.com/posts/3743-hybrid-sweet-spot-native-navigation-web-content)

----

## Bigger 图

![web-hybrid-vs-native-hybrid](/img/web-hybrid-vs-native-hybrid.png)

----

## The 3rd way

用相同的代码开发，编译成不同平台的 native 代码

- React Native
- Telerik (Kendo UI, NativeScript)
- Xamarin (.NET)

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

![ionic-hello-world](/img/ionic-hello-world.png)

---

# 怎么写好一个 Ionic app

---

# 项目结构

----

## Ionic 默认给你的

![ionic-app-structure](/img/ionic-app-structure.png)

----

![you-tm](/img/you-tm.jpg)

----

## Cordova 项目结构

```
hooks/          <- Cordova 回调脚本
platforms/      <- 编译后的 native app 代码（壳）
  ios/          <- iOS app
  android/      <- Android app
plugins/        <- Cordova 插件
www/
  index.html    <- Webview 首页
  ..            <- index.html 需要的其他静态资源
config.xml      <- Cordova 项目配置
```

----

## Ionic 项目结构

```
hooks/
node_modules    <- 不用说了吧
platforms/
  ios/
  android/
plugins/
www/
  index.html
  lib/          <- Bower 安装的包（bower_components）
  ..
.bowerrc        <- Bower 配置
bower.json      <- Bower 包管理
config.xml
gulpfile.js     <- Gulp 脚本，Ionic CLI 可能会用到
ionic.project   <- Ionic 项目配置
package.json    <- NPM 包管理
```

----

## Ionic 项目 === Angular 项目

- Cordova 只关心 `www` 下面的内容，不在意它们怎么构建的
- Ionic 就是 Gulp 构建的 Angular 项目
- 我们可以把 web 相关代码抽出去，只要最终 build 到 `www` 就行

----

## 我们用的

- [Angular Style Guide](https://github.com/johnpapa/angular-styleguide)
- 针对 ES2015 做一点改变

```
app/                        <- Angular 应用源码
  app.js                    <- 应用程序入口，引用所以模块
  mod-1/                    <- 按功能划分模块，内部文件名 func.type.js
    mod-1.route.js          <- 模块路由
    func-1.controller.js    <- 子功能 1 相关
    func-1.service.js
    func-1.html
    func-2.controller.js    <- 子功能 2 相关
    ...
  mod-2/
    ...
```

----

```js
// func-1.controller.js

(() => {  // <- use IIFE to avoid polluting global

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

angular.module('app.mod-1').service('func1Service', Func1Service)

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

## 原始的方法

```html
<script src="app/app.js"></script>
<script src="app/feature-1/feature-1.route.js"></script>
<script src="app/feature-1/func-1.controller.js"></script>
<script src="app/feature-1/func-1.service.js"></script>
50 more script tags...
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

## 源码 & 编译后代码

```
app/
  app.js           <- JS entry point
  feature-1/
  feature-2/
scss/
  app.scss         <- SASS entry point
  ...
www/
  app/all.js       <- Compiled JS
  css/style.css    <- Compiled CSS
  index.html
```

```html
<!-- www/index.html -->
<link href="css/style.css" rel="stylesheet">
<script src="app/all.js"></script>
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

- 使用 ENV 环境变量 (dev, staging, prod) 设定环境
- 环境配置写在 JSON 文件里面
- 使用 gulp-ng-config 编译成 Angular module 和 constant
- 用 Angular 的 DI 注入任何需要的模块中使用

----

## app-config.json

```js
{
  "dev": {
    "appConfig": {
      "apiHost": ""
    }
  },
  "staging": {
    "appConfig": {
      "apiHost": "http://staging.yourapp.com"
    }
  },
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

// Advantage to use ENV: does not affect Ionic CLI
ENV=prod ionic serve
```

## 编译后的 module

```js
// compiled config (www/app-config.js)
angular.module('app')
  .constant('appConfig', {
    apiHost: 'http://staging.yourapp.com'
  })

// use appConfig in other services
angular.module('app')
  .service('apiService', function(appConfig) => { .. })
```

---

# 开发 & 调试

----

## 平时开发，在浏览器上调试

![dev-on-chrome](/img/dev-on-chrome.png)

----

## 善用 Chrome

- 模拟设备 (尺寸，横竖屏，网络延时)
- 模拟感应器 (geolocation, accelerometer)

----

![chrome-emulate](/img/chrome-emulate.png)

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
- 需要打开设备的 USB debug 功能

----

## 在 Android 上调试

![android-debug](/img/android-debug.png)

----

## 在 iOS 上调试

![ios-debug](/img/ios-debug.png)

----

## 在设备上 Live Reload

```bash
# You may met problems sometimes, but it works
ionic run ios --livereload
```

---

# 问题和技巧

---

# Build 之前清理临时文件

----

## 问题

- Gulp 的设计目标是尽量并行地执行任务
- Gulp API 不能很好地表达需要按顺序执行的任务
- clean 就是一个典型例子（先 clean 再 build），因此不太好做

----

## 解决方法

用 run-sequence 指定 task 顺序

```js
// npm install run-sequence

var runSequence = require('run-sequence')

gulp.task('build', function(done) {
  runSequence(
    'clean',
    ['js-polyfill', 'js', 'app-config', 'template', 'sass'],
    done    // Use done callback to tell Gulp when the task completes
  )
})
```

---

# 模板预加载

----

## 现象

- Ionic 会预加载定义在 route ($stateProvider.state) 里的模板
- 默认预加载 30 个
- 提升页面渲染性能

----

## 问题

- 对开发太不友好
- 页面一刷新就是 30 个 AJAX 请求
- 配合 Live Reload 就是神一般的体验

----

## 解决方法

用 gulp-angular-templatecache 预编译所有模板

```js
var paths = {
  template: ['./app/**/*.html'],
}

// Precompile templates to JS under app.templates module
// It's called in build process
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

# Ionic view cache

----

## 现象

- Ionic 会缓存 view (DOM cache) 来提升 UI 性能
- view 默认缓存 10 个
- 对 back 的动画效果尤其有用
- [ion-view 的 caching](http://ionicframework.com/docs/api/directive/ionView/)
- [$ionicConfigProvider 的 maxCache 和 forwardCache](http://ionicframework.com/docs/api/provider/$ionicConfigProvider/)

----

## 问题

- scope 的生命周期改变了
- controller 的构造函数不会每次都执行了
- directive 的 link 函数也不会每次都执行了

----

## 解决方法：controller

多用 $ionicView 事件

```js
class SomeController {
  constructor($scope) {
    // Executed when view is re-constructored
    // Cache view does not execute it

    $scope.$on('$ionicView.beforeEnter', () => {
      // Executed every time when entering view
    })

    $scope.$on('$ionicView.beforeLeave', () => {
      // Executed every time when leaving view
    })
  }
}
```

----

## 解决方法：controller

多用 getter 或 $watch

```js
class SomeController {
  constructor($scope, user) {
    this.user = user

    // not recommended
    this.fullName = `${this.user.firstName} ${this.user.lastName}`

    // less recommended (watch)
    $scope.$watchGroup(['vm.user.firstName', 'vm.user.lastName'], () => {
      this.fullName = `${this.user.firstName} ${this.user.lastName}`
    })
  }

  // recommended (getter)
  get fullName() {
    return `${this.user.firstName} ${this.user.lastName}`
  }
}
```

----

## 解决方法：directive

- $ionicView 事件对 directive 不起作用
- 难以使用 `xxx as`，所以没法用 getter
- 尽量用 $watch

---

## Webview

----

## 问题

- 不同平台下的 webview 有差异 (iOS, Android)
- 同平台不同版本的 webview 也有差异 (iOS 7/8/9, Android 2/4/5)
- 同平台同版本，浏览器和 webview 也有差异

----

## 解决方法

- iOS 平台其实差异不算太大（不管了）
- Android 平台可以替换成统一的 webview
- 推荐 [Crosswalk](https://crosswalk-project.org/documentation/cordova/cordova_4.html)
- 需要 Cordova 版本 4.0 以上

----

## 缺点

- 编译后的项目会变大（包含了 Crosswalk）
- 会编译出 x86 和 arm 两个版本

---

# Form

----

## 问题

$scope 里找不到 form 了？

```html
<ion-view>
  <ion-content>
    <!-- in controller: $scope.myForm is undefined -->
    <form name="myForm"></form>
  </ion-content>
</ion-view>
```

----

## Angular 的 $scope 设计问题

- ion-content 是 directive
- directive 包裹的 html 背后是 transcluded scope ，原型继承自外层的 scope (controller)
- `<form name="myForm">` 其实把 form 附在 transcluded scope 上

```html
<!-- controller scope -->
<ion-view>
  <ion-content><!-- directive -->
    <!-- transcluded scope -->
    <form name="myForm"></form>
  </ion-content>
</ion-view>
```

----

## 解决方法

- [Angular: understanding scope](https://github.com/angular/angular.js/wiki/Understanding-Scopes)
- 始终使用 `scope.someObj.attr = ..`
- 有了 `controller as` ，controller 就是 `scope.someObj`

```html
<!-- in route: controller as vm -->
<ion-view>
  <ion-content>
    <!-- scope: transcluded scope -->
    <!-- scope.vm: parent scope's controller instance -->
    <form name="vm.myForm"></form>
  </ion-content>
</ion-view>
```

---

# Hybrid app 感想

- 混合不同方面的技能去完成一件事情
  - Cordova 是提供设备功能到 JS 接口的 adapter
  - Ionic 是 UI 层
  - Angular 提供架构
  - Gulp 提供 build 流程
- Web 开发的所有工具和技巧几乎都能用
- 对 Web 开发者比较容易上手，但需要各方面的综合能力

---

# Thanks!

## Q & A
