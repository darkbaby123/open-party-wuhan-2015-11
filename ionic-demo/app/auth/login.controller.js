(() => {

class LoginController {
  constructor($scope, $ionicPopup, appConfig) {
    this.$ionicPopup = $ionicPopup
    this.appConfig = appConfig

    $scope.$on('$ionicView.beforeEnter', () => {
      this.username = ''
      this.password = ''
    })
  }

  login() {
    this.$ionicPopup.alert({
      title: 'Login success',
      template: `
        <div>API: ${this.appConfig.apiHost}</div>
        <div>username: ${this.username}</div>
        <div>password: ${this.password}</div>
      `,
    })
  }
}

angular.module('app.auth').controller('LoginController', LoginController)

})()
