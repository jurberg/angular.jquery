var app = angular.module('app', ['angular.jquery']);

app.controller('DemoCtrl', [
    '$scope',
    'TestDialogService',
function($scope, TestDialogService) {
    'use strict';

    $scope.testDialog = function() {
        TestDialogService.openDialog().then(function(result) {
            if (result.ok) {
                alert('You entered ' + result.name);
            }
        });
    };

}]);

app.controller('DialogCtrl', [
    '$scope',
    'TestDialogService',
function($scope, TestDialogService) {
    'use strict';

    $scope.fullName = "Test";

    $scope.onOpen = function() {
        $scope.fullName = "";
    };

    $scope.onOk = function() {
        TestDialogService.closeDialog({ok: true, name: $scope.fullName});
    };

    $scope.onCancel = function() {
        TestDialogService.closeDialog({ok: false});
    };

}]);