function LoginCtrl($scope, $http) {
  $scope.welcome = 'Sign in with Twitter';

  $scope.submit = function() {

    $http.get('/sessions/connect').success(function(response)
    {
      if (response.success) {
        $scope.welcome = response.body;
      } 
    });
  };
}