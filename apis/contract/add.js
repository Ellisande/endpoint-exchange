var registry = require('../../database/registry');
var contracts = require('../../database/contracts');
var versionUtils = localRequire('utils/version');
var uuid = localRequire('utils/uuid');

var spec = {}

var addContract = function(req, res){
  var consumer = req.body.consumer;
  var requestedProvider = req.body.provider;

  registry.findOne({name: requestedProvider.name}, function(err, provider){
    if(err){
      return res.status(400).send("An unexpected error occured.");
    }
    var providedVersions = provider.versions;
    var providedVersion;
    if(!requestedProvider.version){
      providedVersion = providedVersions.sort(versionUtils.versionCompare)[0];
    } else {
      providedVersion = versionUtils.maxSatisfying(providedVersions, requestedProvider.version);
    }

    if(!providedVersion){
      return res.status(404).send(requestedProvider.version + " does not match a version provided by " + requestedProvider.name);
    }

    var newKey = uuid();
    var newContract = {
      api_key: newKey,
      provider_name: requestedProvider.name,
      provider_version: providedVersion.version,
      consumer_name: consumer.name,
      consumer_version: consumer.version,
      endpoints: providedVersion.endpoints
    }
    contracts.insert(newContract);
    var providerKey = newContract.provider_name + "-" + newContract.provider_version;
    var returnObject = {};
    delete(newContract._id);
    returnObject[providerKey] = newContract;
    return res.status(200).send(returnObject);
  });
}

module.exports = {
  action: addContract,
  spec: spec
}
