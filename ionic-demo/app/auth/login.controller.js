(() => {

class LoginController {
  constructor($scope) {
    this.$scope = $scope
  }

  login() {
  }
}

angular.module('app.auth').controller('LoginController', LoginController)

})()
