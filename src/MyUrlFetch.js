function MyUrlFetch() {
}

MyUrlFetch.prototype.fetch = function(url) {
  var response;
  try {
    response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  } catch (e) {
    response = this.getHTTPResponse();
    response.setError(e);
  }
  return response;
}

MyUrlFetch.prototype.getDefaultHTTPResponse = function() { console.log("MyUrlFetch.getDefaultHTTPResponse");
  return new MyHTTPResponse();
}

MyUrlFetch.prototype.getHTTPResponse = function() { console.log("MyUrlFetch.getHTTPResponse");
  if (typeof this.HTTPResponse === "undefined") {
    return this.setDefaultHTTPResponse();
  } else {
    return this.HTTPResponse;
  }
}

MyUrlFetch.prototype.getResponseCode = function(response) {
  var statusCode = response.getResponseCode();

  return statusCode;
}

MyUrlFetch.prototype.setDefaultHTTPResponse = function() { console.log("MyUrlFetch.setDefaultHTTPResponse");
  return this.setHTTPResponse(this.getDefaultHTTPResponse());
}

MyUrlFetch.prototype.setHTTPResponse = function(HTTPResponse) { console.log("MyUrlFetch.setHTTPResponse HTTPResponse: %s", HTTPResponse);
  this.validateHTTPResponse(HTTPResponse);
  this.HTTPResponse = HTTPResponse;
  return HTTPResponse;
}

MyUrlFetch.prototype.validateHTTPResponse = function(HTTPResponse) { console.log("MyUrlFetch.validateHTTPResponse HTTPResponse: %s", HTTPResponse);
  if (typeof HTTPResponse === "undefined") {
    throw new RangeError("HTTPResponse is undefined");
  }
}
