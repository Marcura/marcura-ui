[npm-image]: https://img.shields.io/npm/v/marcura-ui.svg
[npm-url]: https://npmjs.org/package/marcura-ui
[downloads-image]: https://img.shields.io/npm/dm/marcura-ui.svg

# Marcura UI

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]

## Demos
https://marcura-ui.herokuapp.com/#/home

## Dependencies
* [jQuery](https://jquery.com/) (>=2.2.0)
* [Angular](https://angularjs.org/) (>=1.3.8)
* [Font Awesome](http://fontawesome.io/) (5.8.1)

## Optional dependencies
* [Angular Sanitize](https://www.npmjs.com/package/angular-sanitize) (1.3.8)  
Required for [Button](../../wiki/button), [RadioBox](../../wiki/radiobox), [Tooltip](../../wiki/tooltip).
* [Pikaday](https://github.com/dbushell/Pikaday) (1.3.2)  
Required for [DateBox](../../wiki/datebox).
* [Trix](https://github.com/basecamp/trix) (0.11.4)  
Required for [HtmlArea](../../wiki/htmlarea).

## Download
Download it using npm:

`npm install marcura-ui --save`

## Getting started

Include third-party dependencies:

```
<link href="node_modules/font-awesome/css/font-awesome.min.css" rel="stylesheet">
<link href="node_modules/pikaday/css/pikaday.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/trix/0.11.4/trix.css" rel="stylesheet">
```

```
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/angular/angular.min.js"></script>
<script src="node_modules/angular-sanitize/angular-sanitize.min.js"></script>
<script src="node_modules/pikaday/pikaday.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/trix/0.11.4/trix.js"></script>
```

Include Marcura UI assets:

```
<link rel="stylesheet" href="node_modules/marcura-ui/dist/marcura-ui.min.css">
<script src="node_modules/marcura-ui/dist/marcura-ui.min.js"></script>
```

As soon as you've downloaded the package and included it in your page you need to declare a dependency on it:

```
angular.module('app', ['marcuraUI']);
```

## Documentation
Detailed documentation about all components and services can be found [here](../../wiki).

## Development

1. `npm install`
2. `gulp`

## Testing

`gulp test`
