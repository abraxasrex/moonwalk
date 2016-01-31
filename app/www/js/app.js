(function () {
    'use strict';

    angular
        .module ('starter', [
            'ionic',
            'starter.controllers',
            'starter.directives',
            'starter.routes'
        ])
        .run (starterRun);


    function starterRun($ionicPlatform) {
        $ionicPlatform.ready (function () {
            if (window.StatusBar) {
                StatusBar.styleDefault ();
            }
        });
    }

} ());