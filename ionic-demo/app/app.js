(() => {

defineApp('app', [
  ['app.core', ['ionic']],
  'app.auth',
]).run($ionicPlatform => {
  $ionicPlatform.ready(() => {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
    }
    if (window.StatusBar) {
      StatusBar.styleDefault()
    }
  })
})

/**
 * Simple helper function to quickly define Angular modules and dependencies
 *
 * Instead of:
 *
 *   angular.module('app.mod1', [])
 *   angular.module('app.mod2', ['dep1', 'dep2'])
 *   angular.module('app', ['app.mod1', 'app.mod2'])
 *
 * You can use:
 *
 *   defineApp('app', [
 *     'app.mod1',
 *     ['app.mod2', ['dep1']],
 *   ])
 */
function defineApp(app, deps) {
  var depNames = []

  deps.forEach(function(dep) {
    var modName, modDeps
    if (typeof dep === 'string') {
      [modName, modDeps] = [dep, []]
    } else {
      [modName, modDeps] = dep
    }

    angular.module(modName, modDeps)
    depNames.push(modName)
  })

  return angular.module(app, depNames)
}

})()
