var registry = localRequire('database/registry');
var registryValidator = localRequire('registry');
var _ = require('lodash');
var validOptions = localRequire('models/options');

var spec = {}

var createApplication = function(req, res){
  var newApplication = _.pick(req.body, ['name', 'options']);
  if(_.isEmpty(newApplication.name)){
    return res.status(400).send("You must provide a name for the application you wish to create.");
  }
  if(!newApplication.options){
    newApplication.options = {};
  }
  newApplication.options = _.pick(newApplication.options, validOptions);
  registry.findOne({name: newApplication.name}, function(err, data){
    if(err){
      return res.status(400).send("The application you tried to create was not valid");
    }
    if(!data){
      newApplication.versions = [];
      create(newApplication);
      if(newApplication._id){
        delete(newApplication._id);
      }
      return res.status(200).send(newApplication);
    }
    update(newApplication, res);
  });
}

var create = function(newApplication){
  registry.insert(newApplication);
}

var update = function(newApplication, res){
  registry.update({name: newApplication.name}, {$set: {options: newApplication.options}});
  registry.findOne({name: newApplication.name}, function(err, data){
    if(data){
      delete(data._id);
      return res.send(data);
    }
    return res.status(500).send('Internal service error');
  });
}

module.exports = {
  spec: spec,
  action: createApplication
}
