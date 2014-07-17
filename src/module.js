/*global angular */
angular.module('angular.jquery', []).config(['$provide', function($provide) {
    'use strict';
    angular.module('angular.jquery').provide = $provide;
}]);
