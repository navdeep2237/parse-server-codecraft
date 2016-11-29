var myApp = angular.module('myApp');

Parse.initialize("PartyOn");
Parse.serverURL="https://parse-webclient-test.herokuapp.com/parse";


myApp.controller('loginController',['$scope','$http','$location','$routeParams','$rootScope',function($scope, $http, $location, $routeParams,$rootScope){
	console.log('Login Controller Loaded');

		//-------------Get Current USer ------------------
		$scope.getCurrentUser= function(){

			var user= Parse.User.current();
			$scope.currentUserLogged= user;
			$scope.$apply();
			console.log("Got into the current user module" + currentUserLogged.get("username"));
		}

		//------------------------SignUp-------------------------------
        $scope.addUser = function(){
			console.log($scope.user1);

			var user = new Parse.User();	// creates a new user instance using the API
				user.set("username",$scope.user1.username);
			    user.set("password",$scope.user1.password);
			    user.set("email",$scope.user1.email);
			    user.set("companyName",$scope.user1.companyName);
			    // calling Javascript API
			    // eventually, this javascript method will call RestAPI
			    user.signUp().then(		//call it the first time setting up a user
				function success(user) {
					console.log("Signed Up ", user);
                              $("#myModal").modal('hide');        //hides the modal backdrop(else always its black)
							
				}, 
				function error(err) {
					alert("Error: " + err.code + " " + err.message);		
				}

				);

			//     // calling Rest API
			// $http({method : 'POST',url : 'http://localhost:1337/parse/users', headers: 
			//    { 
			//      'content-type': 'application/json',
			//      'X-Parse-REST-API-Key': 'party_rest',
			//      'X-Parse-Application-Id': 'PartyOn' }},$scope.user1)
			// 			//$http.post('http://localhost:1337/parse/users',$scope.user1)
			// 			.success(function(response){ 	//second parameter is what we want to post
			// 				console.log("signup called",$scope.user);
			// 				console.log("response");
							
							
			// 	window.location.href="#";		//redirect
			// });
		}  

	
		//----------------------login-----------------------------

		$scope.logUser = function(){
			console.log("login called");
			console.log($scope.user2);

			var user = new Parse.User();
		    Parse.User.logIn($scope.user2.username,$scope.user2.password).then(function success(user){
		      console.log("successfully logged in " + $scope.user2.username);
		      var currentUser = Parse.User.current();
		      console.log("the current User is " + currentUser.get("username"));
		     	//$rootScope.currentUser= currentUser;
		     	//console.log("current root user is " + $rootScope.currentUser.get("username"));
		      window.location.href="#/landing";
		     // if (currentUser){
		     // 	$rootScope.currentUser = currentUser;
		     // 	$location.path("/index");
		     // }
		    },function error(err){
		      console.error(err);
		    });
		}

		$scope.logout = function() {
			console.log("Logout called");

		 Parse.User.logOut().then(function(user){
		    console.log("successfully logged out");
		    window.location.href="#/logout";
		  });
		}

		// to check if the user is the current user or else redirect to login page
		//----------- authentication-----------------
		$scope.authUser = function(){
			var currentUser = Parse.User.current();
			// $scope.userName=false;
			if (currentUser) { 		//this works well when used as a single entity. 
				$rootScope.currentUser=currentUser;		// declared rootscope to be available at all pages
				// $scope.currentUserLogged= currentUser;
				// $scope.$apply();
			    // $scope.currentUser= currentUser;
			    //$scope.show=true;
			    // $scope.hide=function(value){
			    // 	if(currentUser){
			    // 		return true;
			    // 	} else{
			    // 		return false;
			    // 	}
			    // };
			    // $scope.$apply();
			    //$scope.userName=$scope.currentUser.get("username");
			    	
			    
			    //console.log("the current user is " + $rootScope.currentUser.get("username"));
			    //console.log("the show data is  " + $scope.data);
			} else {
				$rootScope.currentUser=false;
			    window.location.href="#/";
			    	//testing for ng-show
			}
		}

  		// --------------for testing the API and seeing if we get data from mongoDB
  		$scope.getPlayers = function(){
             $http({method : 'GET',url : 'http://localhost:1337/parse/classes/Player', headers: { 'X-Parse-Application-Id':'PartyOn'}})
           .success(function(data){
            $scope.players=data;
            console.log($scope.players);
            $scope.players1=$scope.players.results;
            console.log($scope.players1);
           });
      } 

      	//----------------------Add a brand-------------------------

		$scope.addBrand = function(){

			console.log($scope.brand1);

			var Brand = Parse.Object.extend("Brand");
			var user= Parse.User.current();

			console.log(user.objectId);
			var brand = new Brand();

			brand.set("name",$scope.brand1.name);
			brand.set("companyUrl",$scope.brand1.companyUrl);
			brand.set("imageUrl",$scope.brand1.imageUrl);
			brand.set("manufacturer",$scope.brand1.manufacturer);
			//brands.save();
			brand.set("user", user);
			brand.save(null,{
				success: function(obj){
					window.location.href="#/brands";
					console.log(obj);
					var brands = user.relation("brands");
					brands.add(brand);
					user.save();

				},
				error: function(err){
					console.error(err);
				}
			});
		
		}


      //------------------show brands------------------
      $scope.showBrands = function(){
      	var Brand = Parse.Object.extend("Brand");
      	var user = Parse.User.current();

      	var query = new Parse.Query("Brand");
      	query.equalTo("user", user);
      	query.find({
      		success: function(results){
      			console.log(results);
      			$scope.brands= results;
      			$scope.$apply();

      			console.log("this should be the brands object" + $scope.brands);

      		},
      		error: function(err){
      			console.error(err);
      		}
      	});
      }


      // -------------------------Brand Details(W) with find-------------------

      $scope.brandDetails = function(){
      	console.log("got into the brand details module " );

      	var Brand = Parse.Object.extend("Brand");

      	var query = new Parse.Query("Brand");
      
      	//var id = brand.id;		//gets the id through the ng-click directive on the page
      	var id= $routeParams.id;	// try and get the route params from the url
      	var brand = new Brand();	// creating a new brand object, don't actually need to do it
      	brand.id = id;
      	console.log("new object created ID " + brand);
      	
      	console.log("does this print the id " +id);
      	query.equalTo("objectId", brand.id);
      	query.find({
      	 	success: function(results){
      			console.log("the brand Id is " + id);
      			
      				$scope.brandDetails = results;	//pass it to view
      				$scope.$apply();
      				console.log("this is this particular object " + $scope.brandDetails);
      			
      		},
      		error: function(err){
      			console.error(err);
      		}
      	});

      }

      //---------------------Brand Details  with get for getting to edit(W)---------------

       $scope.brandDetails1 = function(){
      	console.log("got into the brand details1 module " );
      	//$("#editForm").prop('readonly', false);
      	$("#editForm").removeAttr('readonly');		// only for test purpose


      	var Brand = Parse.Object.extend("Brand");

      	var query = new Parse.Query("Brand");
      
      	//var id = brand.id;		//gets the id through the ng-click directive on the page
      	var id= $routeParams.id;	// try and get the route params from the url
      	var brand = new Brand();	// creating a new brand object, don't actually need to do it
      	brand.id = id;
      	console.log("new object created ID " + brand);
      	
      	console.log("does this print the id " +id);
      	query.equalTo("objectId", brand.id);
      	query.get(id).then(function(response){
      		var name=response.get("name");
      		var name1 = response.attributes.name; 
      		      		$scope.brandDetails= {
      			"name":response.get("name"),			// this seems to get rid of the read-only property
      			"imageUrl":response.get("imageUrl"),	//It gets the value out of the parseobjectsubclass and assigns individually
      			"companyUrl":response.get("companyUrl"),
      			"manufacturer":response.get("manufacturer")
      		};
      		
      		$scope.$apply();
      		console.log("brand if fetched", $scope.brandDetails);
      	});

      }
      //----------------------------Edit brand Details (W)------------

      $scope.updateBrand = function(){
      	console.log("got into the update module");
      	var Brand = Parse.Object.extend("Brand");
      	var query = new Parse.Query("Brand");
      	var brand= new Brand();

      		// brand.set("name", $scope.brandDetails.name);
      		// brand.set("imageUrl", $scope.brandDetails.imageUrl);
      		// brand.set("companyUrl",$scope.brandDetails.companyUrl);
      		// brand.set("manufacturer",$scope.brandDetails.manufacturer);
      		// brand.save();

      	var id = $routeParams.id;
      	console.log("The passed Id is"+ id);
      	query.equalTo("objectId", brand.id);
      	query.get(id).then(function(response){
      		response.set("name", $scope.brandDetails.name);			//Set the object attributes
      		response.set("imageUrl", $scope.brandDetails.imageUrl);		// don't forget to save
      		response.set("companyUrl",$scope.brandDetails.companyUrl);
      		response.set("manufacturer",$scope.brandDetails.manufacturer);
      		response.save();
      		console.log("the updated object is" + response);
      		window.location.href="#/brands"

      	});
      }

   	//------------------------Delete a brand----------------------
   	      $scope.deleteBrand = function(id){
      	console.log("got into the Delete module");
      	var Brand = Parse.Object.extend("Brand");
      	var query = new Parse.Query("Brand");
      	//var brand= new Brand();

      	//var id = $routeParams.id;
      	console.log("The passed Id is"+ id);
      	query.equalTo("objectId", id);
      	query.get(id).then(function(response){		//this works, wait for the callback to finish to refresh the page
      		response.destroy({						// this does not need a value to be passed, Don't do it
      			success: function(response){
      				window.location.href="#/brands";
      				console.log("destroyed");
      			},
      			error : function(err){
      				console.error(err);
      			}
      		});
      	});
      }
      //---------------- Picture Upload ------------------------------

      $scope.addPicture = function(){
      	// var selectedPic = element.files[0]
      	console.log("Got into the pictures module" );
      	var Picture = Parse.Object.extend("Picture");

            	
      	 var uploadedPic = $("#inputEl")[0]; 	//use jquery instead regular $scope 
	      	 console.log(uploadedPic);
	      	if(uploadedPic.files.length > 0){	//if the file is not null
      		var file = uploadedPic.files[0];	// since using file, [0] will get the first element
      		var name = file.name;		// name is automatic from file name
      		//console.log("file uploaded successfully" + name);
      		
      		var parseFile = new Parse.File(name, file);		//new file object, 
      		parseFile.save().then(function(){
      			console.log(parseFile.url());
      			$("#imageEl").attr("src", parseFile.url());

      			var picture = new Picture();
      			picture.set("image", parseFile);
                        //picture.set("name",parseFile.name);
      			picture.save().then(function(){
      				console.log(picture.id);
                              console.log(picture.name);
      				// adding the relation to brands
     //  				var brands = user.relation("brands");
					// brands.add(brand);
					// user.save();
      			});
      		});


      	}

      }


      //-----------------add picture relation on upload(W)--------------

         $scope.addPicture1 = function(){
      	// var selectedPic = element.files[0]
      	console.log("Got into the pictures relational module" );
      	var Picture = Parse.Object.extend("Picture");
      	var Brand = Parse.Object.extend("Brand");
      	var user = Parse.User.current();
      	var id = $routeParams.id;
      	console.log(id); 
            var gotText = $("inputText");
                        console.log("dummy input field"+ String(gotText));
                        //console.log("id for the text" + gotText.id);

      	var query = new Parse.Query(Brand);
      	// query.equalTo("objectId", id);		// this returns an array of objects
      	// query.find({
      	// 	success: function(results){
      	// 		$scope.something = results;
      	// 		console.log("The brand name is " + $scope.something.get("name") );
      	// 	},
      	// 	error: function(err){

      	// 	}
      	// });

      	//to get the whole object

      	// query.get(id,{					// this method gives NaN as a result
      	// 	success: function(brandName){
      	// 		var brandname = brandName.get("name");
      	// 		console.log("retrieved the object ", + brandName.id);
      	// 	},
      	// 	error: function(err){
      	// 		console.error(err);;
      	// 	}
      	// });

      	//to get the whole object using the promises way

      	query.get(id).then(function(brandName){
      		
      			console.log("I have reached till here "+ brandName.get("name"));
      			var uploadedPic = $("#inputEl")[0]; 	//use jquery instead regular $scope 
	      		console.log(uploadedPic);
                        var gotText = $("inputText");
                        console.log("dummy input filed 2"+gotText);

		      	if(uploadedPic.files.length > 0){	//if the file is not null
	      		var file = uploadedPic.files[0];	// since using file, [0] will get the first element
	      		var name = file.name;		// name is automatic from file name
	      		console.log("file uploaded successfully " + name);
	      		
	      		var parseFile = new Parse.File(name, file);		//new file object, 
	      		parseFile.save().then(function(){
	      			console.log(parseFile.url());
	      			$("#imageEl").attr("src", parseFile.url());

	      			var picture = new Picture();
	      			picture.set("image", parseFile);
	      			picture.set("brand",brandName);
	      			//changed for user(adding)
	      			picture.set("user",user);
                              name = name.substr(0,name.lastIndexOf('.'));    
                              
                              picture.set("name",name);           // to save the name of the file in the database 
	      			picture.save().then(function(){
	      				console.log(picture.id);
                                    // adding the relation to brands
	     				var pictures = brandName.relation("pictures");
						pictures.add(picture);
						brandName.save();
						//creating relation with the current user
						var pictures = user.relation("pictures");
						pictures.add(picture);
						user.save();
	      			});
	      		});

	     	}

      		},
      		function(err){
      			console.error(err);
      		});
      	
        }

        //================= add pictures with multi-part form data ---------------------------

         $scope.addPicture2 = function(){
            // var selectedPic = element.files[0]
            console.log("Got into the pictures relational module" );
            var Picture = Parse.Object.extend("Picture");
            var Brand = Parse.Object.extend("Brand");
            var user = Parse.User.current();
            var id = $routeParams.id;
            var picName= $scope.pictureName.name;
            var picDesc= $scope.pictureName.description;

            console.log("dummy for the name" + $scope.pictureName.name);
            console.log(id); 
            // var gotText = $("inputText");
            //             console.log("dummy input field"+ String(gotText));
                        //console.log("id for the text" + gotText.id);

            var query = new Parse.Query(Brand);
            // query.equalTo("objectId", id);         // this returns an array of objects
            // query.find({
            //    success: function(results){
            //          $scope.something = results;
            //          console.log("The brand name is " + $scope.something.get("name") );
            //    },
            //    error: function(err){

            //    }
            // });

            //to get the whole object

            // query.get(id,{                         // this method gives NaN as a result
            //    success: function(brandName){
            //          var brandname = brandName.get("name");
            //          console.log("retrieved the object ", + brandName.id);
            //    },
            //    error: function(err){
            //          console.error(err);;
            //    }
            // });

            //to get the whole object using the promises way

            query.get(id).then(function(brandName){
                  
                        console.log("I have reached till here "+ brandName.get("name"));
                        var uploadedPic = $("#inputEl")[0];       //use jquery instead of regular $scope 
                        console.log(uploadedPic);
                        //var gotText = $("inputText");
                        console.log("dummy input filed 2 "+ picName);

                        if(uploadedPic.files.length > 0){   //if the file is not null
                        var file = uploadedPic.files[0];    // since using file, [0] will get the first element
                        var name = file.name;         // name is automatic from file name
                        console.log("file uploaded successfully " + name);
                        
                        var parseFile = new Parse.File(name, file);           //new file object, 
                        parseFile.save().then(function(){
                              console.log(parseFile.url());
                              $("#imageEl").attr("src", parseFile.url());

                              var picture = new Picture();
                              picture.set("image", parseFile);
                              picture.set("brand",brandName);
                              //changed for user(adding)
                              picture.set("user",user);
                              picture.set("description",picDesc);
                              name = name.substr(0,name.lastIndexOf('.'));    //regex for removing the file extension from the name 
                              
                              picture.set("name",picName);           // to save the name of the file in the database 
                              picture.save().then(function(){
                                    console.log(picture.id);
                                   // console.log(picture.name);
                                    // adding the relation to brands
                              var pictures = brandName.relation("pictures");
                                    pictures.add(picture);
                                    brandName.save();
                                    //creating relation with the current user
                                    var pictures = user.relation("pictures");
                                    pictures.add(picture);
                                    user.save();
                                    window.location.reload();
                              });
                        });

            }

                  },
                  function(err){
                        console.error(err);
                  });
            
        }
         // ------------------- Show Pictures for particular brand -----------------------------
		      $scope.showPictures = function(){
		      	var picture = Parse.Object.extend("Picture");
		      	var brand = Parse.Object.extend("Brand");
		      	console.log("Reached into the Show pictures module");
		      	var query = new Parse.Query("Picture");
		      	var query1 = new Parse.Query("Brand");
		      	var id = $routeParams.id;

		      	query1.get(id).then(function(brandName){
		      		console.log("the brand name in show pictures is "+ brandName);
		      		query.equalTo("brand", brandName);
		      		query.find({
		      		success: function(results){
		      			console.log(results);
		      			
		      			$scope.pictures = results;
		      			//$scope.pictures1=$scope.pictures.attributes;
		      			$scope.$apply();
		      			// use this in browser to get the data {{picture.get('image').url()}}
		      			console.log(" this should be the picture object " + $scope.pictures);
		      		},
		      		error: function(err){
		      			console.error(err);
		      		}
		      	});

		      	},
		      	function(err){
		      		console.error(err);
		      	});
		      	
		      }


		    // //  ---------Delete A Picture---------------------


		           $scope.deletePicture = function(id){
      	console.log("got into the Delete picture module");
      	var Picture = Parse.Object.extend("Picture");
      	var query = new Parse.Query("Picture");
      	//var brand= new Brand();

      // 	var id = $routeParams.id;
      	console.log("The passed Id is "+ id);
      	query.equalTo("objectId", id);
      	query.get(id).then(function(response){		//this works, wait for the callback to finish to refresh the page
      		response.destroy({						// this does not need a value to be passed, Don't do it
      			success: function(response){
      				window.location.reload();             //reload the same page
      				console.log("destroyed");
      			},
      			error : function(err){
      				console.error(err);
      			}
      		});
      	});
      }

      // $scope.deletePicture = function(){
      // 	console.log("got into the Delete picture module");

      // 	var picture = Parsse.Object.extend("Picture");
      // 	var query= new Parse.Query("Picture");
      	
      // 	var id = $routeParams.id;
      // 	console.log("the picture id printed shoud be " + id);
      // 		query.equalTo("objectId", id);
      // 		query.find(id).then(function(response){
      // 			$scope.picture = response;
      // 			console.log("this is what I got with new module "+ response + $scope.picture);
      // 		});

      //}


      // $scope.deletePictures = function(){
      // 	console.log("got into the delete Pictures module " );

      // 	var Picture = Parse.Object.extend("Picture");

      // 	var query = new Parse.Query("Picture");
      
      // 	//var id = brand.id;		//gets the id through the ng-click directive on the page
      // 	var id= $routeParams.id;	// try and get the route params from the url
      // 	var picture = new Picture();	// creating a new picture object, don't actually need to do it
      // 	picture.id = id;
      // 	console.log("new object created ID " + picture);
      // 	console.log("the picture ID printed should be " + picture.id);
      	
      // 	// console.log("does this print the id " +id);
      // 	// query.equalTo("objectId", brand.id);
      // 	// query.find({
      // 	//  	success: function(results){
      // 	// 		console.log("the brand Id is " + id);
      			
      // 	// 			$scope.brandDetails = results;	//pass it to view
      // 	// 			$scope.$apply();
      // 	// 			console.log("this is this particular object " + $scope.brandDetails);
      			
      // 	// 	},
      // 	// 	error: function(err){
      // 	// 		console.error(err);
      // 	// 	}
      // 	// });

      //}

		  // -----------Show all pictures -----------------------
		  $scope.showPicturesAll = function(){
		  	var picture = Parse.Object.extend("Picture");
		  	var user = Parse.User.current();

		  	console.log("Reached into the show all pictures module");
		  	var query = new Parse.Query("Picture");

		  	query.equalTo("user", user);
		  	query.find({
		  		success: function(results){
		  			console.log("all the picture objects are here " + results);
		  			$scope.pictures = results;
		  			$scope.$apply();
		  			console.log("all the picture objects are here for the second time " + $scope.pictures);

		  		},
		  		error: function(err){

		  		}
		  	});
		  }

		  //--------------Add a trademark Relational-----------------

		   $scope.addTrademark = function(){
      	// var selectedPic = element.files[0]
      	console.log("Got into the Trademarks relational module" );
      	var Trademark = Parse.Object.extend("Trademark");
      	var Brand = Parse.Object.extend("Brand");
      	var user = Parse.User.current();
      	var id = $routeParams.id;
            var tradeName = $scope.trademarkName.name;
            var tradeDesc = $scope.trademarkName.description;

      	console.log(id); 

      	var query = new Parse.Query(Brand);
      	query.get(id).then(function(brandName){
      		
      			console.log("I have reached till here "+ brandName.get("name"));
      			var uploadedPic = $("#inputEl")[0]; 	//use jquery instead regular $scope 
	      		console.log(uploadedPic);

		      	if(uploadedPic.files.length > 0){	//if the file is not null
	      		var file = uploadedPic.files[0];	// since using file, [0] will get the first element
	      		var name = file.name;		// name is automatic from file name
	      		console.log("file uploaded successfully " + name);
	      		
	      		var parseFile = new Parse.File(name, file);		//new file object, 
	      		parseFile.save().then(function(){
	      			console.log(parseFile.url());
	      			$("#imageEl").attr("src", parseFile.url());

	      			var trademark = new Trademark();
	      			trademark.set("image", parseFile);
	      			trademark.set("brand",brandName);
	      			//changed for user(adding)
	      			trademark.set("user",user);
                              trademark.set("name",tradeName);
                              trademark.set("description", tradeDesc);
	      			trademark.save().then(function(){
	      				console.log(trademark.id);
	      				// adding the relation to brands
	     				var trademarks = brandName.relation("trademarks");
						trademarks.add(trademark);
						brandName.save();
						//creating relation with the current user
						var trademarks = user.relation("trademarks");
					trademarks.add(trademark);
						user.save();
                                    window.location.reload();
	      			});
	      		});

	     	}

      		},
      		function(err){
      			console.error(err);
      		});
      	
        }

        //---------------------- Show Trademarks for a particular brand -------------------

          $scope.showTrademarks = function(){
		      	var trademark = Parse.Object.extend("Trademark");
		      	var brand = Parse.Object.extend("Brand");
		      	console.log("Reached into the Show trademarks module");
		      	var query = new Parse.Query("Trademark");
		      	var query1 = new Parse.Query("Brand");
		      	var id = $routeParams.id;

		      	query1.get(id).then(function(brandName){
		      		console.log("the brand name in show pictures is "+ brandName);
		      		query.equalTo("brand", brandName);
		      		query.find({
		      		success: function(results){
		      			console.log(results);
		      			
		      			$scope.trademarks = results;
		      			$scope.$apply();
		      			// use this in browser view page to get the data {{picture.get('image').url()}}
		      			console.log(" this should be the picture object " + $scope.trademarks);
		      		},
		      		error: function(err){
		      			console.error(err);
		      		}
		      	});

		      	},
		      	function(err){
		      		console.error(err);
		      	});
		      	
		      }

		      //--------------------Show All Trademarks--------------
		        $scope.showTrademarksAll = function(){
		  	var trademark = Parse.Object.extend("Trademark");
		  	var user = Parse.User.current();

		  	console.log("Reached into the show all trademarks module");
		  	var query = new Parse.Query("Trademark");

		  	query.equalTo("user", user);
		  	query.find({
		  		success: function(results){
		  			console.log("all the trademark objects are here " + results);
		  			$scope.trademarks = results;
		  			$scope.$apply();
		  			console.log("all the picture objects are here for the second time " + $scope.trademarks);

		  		},
		  		error: function(err){

		  		}
		  	});
		  }
                  //--------------------Delete a trademark -----------------

                  $scope.deleteTrademark = function(id){
                        var trademark = Parse.Object.extend("Trademark");
                        console.log(" got into the delete trademark Module " + id );

                        var query = new Parse.Query("Trademark");

                        query.get(id).then(function(response){
                              response.destroy({
                                    success: function(response){
                                          window.location.reload();
                                          console.log("trademark destroyed");
                                    },error: function(err){
                                          console.error(err);
                                    }
                              });
                                    
                              
                        })
                  }



			      //test for Query With Dummy Data
			      $scope.showPlayers = function(){
			      	var Team = Parse.Object.extend("Team");
			      	var Player= Parse.Object.extend("Player");
			      
			      	var q = new Parse.Query("Player");
			      	q.equalTo("teamCode","MCFC");
			      	    	// this is the working code
			      	q.find({
			      		success: function(results){
			      			alert("successfully retrieved " + results.length +" names");
			      				$scope.something=results;
			      				$scope.$apply();
			      			// for (var i = 0; i<results.length ; i++){
			      			// 	var object = results[i];
			      			// 	console.log(object.id + '-' + object.get('teamCode'));
			      			// 		$scope.something=object;
			      			// 	$scope.$apply();
			      			// 	console.log($scope.something);
			      			// }
			      			console.log($scope.something);
			      			console.log(results);    			
			      		},
			      			error: function(error) {
			      				console.error(err);
			      		}
			      	});
			      	// q.get(Team, {
			      	// 			success: function(obj){
			      	// 				$scope.something2=obj;
			      	// 				console.log("got "+ obj.id);
			      	// 			},
			      	// 			error : function(obj,err){
			      	// 				console.error(err);
			      	// 			}
			      	// 		});

			      	// Team.save(null,{
			      	// 	success: function(obj){
			      	// 		console.log("successfully saved " + obj.id);
			      	// 		var q = new Parse.Query("Team");
			      			
			      	// 	}
			      	// });

			      	//

			      	// });

			  
			      	// q.get(Team.id,{
			      	// 	success: function(obj){
			      	// 		console.log("successfully got" + obj.id);
			      	// 	},
			      	// 	error function(obj, err) {
			      	// 		console.error(err);
			      	// 	}
			      	// });
      }

 

 }]);
    

