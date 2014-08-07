/*global angular */
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
 * - isOpen: calls isOpen method on the dialog
 * - moveToTop: calls moveToTop method on the dialog
 * - getOption(option): returns the value of the option
 * - setOption(option, value): sets the option to the new value
 * - openDialog(options): calls onOpen if available, then opens the dialog and returns a Promise
 * - closeDialog(data): close the dialog and resolves the Promise with the data
 */
(function(app) {

    function JQueryDialogService($q) {
        this.q = $q;
        this.dfd = null;
        this.dialog = null;
        this.onOpen = null;
        this.onClose = null;
    }

    JQueryDialogService.prototype = {

        isOpen: function() {
            return this.dialog.dialog('isOpen');
        },

        moveToTop: function() {
            this.dialog.dialog('moveToTop');
        },

        getOption: function(option) {
            return this.dialog.dialog("option", option);
        },

        setOption: function(option, value) {
            this.dialog.dialog("option", option, value);
        },

        openDialog: function(options) {
            var openDfd = null,
                self = this;
            this.dfd = this.q.defer();
            if (this.onOpen) {
                openDfd = this.onOpen(options);
            }
            if (this.argsToScope === true) {
                Object.keys(options).forEach(function (key) {
                    this.scope[key] = options[key];
                }, this);
            }
            return (openDfd || this.q.when()).then(function() {
                self.dialog.dialog('open');
                return self.dfd.promise;
            });
        },

        closeDialog: function(data) {
            if (this.onClose) {
                this.onClose(data);
            }
            this.dialog.dialog('close');
            this.dfd.resolve(data);
        }
    };

    app.directive('jqdialog', ['$injector', function JQueryDialogDirective($injector) {
        'use strict';

        var options = Object.keys($.ui.dialog.prototype.options)
            .concat(['beforeClose','close','create','drag','dragStart','dragStop','focus','open','resize','resizeStart','resizeStop']);

        return {

            // add all the options from jquery dialog as parent bindings on the scope
            // then add in onOpen, onClose and buttonClasses bindings
            scope: options.reduce(function(acc, val) {
                acc[val] = "&"; return acc;
            }, {
                onOpen: "&",
                onClose: "&",
                buttonClasses: "&",
                argsToScope: "&"
            }),

            restrict: 'E',

            replace: true,

            transclude: true,

            template: '<div style="display:none"></div>',

            compile: function(elem, attrs) {
                var serviceName = attrs.dialogName + 'DialogService';

                // Dynamically create the service in the compile function so it's
                // available for injection by name
                app.provide.service(serviceName, ['$q', JQueryDialogService]);

                return function(scope, elem, attrs, ctrl, transclude) {
                    var service = $injector.get(serviceName),
                        opts = options.reduce(function(acc, val) {
                            // evaluate any option from the scope if it exists
                            // and add it to the options array
                            var value = scope[val] ? scope[val]() : undefined;
                            if (value !== undefined) {
                                acc[val] = value;
                                if (val === 'buttons') {
                                    Object.keys(value).forEach(function(buttonName) {
                                        if (value[buttonName] === 'close') {
                                            value[buttonName] = service.closeDialog.bind(service);
                                        }
                                    });
                                }
                            }
                            return acc;
                        }, {}),
                        dialog = elem.dialog(opts),
                        buttons = dialog.parent().find('.ui-dialog-buttonset button');

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

                    service.dialog = dialog;
                    service.onOpen = scope.onOpen();
                    service.onClose = scope.onClose();
                    service.scope = scope.$parent;
                    service.argsToScope = scope.argsToScope();

                    transclude(scope.$parent, function(clone) {
                        elem.append(clone);
                    });

                };
            }
        };

    }]);
}(angular.module('angular.jquery')));