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
- all jQuery UI dialog options will be available as scope attributes

Service methods:

- openDialog(options): calls onOpen if available, then opens the dialog and returns a Promise
- closeDialog(data): close the dialog and resolves the Promise with the data
