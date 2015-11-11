(() => {

class LoginController {
  constructor($scope, $ionicPopup) {
    this.$ionicPopup = $ionicPopup

    $scope.$on('$ionicView.beforeEnter', () => {
      this.username = ''
      this.password = ''
    })
  }

  login() {
    this.$ionicPopup.alert({
      title: 'Login success',
      template: `
        <div>username: ${this.username}</div>
        <div>password: ${this.password}</div>
      `,
    })
  }
}

angular.module('app.auth').controller('LoginController', LoginController)

})()
