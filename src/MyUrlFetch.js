class MyUrlFetch {

  fetch(url) {
    let response;
    try {
      response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    } catch (e) {
      response = this.getHTTPResponse();
      response.setError(e);
    }
    return response;
  }

  getDefaultHTTPResponse() { //console.log("MyUrlFetch.getDefaultHTTPResponse");
    return new MyHTTPResponse();
  }

  getHTTPResponse() { console.log("MyUrlFetch.getHTTPResponse");
    if (typeof this.HTTPResponse === "undefined") {
      return this.setDefaultHTTPResponse();
    } else {
      return this.HTTPResponse;
    }
  }

  getResponseCode(response) {
    const statusCode = response.getResponseCode();
  
    return statusCode;
  }
  
  setDefaultHTTPResponse() { console.log("MyUrlFetch.setDefaultHTTPResponse");
    return this.setHTTPResponse(this.getDefaultHTTPResponse());
  }

  setHTTPResponse(HTTPResponse) { //console.log("MyUrlFetch.setHTTPResponse HTTPResponse: %s", HTTPResponse);
    this.validateHTTPResponse(HTTPResponse);
    this.HTTPResponse = HTTPResponse;
    return HTTPResponse;
  }

  validateHTTPResponse(HTTPResponse) { //console.log("MyUrlFetch.validateHTTPResponse HTTPResponse: %s", HTTPResponse);
    if (typeof HTTPResponse === "undefined") {
      throw new RangeError("HTTPResponse is undefined");
    }
  }
}