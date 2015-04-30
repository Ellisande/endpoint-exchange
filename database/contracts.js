var mongo = require('mongodb');
var db = require('monk')('localhost/registry');
var registry = db.get('contracts');

module.exports = registry;
