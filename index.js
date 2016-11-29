var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var mongo= require("mongodb");
var bodyParser = require('body-parser');
//var user = require('./cloud/controllers/user');


var databaseUri = "mongodb://partyon_admin:123321@ds019756.mlab.com:19756/partyon"//process.env.DATABASE_URI || process.env.MONGODB_URI; 

var api = new ParseServer({
	//**** General Settings ****//

	databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
	cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
	serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
	
	//**** Security Settings ****//
	// allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || false, 
	appId: process.env.APP_ID || 'PartyOn',
	masterKey: process.env.MASTER_KEY || 'partyOn_16', //Add your master key here. Keep it secret!	
	

});


var app = express();

app.use(express.static(path.join(__dirname+'/client')));

app.use(bodyParser.json());

// Serve static assets from the /public folder
//app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);
//app.get("/user/signup/:id",user.signUp);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
	res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

app.get('/test', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/test.html'));
});



var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
	console.log('parse-server-example running on port ' + port + '.');
});


// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);