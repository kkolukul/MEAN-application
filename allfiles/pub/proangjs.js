var app = angular.module('myapp',['ngRoute']);

app.config(function ($routeProvider) {
$routeProvider.
when('/',{
  templateUrl : '../views/prologin.html',
  controller : 'loginctrl'
}).
when('/prowelcome',{
  templateUrl:'../views/prowelcome.html',
  resolve : {
    simple : function ($http,$location) {
          $http.get('/logcheck').then(function(res){
         console.log(res);
         if(!res.data){ $location.path('/');}
       });
      // var prom = dbservice.checklog();
      // console.log(prom);
      //
      // prom.then(function(success){
      //    console.log(success);
      // },function(err){
      //   console.log('error after promise is received');
      // });
    }


  }
}).when('/getdetails/:batch',{
  templateUrl:'../views/promonitor.html',
  controller:'getdetailsController',
  resolve : {
    simple : function ($http,$location) {
          $http.get('/logcheck').then(function(res){
         console.log(res);
         if(!res.data){ $location.path('/');}
       });
     }
   }
}).when('/promonitor',{
  templateUrl:'../views/promonitor.html',
  resolve : {
    simple : function ($http,$location) {
          $http.get('/logcheck').then(function(res){
         console.log(res);
         if(!res.data){ $location.path('/');}
       });
     }
   }
}).when('/logout',{
  templateUrl:'logout'
});

});

app.controller('loginctrl',['$scope','loginFactory','$location',function ($scope,loginFactory,$location) {
console.log('in login ctrl');
 $scope.check = function(){
        var promise = loginFactory.validate($scope.name,$scope.pass);
        promise.then(function(data){
          if(data.data.length > 0){
            console.log(data);
            // detailService.storeObject(data);
            $location.path('/prowelcome');
          } else {
            console.log(data);
            $scope.error = 'invalid credentials';
          }
        },function(err){
          console.log(error);
        });
 };

 $scope.signUp = function(){
   $location.path('/signUp');
 };

 // $scope.logout = function(){
 //   logoutFactory.logout();
 // };

 }]);

 app.factory('loginFactory',['$http',function ($http) {
 var obj = {};
 obj.validate = function (username,password) {
   console.log('in loginFactory');
   return $http.post('/authenticate',{'username':username,'password':password});

 };
 return obj;
 }]);

 // app.factory('logoutFactory',function($http,$location){
 //   var obj = {};
 //   obj.logout = function () {
 //     $http.get('/logout');
 //     };
 //     return obj;
 // });

 app.controller('getdetailsController',function ($scope,$http,$routeParams,$location) {
   $scope.batch = $routeParams.batch;
   console.log($scope.batch);
   if ($scope.batch) {
     $http.post('/alldetails',{'batch':$scope.batch}).then(function (data) {
       console.log(data.data);
       $scope.details = data.data;

      //  $http.post('/postdetails',{'details':data.data});
     },function (err) {
       console.log('error in alldetails');
     });

   }

   $scope.displaydetails = function () {
      $scope.currentUser = $scope.viewall;
   };

  //  $scope.logout = function () {
  //
  //   logoutFactory.logout();
  // };

  });

 // app.provider('logcheckFactory',function ($http) {
 //   this.check = function () {
 //     $http.get('/logcheck').then(function (data) {
 //       console.log('in logcheck');
 //       console.log(data);
 //       return data.data;
 //     },function (error) {
 //       console.log(error);
 //     });
 //   };
 //   this.$get = function(){
 //     return;
 //   };
 // });

 app.service('dbservice',function ($http) {
   return {
     checklog : function(){
      //  var deferred = $q.defer();

       $http.get('/logcheck').then(function(response){
        //  deferred.resolve(response);
         console.log(response);
        //  return deferred.promise;
        return response.data;
       },function(err){
        //  deferred.reject(err);
        //  return deferred.promise;
        return err;
       });
   }
 };
 });
