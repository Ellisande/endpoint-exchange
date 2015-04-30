var registry = require('../../database/registry');
var contracts = require('../../database/contracts');
var versionUtils = localRequire('utils/version');
var uuid = localRequire('utils/uuid');
var swagger = require('swagger-node-express');

var sampleResponse = {"chat-service-2.0.3":{"api_key":"4040384b-79b7-4b19-bb8a-1364d5ea5ac7","provider_name":"chat-service","provider_version":"2.0.3","consumer_name":"epe","consumer_version":"1.0.0"}}

var spec = {
  "description" : "Creates a new contract between two application versions.",
  "path" : "/contract/add",
  "notes" : "Adds a contract between the consumer version and the provider version.",
  "summary" : "Add a contract",
  "method": "POST",
  "parameters" : [swagger.paramTypes.body("Contract", "object describing the name and version of the consumer for the contract", 'Contract', sampleResponse, true)],
  "type" : "Contract",
  "responseMessages" : [swagger.errors.notFound('provider_version')],
  "nickname" : "addContract"
}


var addContract = function(req, res){
  var consumer = req.body.consumer;
  console.log(req.body);
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
