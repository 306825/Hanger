var controllers = require('./controllers');
var directives = require('./directives');
var services = require('./services');
var _ = require('underscore');

var components = angular.module('hanger-retail.components', ['ng']);

_.each(controllers, function(controller, name) {
  components.controller(name, controller);
});

_.each(directives, function(directive, name) {
  components.directive(name, directive);
});

_.each(services, function(factory, name) {
  components.factory(name, factory);
});

var app = angular.module('hanger-retail', ['hanger-retail.components', 'ngRoute', 'mgcrea.ngStrap']);

app.config(function($routeProvider) {
  $routeProvider.
    when('/category/:category', {
        templateUrl: '/B-examples/templates/category_view.html'
    }).
    when('/checkout', {
      template: '<checkout></checkout>'
    }).
    when('/product/:id', {
      template: '<product-details></product-details>'
    }).
    when('/loginpage',{
      templateUrl: '/B-examples/templates/login_form.html'
    }).
    when('/register',{
      templateUrl: '/B-examples/templates/register_page.html'
    }).
    when('/', {
      templateUrl: 'templates/home.html'
    }).
    when('/orders', {
      template: '<order-history></order-history>'
    }).
    otherwise({redirectTo: '/category/:shoes'});
});
