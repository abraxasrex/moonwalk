(function () {
    'use strict';
    angular
        .module ('starter.routes', ['ionic'])
        .config (function ($stateProvider, $urlRouterProvider) {
            var templateUrl = 'templates/';
            $urlRouterProvider.otherwise ('/');

            $stateProvider.state ('home', {
                    url: '/',
                    templateUrl: templateUrl + 'home.tpl.html',
                    controller: 'HomeCtrl as Home'
                })
                .state ('other', {
                    abstract: true,
                    url: '/other',
                    templateUrl: templateUrl + 'other.tpl.html'
                })
                .state ('other.tree', {
                    url: '/',
                    template: '<map on-create="mapCreated(map)"></map>'
                })
        })

} ());
