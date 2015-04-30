var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var swagger = require("swagger-node-express").createNew(app);
app.use(bodyParser.json());
app.use('/apis', express.static('node_modules/swagger-ui/dist'));

// Sets up an convience method for requiring local modules.
global.localRequire = function(moduleName){
  return require(__dirname + "/" + moduleName);
}

//APIS
var addContract = localRequire('apis/contract/add');
var removeContract = localRequire('apis/contract/remove');
var cacheEndpoints = localRequire('apis/endpoint/cache');
var lookupEndpoint = localRequire('apis/endpoint/lookup');
var updateEndpoints = localRequire('apis/endpoint/update');
var createApplication = localRequire('apis/application/create');
var addApplicationVersion = localRequire('apis/application/version');
 

swagger.addModels(localRequire('model/app-model'));

swagger.addPost(addContract);

// app.post('/contract/add', function (req, res) {
//   addContract.action(req, res);
// });

app.post('/contract/remove', function(req, res){
  removeContract.action(req, res);
});

app.post('/endpoint/cache', function(req, res){
  cacheEndpoints.action(req, res);
});

app.get('/endpoint/lookup', function(req, res){
  lookupEndpoint.action(req, res);
});

app.post('/application/version', function(req, res){
  addApplicationVersion.action(req, res);
});

app.post('/application/create', function(req, res){
  createApplication.action(req, res);
});

app.post('/endpoint/update', function(req, res){
  updateEndpoints.action(req, res);
});

swagger.configureSwaggerPaths("", "/api-docs", "");
swagger.configure("http://localhost:3000", "0.1");

//Turn on the server and listen.
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
