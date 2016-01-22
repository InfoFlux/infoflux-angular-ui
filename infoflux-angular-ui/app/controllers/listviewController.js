(function () {
    'use strict';

    angular
        .module('app')
        .controller('listviewController', listviewController);

    listviewController.$inject = ['$scope', '$rootScope', '$document'];

    function listviewController($scope, $rootScope, $document) {
        $scope.selectedCountries = [{
            id: 1,
            title: 'Belgium',
            code: 'BE'
        },
            {
                id: 2,
                title: 'Netherlands',
                code: 'NL'
            }];
        $scope.selectedCountries2 = [1, 3, 5];


        $scope.customer = {
            id: 1,
            country: {
                id: 1,
                title: 'Belgium',
                code: 'BE'
            },
            countryId: 1,
            name: 'InfoFLux BVBA'
        };

        $scope.customer2 = {
            id: 1,
            country: null,
            countryId: 8,
            name: 'InfoFLux BVBA'
        };

        $scope.countries = [
            {
                id: 1,
                title: 'Belgium',
                code: 'BE'
            },
            {
                id: 2,
                title: 'Netherlands',
                code: 'NL'
            },
            {
                id: 3,
                title: 'Spain',
                code: 'ES'
            }
            , {
                id: 4,
                title: 'France',
                code: 'FR'
            },
            {
                id: 5,
                title: 'United Kingdom',
                code: 'UK'
            },
            {
                id: 6,
                title: 'Luxemburg',
                number: 'LU'
            },
            {
                id: 7,
                title: 'Germany',
                number: 'DE'
            }
            , {
                id: 8,
                title: 'Ireland',
                number: 'IE'
            }
        ];

        $scope.countries2 = [];
        $scope.countries3 = [];
        $scope.countries4 = [];
        activate();

        function activate() {

            angular.copy($scope.countries, $scope.countries2);
            angular.copy($scope.countries, $scope.countries3);
            angular.copy($scope.countries, $scope.countries4);

            /*angular.copy($scope.customer, $scope.customer2);
            */
        }
    }
})();
