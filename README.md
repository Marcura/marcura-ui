[npm-image]: https://img.shields.io/npm/v/marcura-ui.svg
[npm-url]: https://npmjs.org/package/marcura-ui

# Marcura UI

[![NPM Version][npm-image]][npm-url]

## Demos
https://marcura-ui.herokuapp.com/#/home

## Dependencies
* [jQuery](https://jquery.com/) (2.2.0 or higher)
* [Angular](https://angularjs.org/) (1.3.8 or higher)
* [Angular UI Router](https://github.com/angular-ui/ui-router/wiki) (0.2.14 or higher)  
Required for [SideMenu](../../wiki/sidemenu) and [Tabs](../../wiki/tabs).
* [Angular Sanitize](https://www.npmjs.com/package/angular-sanitize) (1.3.8 or higher)  
Required for [RadioBox](../../wiki/radiobox).
* [Font Awesome](http://fontawesome.io/) (4.4.0 or higher)
* [Bootstrap](http://getbootstrap.com/) (3.3.4 or higher)
* [Pikaday](https://github.com/dbushell/Pikaday) (1.3.2 or higher)  
Required for [DateBox](../../wiki/datebox).
* [Moment.js](http://momentjs.com/) (2.10.2 or higher)  
Required for [DateBox](../../wiki/datebox).
* [Select2](https://www.npmjs.com/package/select2) (3.5.1)  
Required for [SelectBox](../../wiki/selectbox).
* [Angular Select2](https://www.npmjs.com/package/angular-ui-select2) (0.0.5)  
Required for [SelectBox](../../wiki/selectbox).

## Download
Download it using npm:

`npm install marcura-ui --save`

## Getting started

Include third-party dependencies:

`<link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">`  
`<link href="node_modules/font-awesome/css/font-awesome.min.css" rel="stylesheet">`  
`<link href="node_modules/pikaday/css/pikaday.css" rel="stylesheet">`  
`<link href="node_modules/select2/select2.css" rel="stylesheet">`

`<script src="node_modules/jquery/dist/jquery.min.js"></script>`  
`<script src="node_modules/angular/angular.min.js"></script>`  
`<script src="node_modules/angular-sanitize/angular-sanitize.min.js"></script>`  
`<script src="node_modules/angular-ui-router/release/angular-ui-router.min.js"></script>`  
`<script src="node_modules/moment/min/moment.min.js"></script>`  
`<script src="node_modules/pikaday/pikaday.js"></script>`  
`<script src="node_modules/select2/select2.js"></script>`  
`<script src="node_modules/angular-ui-select2/src/select2.js"></script>`

Include Marcura UI assets:

`<link rel="stylesheet" href="node_modules/marcura-ui/dist/marcura-ui.min.css">`  
`<script src="node_modules/marcura-ui/dist/marcura-ui.min.js"></script>`

As soon as you've downloaded the package and included it in your page you need to declare a dependency on it:

`angular.module('app', ['marcuraUI']);`

## Documentation
Detailed documentation about all components and services can be found [here](../../wiki).

## Development

1. `npm install`
2. `gulp`

## Testing

`gulp test`
