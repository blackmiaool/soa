var myApp = angular.module("myApp", []);
myApp.controller("aController", ['$scope', '$timeout', 'AuthenticationService', function ($scope, $timeout, AuthenticationService) {
    $scope.login = function () {
        $scope.dataLoading = true;
        AuthenticationService.Login($scope.username, $scope.password, function (response) {
            $scope.dataLoading = false;
            alert(response.message);
            if (response.success) {
                //                AuthenticationService.SetCredentials($scope.username, $scope.password);
                //                $location.path('/');
            } else {
                //                $scope.error = response.message;
                //                
            }
        });
    };
  }]).factory('AuthenticationService', ['$timeout', '$http',
      function ($timeout, $http) {
        var details;
        $http.get("data.json").then(function (response) {
            details = response.data;
            console.log(details.username);
        });

        function Login(username, password, callback) {
            $timeout(function () { //timeout is not needed here
                var response = {
                    success: username === details.username && password === details.password
                }
                if (!response.success) {
                    response.message = 'Username or password is incorrect';
                } else {
                    response.message = 'succcess';
                }
                callback(response);
            }, 1000);
        }
        return {
            Login: Login
        }
}]);
