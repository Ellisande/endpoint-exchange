var registry = localRequire('database/registry');
var semver = require('semver');
var _ = require('lodash');
var versionUtils = localRequire('utils/version')

var spec = {};

var addVersion = function(req, res){
  var applicationToUpdate = req.body.application;
  if(!applicationToUpdate.name){
    throw "No name was provided. You must provide at least a name for the service to be increased";
  }
  registry.findOne({name: applicationToUpdate.name}, function(err, application){
    if(!application){
      return res.status(404).send(application.name + ' does not exist in the registry. Try adding it before attempting to update its version');
    }

    var currentVersion = semver.maxSatisfying(versionUtils.extractVersions(application.versions), "x.x.x");
    var newVersion = applicationToUpdate.version || semver.inc(currentVersion, "patch");

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
  });
  //TODO: update cache after version is added.
};

module.exports = {
  spec: spec,
  action: addVersion
}
