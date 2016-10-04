var myApp = angular.module('myApp',['ngRoute']); //initialize app, declare dependency

Parse.initialize("PartyOn");
Parse.serverURL="http://localhost:1337/parse";


myApp.config(function($routeProvider){
	$routeProvider.when('/',{
		controller:'loginController',
		templateUrl:'views/first.html'
	})
	.when('/register',{
		controller:'loginController',
		templateUrl:'views/register.html'
	})
	.when('/login',{
		controller:'loginController',
		templateUrl:'views/login.html'
	})
	.when('/index',{
		controller:'loginController',
		templateUrl:'views/index.html'
		//currentUser: true
		//requireAuth: true  // this is for checking if the user is logged in 
	})
	.when('/redirect',{
		controller:'loginController',
		templateUrl:'views/redirect.html'
	})
	.when('/landing',{
		controller:"loginController",
		templateUrl:'views/landing.html'
	})
	.when('/brands',{
		controller:"loginController",
		templateUrl:'views/brands.html'
	})
	.when('/pictures/:id',{
		controller:"loginController",
		templateUrl:'views/pictures.html'
	})
	.when('/brandDetails/:id',{
		controller:"loginController",
		templateUrl:'views/brandDetails.html'
	})
	.when('/pictures',{
		controller: "loginController",
		templateUrl: 'views/picturesAll.html'
	})
	.when('/trademarks/:id',{
		controller:"loginController",
		templateUrl:'views/trademarks.html'
	})
	.when('/trademarks',{
		controller: "loginController",
		templateUrl: 'views/trademarksAll.html'
	})
	.when('/thumbs',{
		controller: "loginController",
		templateUrl: 'views/thumbgallery.html'
	})
	.when('/brandEdit/:id',{
		controller: "loginController",
		templateUrl: 'views/editBrands.html'
	})
	.otherwise({
		redirectTo:'/'	//redirect when user hits wrong link
	});
});