angular.module('app.auth').config($stateProvider => {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/auth/login.html',
      controller: 'LoginController as vm',
    })
})
