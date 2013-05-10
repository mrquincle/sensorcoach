function EmailCtrl($scope, $http) {
  $scope.send = false;
  $scope.failure = false;
  $scope.contact = {};
  $scope.list = [];
  $scope.submit = function() {
    if (this.contact.message_body) {
      this.list.push(this.contact.message_body);
    }

    $http.post('/contact', $scope.contact).success(function(response)
    {
      if (response.success) {
        $scope.send = true;
        $scope.failure = false;
      } else {
        $scope.send = false;
        $scope.failure = true;
      }
    });

  };
}
