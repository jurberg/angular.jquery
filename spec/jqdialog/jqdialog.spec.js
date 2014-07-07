/*global describe, beforeEach, afterEach, it, spyOn, module, inject */
describe("jQuery Dialog Directive", function() {
    'use strict';

    var injector, element, $rootScope;

    beforeEach(function() {
        spyOn($.fn, 'dialog').andCallThrough();
        module('angular.jquery');
        inject(function($injector) {
            var $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
            injector = $injector;

            $rootScope.onOk = jasmine.createSpy();
            $rootScope.onOpen = jasmine.createSpy().andReturn(null);
            $rootScope.onClose = jasmine.createSpy();

            element = $compile('<jqdialog dialog-name="Test" title="\'Test Dialog\'" ' +
                'buttons="{\'OK\': onOk}" button-classes="{\'OK\': \'test-button\'}"' +
                ' on-open="onOpen" on-close="onClose"></jqdialog>')($rootScope);
            angular.element(document.body).append(element);
        });
    });

    afterEach(function() {
        element.remove();
    });

    it("should pass options to dialog function", function() {
        expect($.fn.dialog).toHaveBeenCalled();
        expect($.fn.dialog.argsForCall[0][0].title).toEqual('Test Dialog');
        expect($.fn.dialog.argsForCall[0][0].buttons.OK).toBeDefined();

        $.fn.dialog.argsForCall[0][0].buttons.OK();

        expect($rootScope.onOk).toHaveBeenCalled();
    });

    it("should add buttons and class", function() {
        expect($('.test-button').length).toBe(1);
    });

    describe("Dialog Service", function() {

        var original, service;

        beforeEach(function() {
            original = $.fn.dialog;
            $.fn.dialog = jasmine.createSpy();
            service = injector.get('TestDialogService');
        });

        afterEach(function() {
            $.fn.dialog = original;
        });

        it("should create a service", function() {
            expect(service).toBeDefined();
            expect(service.openDialog).toBeDefined();
            expect(service.closeDialog).toBeDefined();
            expect(service.q).toBeDefined();
        });

        it("should open the dialog on open", function() {
            service.openDialog('test');
            $rootScope.$digest();
            expect($.fn.dialog).toHaveBeenCalledWith('open');
            expect($rootScope.onOpen).toHaveBeenCalledWith('test');
        });

        it("should close the dialog on close", function() {
            var data = {stuff: 'value'},
                dfd = service.openDialog();
            $.fn.dialog = jasmine.createSpy();

            service.closeDialog(data);
            expect($.fn.dialog).toHaveBeenCalledWith('close');
            expect($rootScope.onClose).toHaveBeenCalledWith(data);

            dfd.then(function(result) {
                expect(result).toEqual(data);
            });
            $rootScope.$digest();

        });

    });

});