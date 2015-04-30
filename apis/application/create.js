var registry = localRequire('database/registry');
var registryValidator = localRequire('registry');

var spec = {}

var createApplication = function(req, res){
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
}

module.exports = {
  spec: spec,
  action: createApplication
}
