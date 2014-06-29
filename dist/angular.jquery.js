/*! git://github.com/jurberg/angular.jquery.git 0.1.0 2014-06-29 */
angular.module('angular.jquery', []).config(function($provide) {
    'use strict';
    angular.module('angular.jquery').provide = $provide;
});

/**
 * Directive: jqdialog
 *
 * Description: Creates a jQuery UI dialog using the supplied options.  A services
 * will be created for the dialog named <dialogName>DialogService with openDialog and
 * closeDialog methods.
 *
 * Attributes:
 * - on-open: a scope function called when the dialog is opened
 * - on-close: a scope function called when the dialog is closed
 * - button-classes: map of {'<button name>': '<class name>'} for any buttons
 * - dialog-name: name used for the dialog service
 * - all jQuery UI dialog options will be available as scope attributes
 *
 * Service methods:
 * - openDialog(options): calls onOpen if available, then opens the dialog and returns a Promise
 * - closeDialog(data): close the dialog and resolves the Promise with the data
 */
angular.module('angular.jquery').directive('jqdialog', ['$injector', function JQueryDialogDirective($injector) {
    'use strict';

    var options = Object.keys($.ui.dialog.prototype.options);

    return {

        // add all the options from jquery dialog as parent bindings on the scope
        // then add in onOpen, onClose and buttonClasses bindings
        scope: options.reduce(function(acc, val) {
            acc[val] = "&"; return acc;
        }, {
            onOpen: "&",
            onClose: "&",
            buttonClasses: "&"
        }),

        restrict: 'E',

        replace: true,

        transclude: true,

        template: '<div style="display:none"></div>',

        compile: function(elem, attrs) {

            // Dynamically create the service in the compile function so it's
            // available for injection by name
            angular.module('angular.jquery').provide.service(attrs.dialogName + 'DialogService',
                ['$q', function($q) { this.q = $q; }]);

            return function(scope, elem, attrs, ctrl, transclude) {
                var opts = options.reduce(function(acc, val) {
                        // evaluate any option from the scope if it exists
                        // and add it to the options array
                        var value = scope[val] ? scope[val]() : undefined;
                        if (value !== undefined) {
                            acc[val] = value;
                        }
                        return acc;
                    }, {}),
                    dialog = elem.dialog(opts),
                    buttons = dialog.parent().find('.ui-dialog-buttonset button'),
                    service = $injector.get(attrs.dialogName + 'DialogService');

                // apply any button classes if needed
                if (buttons.length > 0 && scope.buttonClasses) {
                    var buttonClasses = scope.buttonClasses();
                    if (buttonClasses) {
                        Object.keys(buttonClasses).forEach(function (key) {
                            buttons
                                .find('.ui-button-text:contains("' + key + '")')
                                .parent()
                                .addClass(buttonClasses[key]);
                        });
                    }
                }

                service.openDialog = function(options) {
                    var onOpen = scope.onOpen();
                    this.dfd = this.q.defer();
                    if (onOpen) {
                        onOpen(options);
                    }
                    dialog.dialog('open');
                    return this.dfd.promise;
                };

                service.closeDialog = function(data) {
                    var onClose = scope.onClose();
                    if (onClose) {
                        onClose(data);
                    }
                    dialog.dialog('close');
                    this.dfd.resolve(data);
                };

                transclude(scope.$parent, function(clone) {
                    elem.append(clone);
                });

            };
        }
    };

}]);
