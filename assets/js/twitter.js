function LoginCtrl($scope, $http) {
  $scope.welcome = 'Sign in with Twitter';

  $scope.submit = function() {

    $http({method: 'GET', url: '/sessions/connect'}).
    success(function(data, status, header, config) {
        $scope.welcome = data;
    });
  };
}