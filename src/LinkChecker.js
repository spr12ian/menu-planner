class LinkChecker{
  checkLinks(links) { //console.log("LinkChecker.checkLinks");
    let msg;
    let title;
    const failedLinks = [];
    const goodLinks = [];
    links.forEach(function(link) {
      const fetch = this.fetch(link);
      const statusCode = fetch.getResponseCode();
      if (statusCode === 200) {
        goodLinks.push([link, statusCode]);
      } else {
        failedLinks.push([link, statusCode, fetch.getError()]);
      }
    }, this);
  
    title = links.length + " links checked";
    if (failedLinks.length) {
      msg = failedLinks.length + " link(s) failed. " + goodLinks.length + " links OK.";
      failedLinks.forEach(function(link) {
        msg += ' ' + link[0] + ' ' + link[1] + ' ' + link[2];
        console.log(msg);
      });
    } else {
      msg = "All links OK";
    }
    this.toast(msg, title, 3);
  }

  fetch(url) {
    return this.getMyUrlFetch().fetch(url);
  }

  getDefaultMyUrlFetch() { //console.log("LinkChecker.getDefaultMyUrlFetch");
    return new MyUrlFetch();
  }

  getDefaultToastMessages() { //console.log("LinkChecker.getDefaultToastMessages");
    return [];
  }

  getMyUrlFetch() { //console.log("LinkChecker.getMyUrlFetch");
    if (typeof this.myUrlFetch === "undefined") {
      return this.setDefaultMyUrlFetch();
    } else {
      return this.myUrlFetch;
    }
  }

  getStatusCode(url) { //console.log("LinkChecker.getStatusCode");
    const statusCode = this.fetch(url).getResponseCode();

    return statusCode;
  }

  getToastMessages() { //console.log("LinkChecker.getToastMessages");
    if (typeof this.toastMessages === "undefined") {
      return this.setDefaultToastMessages();
    } else {
      return this.toastMessages;
    }
  }

  setDefaultToastMessages() { //console.log("LinkChecker.setDefaultToastMessages");
    return this.setToastMessages(this.getDefaultToastMessages());
  }

  setToastMessages(toastMessages) { //console.log("LinkChecker.setToastMessages toastMessages: %s", toastMessages);
    this.validatetoastMessages(toastMessages);
    this.toastMessages = toastMessages;
    return toastMessages;
  }

  validatetoastMessages(toastMessages) { //console.log("LinkChecker.validatetoastMessages toastMessages: %s", toastMessages);
    if (typeof toastMessages === "undefined") {
      throw new RangeError("toastMessages is undefined");
    }
  }

  toast(msg, title, timeoutSeconds) {
    const item = {
      'msg': msg, 
      'title': title, 
      'timeoutSeconds': timeoutSeconds
    };
    this.getToastMessages().push(item);
  }

  setDefaultMyUrlFetch() { //console.log("LinkChecker.setDefaultMyUrlFetch");
    return this.setMyUrlFetch(this.getDefaultMyUrlFetch());
  }

  setMyUrlFetch(myUrlFetch) { //console.log("LinkChecker.setMyUrlFetch myUrlFetch: %s", myUrlFetch);
    this.validatemyUrlFetch(myUrlFetch);
    this.myUrlFetch = myUrlFetch;
    return myUrlFetch;
  }

  validatemyUrlFetch(myUrlFetch) { //console.log("LinkChecker.validatemyUrlFetch myUrlFetch: %s", myUrlFetch);
    if (typeof myUrlFetch === "undefined") {
      throw new RangeError("myUrlFetch is undefined");
    }
  }
}