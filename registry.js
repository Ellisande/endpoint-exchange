var _ = require('lodash');
var registry = {
  "name": "chat-service",
  "versions": [
    {
      "version": "1.0.0",
      "endpoints": {
        "default": "http://www.chat-service.com/apis",
        "system:x": "http://beta.chat-service.com/apis"
      },
      "depracted": true
    },
    {
      "version": "1.0.1",
      "endpoints": {
        "default": "http://new.chat-service.com/apis"
      }
    },
    {
      "version": "2.0.0",
      "beta": true
    }
  ],
  "options": {
    "auto_update_compatible": true
  }
};

module.exports = function(application){
  var newKeys = Object.keys(application);
  var validKeys = Object.keys(registry);
  var diff = _.difference(newKeys, validKeys);
  return _.isEmpty(diff);
};
