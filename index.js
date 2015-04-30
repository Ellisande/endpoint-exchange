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

app.post('/version/add', function(req, res){
  var applicationToUpdate = req.body.application;
  if(!applicationToUpdate.name){
    throw "No name was provided. You must provide at least a name for the service to be increased";
  }
  registry.findOne({name: applicationToUpdate.name}, function(err, application){
    if(!application){
      return res.status(404).send(application.name + ' does not exist in the registry. Try adding it before attempting to update its version');
    }

    var currentVersion = semver.maxSatisfying(extractVersions(application.versions), "x.x.x");
    var newVersion = applicationToUpdate.version || semver.inc(currentVersion, "minor");

    var versionExists = _.find(application.versions, function(version){
      return version.version == newVersion;
    });
    if(versionExists){
      return res.status(400).send('Version ' + applicationToUpdate.version + ' already exists for ' + applicationToUpdate.name);
    }

    var versionObject = {
      version: newVersion,
      name: applicationToUpdate.name
    }
    registry.update({_id: application._id}, {$push: {versions: versionObject}});
    application.versions.push(versionObject);
    res.send(application);
  })
});

app.post('/application', function(req, res){
  var newApplication = req.body;
  registry.findOne({name: newApplication.name}, function(application){
    if(application){
      return res.status(400).send("An application named " + newApplication.name + " already exists.")
    }

    if(registryValidator(newApplication)){
      registry.insert(newApplication);
      return res.status(200).send(newApplication);
    }

    return res.status(400).send("The application you tried to create was not valid");
  });
});

app.post('/endpoint/update', function(req, res){
  var provider_name = req.body.name;
  var provider_version = req.body.version;
  var endpointUpdates = req.body.endpoints || {default: req.body.endpoint};
  registry.findOne({name: provider_name}, function(err, provider){
    if(!provider || !provider.versions){
      return res.status(404).send("Unable to locate a registry entry for " + provider_name);
    }

    var versions = provider.versions || [];
    var version = _.find(versions, findVersion(provider_version))  || {version: provider_version};
    if(!version.endpoints){
      version.endpoints = {};
    }
    for(var x in endpointUpdates){
      version.endpoints[x] = endpointUpdates[x];
    }
    var index = versions.indexOf(version);
    registry.update({_id: provider._id},
      {$set:
        {versions: versions}
      });
    return res.status(200).send(provider);
  });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
