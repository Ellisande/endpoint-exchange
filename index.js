var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var semver = require('semver');
var mongo = require('mongodb');
var db = require('monk')('localhost/registry');
var registry = db.get('registry');
var contracts = db.get('contract');
var _ = require('lodash');
app.use(bodyParser.json());

var versionComapre = function(lhs, rhs){
  return semver.rcompare(lhs.version, rhs.version);
}

var maxSatisfying = function(providedVersions, requestedVersion){
  var extractedVersions = _.map(providedVersions, function(version){
    return version.version;
  });

  var max = semver.maxSatisfying(extractedVersions, requestVersion);
  var maxSatisfyingVersion = _.find(providedVersions, function(version){
    return version.version == max;
  });
  return maxSatisfyingVersion;
}

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

registry = [{
  name: "chat-ui",
  versions: [
    {
      version: "1.x",
      depracted: true
    },
    {
      version: "2.0.0",
      beta: true
    }
  ],
  options: {
    allow_compatible: true,
    minor_version_inherit: true
  }},
  {
    name: "epm",
    versions: [
      {
        version: "1.x",
        depracted: true
      },
      {
        version: "2.0.0",
        beta: true
      }
    ]
  },
  {
    name: "chat-service",
    versions: [
      {
        version: "1.0.0",
        endpoints: {
          default: "http://www.chat-service.com/apis",
          "system:x": "http://beta.chat-service.com/apis"
        },
        depracted: true
      },
      {
        version: "1.0.1",
        endpoints: {
          default: "http://new.chat-service.com/apis"
        }
      },
      {
        version: "2.0.0",
        beta: true
      }
    ],
    options: {
      auto_update_compatible: true
    }
  }
];

app.post('/contract/add', function (req, res) {
  var consumer = req.body.consumer;
  var requestedProvider = req.body.provider;
  registry.findOne({name: requestedProvider.name}, function(err, provider){
    var providedVersions = Object.keys(provider.versions);
    var providedVersion;
    if(!requestedProvider.version){
      providedVersion = providedVersions.sort(versionCompare)[0];
    } else {
      providedVersion = maxSatisfying(providedVersions, requestedProvider.version);
    }

    if(!providedVersion){
      res.send(400, requestedProvider.version + " does not match a version provided by " + requestedProvider.name);
      return;
    }

    var newKey = generateUUID();
    contracts[newKey] = {
      api_key: newKey,
      provider_name: requestedProvider.name,
      provider_version: providedVersion.version,
      consumer_name: consumer.name,
      consumer_version: consumer.version,
      required_tags: [],
      endpoints: providedVersion.endpoints
    }
  })

  var providerKey = contracts[newKey].provider_name + "-" + contracts[newKey].provider_version;
  var returnObject = {};
  returnObject[providerKey] = contracts[newKey];
  res.status(200).send(returnObject);
});

app.get('/endpoint/update', function(req, res){
  var consumerKey = req.query.api_key;
  var contract = contracts[consumerKey];
  if(!contracts[consumerKey]){
    return res.status(400).send("A contract does not exist for " + consumerKey);
  }
  return res.send(contract.endpoints);

});

app.get('/endpoint/lookup', function(req, res){
  var apiKey = req.query['api-key'];
  var tag = req.query.tag;
  var contract = contracts[apiKey];
  if(contract){
    if(!tag){
      return res.send(contract.endpoints.default);
    }

    return res.send(contract.endpoints[tag]);
  }

  res.status(400).send("No contracts matched the provided api key / tag combination");
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
