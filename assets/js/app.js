var app = angular.module('myApp', ['ngMaterial', 'ui.router','md.data.table']);

app.run(function($rootScope, $location, $state, LoginService) {
    $rootScope.$on('$stateChangeStart', 
      function(event, toState, toParams, fromState, fromParams){ 
          console.log('Changed state to: ' + toState);
      });
    
      if(!LoginService.isAuthenticated()) {
        $state.transitionTo('login');
      }
  });
  

app.config(function ($stateProvider, $urlRouterProvider, $qProvider,$locationProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('');


    $urlRouterProvider.otherwise('/login');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('login', {
            url: '/login',
            templateUrl: 'pages/login.html',
            controller: 'LoginController'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('dashboard', {
            // we'll get to this in a bit   
            url: '/dashboard',
            templateUrl: 'pages/dashboard.html',
            controller: 'DashboardController'
        });

});

app.controller('myCtrl', function ($scope, $location, $http) {
    $scope.isActive = function(path) {
        return $location.path() === path;
    };

   

});

app.controller('LoginController', function ($scope, $rootScope, $stateParams, $state, LoginService) {
    $scope.message = "This is a login page!"
    $rootScope.title = "AngularJS Login Sample";
    
    $scope.formSubmit = function() {
      if(LoginService.login($scope.username, $scope.password)) {
        $scope.error = '';
        $scope.username = '';
        $scope.password = '';
        $state.transitionTo('dashboard');
      } else {
        $scope.error = "Incorrect username/password !";
      }   
    };
    

})

app.factory('LoginService', function() {
    var admin = 'admin';
    var pass = 'pass';
    var isAuthenticated = false;
    
    return {
      login : function(username, password) {
        isAuthenticated = username === admin && password === pass;
        return isAuthenticated;
      },
      isAuthenticated : function() {
        return isAuthenticated;
      }
    };
    
  });
app.controller('DashboardController', function ($scope) {
    $scope.message = "This is a dashboard page!"


    $scope.selected = [];
    
    $scope.query = {
      order: 'name',
      limit: 5,
      page: 1
    };
    
    function success(desserts) {
      $scope.desserts = desserts;
    }
    
    $scope.getDesserts = function () {
      $scope.promise = $nutrition.desserts.get($scope.query, success).$promise;
    };
  
})
