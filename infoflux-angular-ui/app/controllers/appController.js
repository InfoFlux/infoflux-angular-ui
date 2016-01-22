(function () {
    'use strict';

    angular
        .module('app')
        .controller('appController', appController);

    appController.$inject = ['$scope']; 

    function appController($scope) {
        $scope.title = 'appController';

        activate();

        function activate() { }
    }
})();
