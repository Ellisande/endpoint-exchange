var mongo = require('mongodb');
var db = require('monk')('localhost/registry');
var registry = db.get('registry');

module.exports = registry;
