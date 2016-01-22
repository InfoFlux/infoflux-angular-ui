var app = angular.module('app', ['ngRoute', 'if.ui']);

app.constant('routes', getRoutes());

app.config(['$routeProvider', 'routes', routeConfigurator]);

function routeConfigurator($routeProvider, routes) {


    routes.forEach(function (r) {
        $routeProvider.when(r.url, r.config);
    });
    $routeProvider.when('/error', { controller: 'errorController', templateUrl: '/error/', title: 'Error' });
    $routeProvider.otherwise({ redirectTo: '/' });

}

function getRoutes() {
    return [
        {
            url: '/',
            config: {
                templateUrl: 'app/views/home.html',
                title: 'Home',
                controller: 'homeController'
            }
        }, {
            url: '/lv',
            config: {
                templateUrl: 'app/views/listview.html',
                title: 'Home',
                controller: 'listviewController'
            }
        }

    ];
}

