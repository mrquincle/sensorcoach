function LoginCtrl($scope, $http, $location) {
  $scope.welcome = 'Sign in with Twitter';

  // Here I enable cross-site scripting so we can have a redirect to Twitter
  $http.defaults.useXDomain = true;

  $scope.submit = function() {
    window.location = "/sessions/connect";
/*    $http({method: 'GET', url: '/sessions/connect'}).
    success(function(data, status) {
        $scope.welcome = data;
        //$location.absUrl(data); 
        //$location.replace(); // does not work cross-site
    }).
    error(function(response) {
      // I do not get any content for "response", it's empty
      $scope.welcome = "Request failed (response=" + response + ")";
    });
*/
  };
}