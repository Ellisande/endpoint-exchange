var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var semver = require('semver');
app.use(bodyParser.json());

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

contracts = {
  'bb43f26d-e6c4-4031-97b8-d8360a727d20': {
    consumer_name: 'chat_ui',
    consumer_version: '1.x',
    provider_name: 'chat-service',
    provider_version: '2.x',
    api_key: 'bb43f26d-e6c4-4031-97b8-d8360a727d20',
    required_tags: [],
    endpoints: {
      default: 'http://chat.service.com',
      'system:x': 'http://test.service.com'
    }
  }
}

registry = {
  "chat-ui": {
    versions: {
      '1.x': {depracted: true},
      '2.0.0': {beta: true}
    },
    options: {
      allow_compatible: true,
      minor_versions_inherit: true
    }
  },
  "chat-service": {
    versions: {
      '1.0.0': {
        endpoints: {
          default: "http://www.chat-service.com/apis",
          'system:x': 'http://beta.chat-service.com/apis'
        },
        depracted: true
      },
      '1.0.1': {
        endpoints: {
          default: 'http://new.chat-service.com/apis'
        }
      },
      '2.0.0': {
        beta: true
      }
    },
    options: {
      auto_update_compatible: true
    }
  }
};

app.post('/contract/add', function (req, res) {
  var consumer = req.body.consumer;
  var requestedProvider = req.body.provider;
  if(registry[requestedProvider.name]){
    var provider = registry[requestedProvider.name];
    var providedVersions = Object.keys(provider.versions);
    var providedVersion;
    if(!requestedProvider.version){
      providedVersion = providedVersions.sort(semver.rcompare)[0];
    } else {
      providedVersion = semver.maxSatisfying(providedVersions, requestedProvider.version);
    }

    if(!providedVersion){
      res.send(400, requestedProvider.version + " does not match a version provided by " + requestedProvider.name);
      return;
    }

    var newKey = generateUUID();
    contracts[newKey] = {
      api_key: newKey,
      provider_name: provider.name,
      provider_version: providedVersion,
      consumer_name: consumer.name,
      consumer_version: consumer.version,
      required_tags: [],
      endpoints: provider.versions[providedVersion].endpoints
    }

  }

  res.send(200);
});

app.get('/endpoint/update', function(req, res){
  var consumerKey = req.query.api_key;
  var contract = contracts[consumerKey];
  if(!contracts[consumerKey]){
    return res.status(400).send("A contract does not exist for " + consumerKey);
  }
  return res.send(contract.endpoints);

});

app.post('/version/add', function(req, res){
  var newEntity = req.body;
  if(!newEntity.name || !registry[newEntity.name]){
    return res.status(400).send("No component with " + newEntity.name + " exists. Try creating a component first.");
  }
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
