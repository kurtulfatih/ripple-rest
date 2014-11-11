var _         = require('lodash');
var uuid      = require('node-uuid');
var serverlib = require('./../lib/server-lib');
var remote    = require('./../lib/remote.js');
var respond   = require('./../lib/response-handler.js');
var errors    = require('./../lib/errors.js');

module.exports.serverStatus = getServerStatus;

function getServerStatus(request, response, next) {
  serverlib.getStatus(remote, function(error, status) {
    if (error) {
      return next(new errors.RippledNetworkError(error.message));
    }

    respond.success(response, _.extend({
      api_documentation_url: 'https://github.com/ripple/ripple-rest'
    }, status));
  });
};

/**
 *  Check server connectivity.  If we hit this method it means the server is
 *  connected, as per middleware
 */

module.exports.isConnected = getServerConnected;

function getServerConnected(request, response, next) {
  respond.success(response, { connected: true });
};

/**
 * Get UUID, for use by the client as transaction identifier
 */

module.exports.uuid = getUUID;

function getUUID(request, response, next) {
  respond.success(response, { uuid: uuid.v4() });
};

/**
 * Get the current transaction fee
 */

module.exports.fee = getFee;

function getFee(request, response, next) {
  var fee = remote.createTransaction()._computeFee();

  respond.success(response, { fee: fee });
};
