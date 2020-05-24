class MyHTTPResponse {
  getDefaultResponseCode() { console.log("MyHTTPResponse.getDefaultResponseCode");
    return -1;
  }

  getResponseCode() { console.log("MyHTTPResponse.getResponseCode");
    if (typeof this.responseCode === "undefined") {
      return this.setDefaultResponseCode();
    } else {
      return this.responseCode;
    }
  }

  setDefaultResponseCode() { console.log("MyHTTPResponse.setDefaultResponseCode");
    return this.setResponseCode(this.getDefaultResponseCode());
  }

  setResponseCode(responseCode) { console.log("MyHTTPResponse.setResponseCode responseCode: %s", responseCode);
    this.validateResponseCode(responseCode);
    this.responseCode = responseCode;
    return responseCode;
  }

  validateResponseCode(responseCode) { console.log("MyHTTPResponse.validateResponseCode responseCode: %s", responseCode);
    if (typeof responseCode === "undefined") {
      throw new RangeError("responseCode is undefined");
    }
  }

  getDefaultError() { console.log("MyHTTPResponse.getDefaultError");
    return new Error();
  }

  getError() { console.log("MyHTTPResponse.getError");
    if (typeof this.error === "undefined") {
      return this.setDefaultError();
    } else {
      return this.error;
    }
  }

  setDefaultError() { console.log("MyHTTPResponse.setDefaultError");
    return this.setError(this.getDefaultError());
  }

  setError(error) { console.log("MyHTTPResponse.setError error: %s", error);
    this.validateResponseCode(error);
    this.error = error;
    return error;
  }

  validateError(error) { console.log("MyHTTPResponse.validateError error: %s", error);
    if (typeof error === "undefined") {
      throw new RangeError("error is undefined");
    }
  }
}