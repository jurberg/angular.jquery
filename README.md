angular.jquery
==============

Angular directives for jQuery and jQuery UI plugins

jqdialog - jQuery UI Dialog Directive
-------------------------------------
Creates a jQuery UI dialog using the supplied options.  A services
will be created for the dialog named `dialogName`DialogService with
openDialog and closeDialog methods.

Attributes:

- dialog-name (required): name used for the dialog service
- on-open: a scope function called when the dialog is opened
- on-close: a scope function called when the dialog is closed
- button-classes: map of {'`button name`': '`class name`'} for any buttons
- args-to-scope: true = openDialog arguments will be added to the directive's parent scope
- all jQuery UI dialog options will be available as scope attributes
  - buttons: you can pass 'close' as the method for a button and it will close the dialog
  
Service methods:

- isOpen: calls isOpen method on the dialog
- moveToTop: calls moveToTop method on the dialog
- getOption(option): returns the value of the option
- setOption(option, value): sets the option to the new value
- openDialog(options): calls onOpen if available, then opens the dialog and returns a Promise
- closeDialog(data): close the dialog and resolves the Promise with the data



[Dialog Demo](http://rawgit.com/jurberg/angular.jquery/master/example/example.html)