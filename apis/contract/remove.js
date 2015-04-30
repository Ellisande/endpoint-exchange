var semver = require('semver');
var contracts = localRequire('database/contracts');

var spec = {}

var removeContract = function(req, res){
  var providerName = req.body.provider.name;
  var providerVersion = req.body.provider.version || 'x.x.x';
  var consumerName = req.body.consumer.name;
  var consumerVersion = req.body.consumer.version || 'x.x.x';
  var removedContracts = []
  contracts.find({provider_name: providerName, consumer_name: consumerName}, function(err, results){
    for(x in results){
      var contract = results[x];
      var satisfiesConsumer = semver.satisfies(contract.consumer_version, consumerVersion);
      var satisfiesProvider = semver.satisfies(contract.provider_version, providerVersion);
      if(satisfiesConsumer && satisfiesProvider){
        contracts.remove({_id: contract._id});
        removedContracts.push(results[x]);
      }
    }
    if(removedContracts.length > 0) return res.status(200).send(removedContracts);
    res.status(404).send("No contracts matched the provider criteria.");
  });
}

module.exports = {
  action: removeContract,
  spec: spec
}
