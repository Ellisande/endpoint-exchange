var registry = localRequire('database/registry');
var _ = require('lodash');
var versionUtils = localRequire('utils/version');

var spec = {}

var updateEndpoints = function(req, res){
  var provider_name = req.body.name;
  var provider_version = req.body.version;
  var endpointUpdates = req.body.endpoints || {default: req.body.endpoint};
  registry.findOne({name: provider_name}, function(err, provider){
    if(!provider || !provider.versions){
      return res.status(404).send("Unable to locate a registry entry for " + provider_name);
    }

    var versions = provider.versions || [];
    var version = _.find(versions, versionUtils.findVersion(provider_version))  || {version: provider_version};
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
  //TODO: update contracts after the registry is updated.
}

module.exports = {
  spec: spec,
  action: updateEndpoints
}
