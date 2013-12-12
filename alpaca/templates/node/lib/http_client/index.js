var request = require("request");

var client = module.exports;

client.AuthHandler = require("./auth_handler");
client.ErrorHandler = require("./error_handler");

client.RequestHandler = require("./request_handler");
client.ResponseHandler = require("./response_handler");

/**
 * Main HttpClient which is used by Api classes
 */
client.HttpClient = function (auth, options) {
{{if .Api.authorization.oauth}}
  if (typeof auth == "string") {
    auth = { "access_token": auth };
  }
{{end}}
  this.options = {
    "base": "{{.Api.base}}",{{with .Api.version}}
    "api_version": "{{.}}",{{end}}
    "user_agent": "alpaca/0.1.0 (https://github.com/pksunkara/alpaca)"
  };

  for (var key in options) {
    this.options[key] = options[key];
  }

  this.headers = {
    "User-Agent": this.options['user_agent']
  };

  if (this.options['headers']) {
    for (var key in this.options['headers']) {
      this.headers[key] = this.options['headers'][key];
    }

    delete this.options['headers'];
  }

  this.auth = new client.AuthHandler(auth);

  return this;
}

client.HttpClient.prototype.get = function (path, params, options, callback) {
  options['query'] = params;

  this.request(path, {}, 'GET', options, callback);
};

client.HttpClient.prototype.post = function (path, body, options, callback) {
  this.request(path, body, 'POST', options, callback);
};

client.HttpClient.prototype.patch = function (path, body, options, callback) {
  this.request(path, body, 'PATCH', options, callback);
};

client.HttpClient.prototype.delete = function (path, body, options, callback) {
  this.request(path, body, 'DELETE', options, callback);
};

client.HttpClient.prototype.put = function (path, body, options, callback) {
  this.request(path, body, 'PUT', options, callback);
};

/**
 * Intermediate function which does three main things
 *
 * - Transforms the body of request into correct format
 * - Creates the requests with give parameters
 * - Returns response body after parsing it into correct format
 */
client.HttpClient.prototype.request = function (path, body, method, options, callback) {
  var headers = {}, self = this;

  for (var key in this.options) {
    if (!options[key]) {
      options[key] = this.options[key];
    }
  }

  if (options['headers']) {
    headers = options['headers'];
    delete options['headers'];
  }

  for (var key in this.headers) {
    if (!headers[key]) {
      headers[key] = this.headers[key];
    }
  }

  var reqobj = {
    'url': path,
    'qs': options['query'] || {},
    'method': method,
    'headers': headers
  };

  delete options['query'];
  delete options['body'];

  if (method != "GET") {
    reqobj = this.setBody(reqobj, body, options);
  }

  reqobj = this.auth.set(reqobj);

  reqobj = this.createRequest(reqobj, options, function(err, response, body) {
    if (err) {
      return callback(err);
    }

    self.getBody(response, body, function(err, response, body) {
      if (err) {
        return callback(err);
      }

      client.ErrorHandler(response, body, function(err, response, body) {
        if (err) {
          return callback(err);
        }

        callback(null, body, response.statusCode, response.headers);
      });
    });
  });
};

/**
 * Creating a request with the given arguments
 *
 * If api_version is set, appends it immediately after host
 */
client.HttpClient.prototype.createRequest = function (reqobj, options, callback) {
  var version = (options['api_version'] ? '/' + options['api_version'] : '');
{{if .Api.response.suffix}}
  // Adds a suffix (ex: ".html", ".json") to url
  var suffix = (options['response_type'] ? options['response_type'] : "{{or .Api.response.formats.default "html"}}");
  reqobj['url'] = reqobj['url'] + '.' + suffix;
{{end}}
  reqobj['url'] = options['base'] + version + reqobj['url'];

  request(reqobj, callback);
};

/**
 * Get response body in correct format
 */
client.HttpClient.prototype.getBody = function (response, body, callback) {
  client.ResponseHandler.getBody(response, body, callback);
};

/**
 * Set request body in correct format
 */
client.HttpClient.prototype.setBody = function (request, body, options) {
  return client.RequestHandler.setBody(request, body, options);
};