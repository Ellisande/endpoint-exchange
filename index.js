var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var semver = require('semver');
var mongo = require('mongodb');
var db = require('monk')('localhost/registry');
var registry = db.get('registry');
var contracts = db.get('contracts');
var registryValidator = require('./registry');
var _ = require('lodash');
var ansyc = require('async');
app.use(bodyParser.json());

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

var findVersion = function(versionToMatch){
  return function(version){
    return versionToMatch == version.version;
  }
}

var versionComapre = function(lhs, rhs){
  return semver.rcompare(lhs.version, rhs.version);
}

var extractVersions = function(providedVersions){
  return _.map(providedVersions, function(version){
    return version.version;
  });
}

var maxSatisfying = function(providedVersions, requestedVersion){
  var extractedVersions = extractVersions(providedVersions);

  var max = semver.maxSatisfying(extractedVersions, requestedVersion);
  var maxSatisfyingVersion = _.find(providedVersions, function(version){
    return version.version == max;
  });
  return maxSatisfyingVersion;
}

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

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

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
