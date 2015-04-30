var contracts = localRequire('database/contracts');

var spec = {}

var lookupEndpoint = function(req, res){
  var apiKey = req.query.api_key;
  var tag = req.query.tag;
  contracts.findOne({api_key: apiKey}, function(err, contract){
    if(err || !contract || !contract.endpoints){
      return res.status(404).send("No contracts matched the provided api key / tag combination");
    }

    if(!tag || !contract.endpoints[tag] ){
      return res.send({endpoint: contract.endpoints.default});
    }

    return res.send({endpoint: contract.endpoints[tag]});
  });
}

module.exports = {
  action: lookupEndpoint,
  spec: spec
}
