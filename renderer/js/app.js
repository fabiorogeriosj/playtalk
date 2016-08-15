var app = angular.module('app', ['ngSanitize']);
var ipcRenderer = require('electron').ipcRenderer;

app.controller('indexCtrl', function ($scope, $timeout){

    $timeout(function(){
        $scope.categories = ipcRenderer.sendSync('getCategories');
        $scope.listCategory($scope.categories[0]);
    })

    $scope.listCategory = function (category){
        $scope.category = category;
        $scope.listTalks(category);
    }

    $scope.listTalks = function (category){
      $timeout(function(){
          $scope.talks = ipcRenderer.sendSync('getTalks', category);
          console.log($scope.talks);
      })
    }

})
