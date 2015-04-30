var _ = require('lodash');
var semver = require('semver');

var findVersion = function(versionToMatch){
  return function(version){
    return versionToMatch == version.version;
  }
}

var versionComapre = function(lhs, rhs){
  return semver.rcompare(lhs.version, rhs.version);
}

var extractVersions = function(providedVersions){
  return _.map(providedVersions, function(version){
    return version.version;
  });
}

var maxSatisfying = function(providedVersions, requestedVersion){
  var extractedVersions = extractVersions(providedVersions);

  var max = semver.maxSatisfying(extractedVersions, requestedVersion);
  var maxSatisfyingVersion = _.find(providedVersions, function(version){
    return version.version == max;
  });
  return maxSatisfyingVersion;
}

module.exports = {
  findVersion: findVersion,
  versionComapre: versionComapre,
  extractVersions: extractVersions,
  maxSatisfying: maxSatisfying
}
