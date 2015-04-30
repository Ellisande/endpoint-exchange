var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

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

app.post('/contract/add', function (req, res) {
  addContract.action(req, res);
});

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

//Turn on the server and listen.
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
