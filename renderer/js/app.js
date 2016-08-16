var app = angular.module('app', []);
var ipcRenderer = require('electron').ipcRenderer;

app.controller('indexCtrl', function ($scope, $timeout){
    $scope.loadComplete = false;

    $timeout(function(){
        $scope.categories = ipcRenderer.sendSync('getCategories');
        $scope.listCategory($scope.categories[0]);
    })

    $scope.listCategory = function (category){
        $scope.loadComplete = false;
        $scope.category = category;
        $scope.listTalks(category);
    }

    $scope.listTalks = function (category){
      $timeout(function(){
          $scope.talks = ipcRenderer.sendSync('getTalks', category.id);
          $scope.loadComplete = true;
      })
    }

    $scope.play = function (talk){
      ipcRenderer.send('playTalk', talk);
    }

})
