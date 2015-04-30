var contracts = localRequire('database/contracts');
var semver = require('semver');

var spec = {};

var cacheEndpoints = function(req, res){
  var consumerVersion = req.body.version;
  var consumerName = req.body.name;
  if(!consumerVersion || !consumerName){
    return res.status(400).send("You must provide a name and a version for the contracts you'd like to cache.");
  }
  contracts.find({
      consumer_name: consumerName
    }, function(err, contracts){
    if(err || !contracts || contracts.length == 0){
      return res.status(404).send("A contract does not exist for " + consumerName + '-' + consumerVersion);
    }

    var results = [];
    contracts.forEach(function(contract){
      if(semver.satisfies(contract.consumer_version, consumerVersion)){
        delete(contract._id);
        results.push(contract);
      }
    });
    return res.send(results);
  });
}

module.exports = {
  action: cacheEndpoints,
  spec: spec
}
