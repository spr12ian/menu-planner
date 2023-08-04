// 2023-08-03 06:57
// The entire contents of the iswWrappers.gs file should be copied into the client project
// and tested there

/**
 * Drop-in replacement for Logger.log that uses a spreadsheet backend instead.
 * 
 * The Logger replacement is based on code by Adam Morris classroomtechtools.ctt@gmail.com
 * https://github.com/classroomtechtools/modularLibrariesV8/blob/master/Logger/Logger.js
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 1) Requires V8 runtime
 2) Copy and paste code into project
 3) When auto is true (default), Logger.log will go to spreadsheet instead, much quicker
    * optionally set auto to false and use ReplaceLogger()
 4) View the log which will output the url of the spreadsheet created / used
 5) Same spreadsheet is reused on suqsequent runs
 6) If you want to specify which spreadsheet to output logs to, set auto to false and:
    ReplaceLogger(id='<id>');
    Optionally also provide tab name:
    ReplaceLogger(id='<id>', sheet='<sheetname>');

 * Details:
   // Copy and paste code into project. (Why not make it a proper library? Because to make it a drop-in replacement, it needs to have access to the global scope, which a library doesn't have)
   // use Logger.log as normal (when auto is true, else you need call to ReplaceLogger)
   Logger.log('Outputs to spreadsheet');
   // objects passed to Logger.log are pretty printed
   Logger.log({hi: 'hi', arr: ['wow', 234343]});
   // optionally, use Logger and string literals
   const where = 'spreadsheet';
   Logger`this will also output to ${where}`;

 */

// The ISW master copy of this file (iswWrappers.gs) can be found in the 'ISW Library Tests/Wrappers' project

(function (__g__) {

  class SS {
    constructor(id = null, sheetName) {
      this.id = id;
      this.sheetName = sheetName;
      this.spreadsheet = null;
      if (this.id === null)
        this.create();
      else
        console.log
      this.open();
    }

    append(text) {
      const row = this.getLogRow(text)

      this.sheet.appendRow(row)
    }

    create() {
      const [rows, cols] = [3, 2];
      this.spreadsheet = SpreadsheetApp.create('Logger', rows, cols);
      this.sheet = this.spreadsheet.getSheetByName(this.sheetName);
      this.id = this.spreadsheet.getId();
      this.freshStart()
    }

    freshStart() {
      this.sheet.clear()
      this.sheet.appendRow(['Message', 'Source', 'Date/Time'])
      if (ascending) {
        this.setupAscending();
      } else {
        this.setupDescending();
      }
    }

    getLogRow(text) {
      // first column of row should contain plaintext, or stringified version of itself
      const cell_a = (function (txt) {
        if (text instanceof String || typeof text === 'string')
          return text;
        else
          return JSON.stringify(text, null, 4);
      })(text);

      const cell_b = _getLineNumOfCallee();

      // second column of row should contain date in easy to read format
      const cell_c = (new Date()).toLocaleString();

      return [cell_a, cell_b, cell_c];
    }

    static new(...args) {
      return new SS(...args);
    }

    open() {
      if (isBound && SpreadsheetApp.getActive().getId() === this.id) {
        this.spreadsheet = SpreadsheetApp.getActive()
      } else {
        this.spreadsheet = SpreadsheetApp.openById(this.id);
      }
      this.sheet = this.spreadsheet.getSheetByName(this.sheetName);
      if (!this.sheet) {
        this.sheet = this.spreadsheet.insertSheet(this.sheetName, 0)
      }
      this.id = this.spreadsheet.getId();
      this.freshStart()
    }

    prepend(text) {
      const row = this.getLogRow(text)

      const data = [row];

      this.sheet.insertRowsAfter(1, data.length);
      this.sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    }

    setBorder(range, border) {
      range.setBorder(
        border.top,
        border.left,
        border.bottom,
        border.right,
        border.vertical,
        border.horizontal,
        border.colour,
        border.style);
    }

    setupAscending() {
      // draw a line whenever we've opened the file
      const border = {
        top: null,// border
        left: null, //no change
        bottom: true, //no change
        right: null, //no change
        vertical: null, //no change
        horizontal: null, //no change
        colour: '#ffffff',
        style: SpreadsheetApp.BorderStyle.THICK
      }
      const range = this.sheet.getRange(1, 1, 1, 3)

      this.setBorder(range, border)
    }

    setupDescending() {
      // draw a line whenever we've opened the file
      const border = {
        top: true,// border
        left: null, //no change
        bottom: null, //no change
        right: null, //no change
        vertical: null, //no change
        horizontal: null, //no change
        colour: '#ff0000',
        style: SpreadsheetApp.BorderStyle.THICK
      }
      const range = this.sheet.getRange(2, 1, 1, 3)

      this.setBorder(range, border)
    }

    get spreadsheetName() {
      return this.spreadsheet.getName();
    }

    get url() {
      return this.spreadsheet.getUrl();
    }

  }

  function _getErrorObject() {
    try { throw new Error('fake error') } catch (err) { return err; }
  }

  function _getLineNumOfCallee() {
    const err = _getErrorObject();
    const target_stack = err.stack.split("\n").slice(5);  // 5 because that's where it is in the stack
    //const index = caller_line.indexOf("at ");
    return '→ ' + target_stack.join("\n");
  }

  Logger_ = function (strings, ...values) {
    const text = strings.map((string, index) => `${string}${values[index] ? values[index] : ''}`);
    if (ascending) {
      ssObj.append(text.join(''));
    } else {
      ssObj.prepend(text.join(''));
    }
  }

  Logger_.log = function (text) {
    if (ascending) {
      ssObj.append(text);
    } else {
      ssObj.prepend(text);
    }
  }

  __g__.ReplaceLogger = function (id = null, sheet = 'Sheet1') {
    [state.id, state.sheet] = [id, sheet];

    if (state.id === null) {
      // pull in from properties, if available, remains null if not
      const props = userProperties();
      state.id = props.getProperty(newLoggerKey);
    }

    // either opens existing or creates new
    ssObj = SS.new(state.id, state.sheet);

    if (state.id === null) {
      state.id = ssObj.id;
      const props = userProperties();
      props.setProperty(newLoggerKey, state.id);
    }

    // Output with link
    Logger.log("Find logs at the following url:");
    Logger.log(`\n${ssObj.url}\n`);
    Logger.log(`\nFile name: ${ssObj.spreadsheetName}\n`);
    __g__.Logger = Logger_;
  };

  __g__.UnreplaceLogger = function () {
    __g__.Logger = __Logger__;
  };

  const __Logger__ = __g__.Logger;

  // Can set to false for log in reverse order
  const ascending = true

  // This will replace Logger. If set to false, you'll have to initialize the library with call to ReplaceLogger()
  const auto = true;

  let isBound = false

  // Shouldn't need to change this
  const newLoggerKey = '__getLogger__.id'

  // If for some reason you want to use a different spreadsheet each time, or for just one execution, can set reset to true
  const reset = false;

  // Used to allow openId compatibility. Amend spreadsheetId accordingly
  //const spreadsheetId = '1OKLfa9AjZH6Ocpjz8tRO03JsT_j2N7VOI-YcqbXUXz4'
  const sheetName = '_Logger'
  let spreadsheetId

  let ssObj = null
  const state = {}

  const userProperties = PropertiesService.getUserProperties

  try {
    spreadsheetId = SpreadsheetApp.getActive().getId()
    isBound = true
  } catch (exception) {
    console.log('SpreadsheetApp.getActive().getId() failed', exception.message)
  }

  if (reset) {
    userProperties().deleteProperty(newLoggerKey);
  }

  if (auto) {
    if (isBound && SpreadsheetApp.getActive().getId() === spreadsheetId) {
      ReplaceLogger(spreadsheetId, sheetName)
    } else {
      ReplaceLogger();
    }
  } else {
    if (isBound && SpreadsheetApp.getActive().getId() === spreadsheetId) {
      sheet = SpreadsheetApp.getActive().getSheetByName(sheetName)
      if (sheet) {
        SpreadsheetApp.getActive().deleteSheet(sheet)
      }
    }
  }
})(this);

// ISW wrappers

function _doNotRunThisFunction() {
  crash("Do Not Run This 'iswWrappers' Function")
}

function addDays(date, days) {
  return isw.addDays(date, days)
}

function crash(msg) {
  isw.crash(msg)
}

function createUiMenu(menuCaption, menuItemArray) {
  isw.createUiMenu(menuCaption, menuItemArray, logIt)
}

function difference(set, subset) {
  return isw.difference(set, subset)
}

function getActiveSpreadsheet() {
  return isw.getActiveSpreadsheet()
}

function getAmountAsGBP(amount) {
  return isw.getAmountAsGBP(amount)
}

function getDayName(date) {
  return isw.getDayName(date)
}

function getDayOfMonth(date) {
  return isw.getDayOfMonth(date)
}

function getFirstDateOfYear() {
  return isw.getFirstDateOfYear()
}

function getFirstRowRange(sheet) {
  return isw.getFirstRowRange(sheet)
}

function getFormattedDate(date, timeZone, format) {
  return isw.getFormattedDate(date, timeZone, format)
}

function getNewDate() {
  return isw.getNewDate()
}

function getOrdinalDate(date) {
  return isw.getOrdinalDate(date, logIt)
}

function getSeasonName(date) {
  return isw.getSeasonName(date)
}

function getToday(options) {
  return isw.getToday(options)
}

function getWeekDays() {
  return isw.getWeekDays()
}

function helloWorld() {
  logIt('Hello World!')
}

function isGSuiteUser() {
  const url = "https://www.googleapis.com/oauth2/v2/userinfo";
  const oAuthToken = ScriptApp.getOAuthToken();
  logIt("oAuthToken %s", oAuthToken);
  const params = {
    "method": "GET",
    "headers": {
      "Authorization": "Bearer " + oAuthToken
    },
    muteHttpExceptions: false // Convert to true when authorisation is sorted
  };

  const response = UrlFetchApp.fetch(url, params);
  logIt("response %s", response);

  const userInfo = JSON.parse(response);
  logIt("userInfo %s", userInfo);

  if (userInfo.hasOwnProperty("hd")) {
    logIt(userInfo.email + " is using GSuite");
    isGSuiteUser = true;
  } else {
    logIt(userInfo.name + " is NOT using G Suite");
    isGSuiteUser = false;
  }

  return isGSuiteUser;

}

function isSingleCell(range) {
  return isw.isSingleCell(range)
}

function isSuperset(set, subset) {
  return isw.isSuperset(set, subset)
}

function logBoolean(boolean, booleanName = '') {
  isw.logBoolean(boolean, booleanName, logIt)
}

function logArray(array, arrayName = '') {
  isw.logArray(array, arrayName, logIt)
}

function logDate(date, dateName = '') {
  isw.logDate(date, dateName, logIt)
}

function logFile(file, fileName = '') {
  isw.logFile(file, fileName, logIt)
}

function logEventObject(eventObject, triggerName = '') {
  isw.logEventObject(eventObject, triggerName, logIt)
}

function logIt(...parameters) {
  if (logItLevel) {
    if ([...parameters].length > 1) {
      crash(`logIt only expects 1 arguement not ${[...parameters].length}`)
    }
    isw.log(...[parameters], Logger.log)
  }
}

function logObject(object, objectName = '') {
  isw.logObject(object, objectName, logIt)
}

function logObjectArray(array, arrayName = '') {
  isw.logObjectArray(array, arrayName, logIt)
}

function logRange(range, rangeName = '') {
  isw.logRange(range, rangeName, logIt)
}

function logSet(uniqueCollection, uniqueCollectionName = '') {
  logIt(`logSet uniqueCollectionName: ${uniqueCollectionName}`)
  logIt(uniqueCollection instanceof Set)
  logIt(uniqueCollection.size)

  isw.logSet(uniqueCollection, uniqueCollectionName, logIt)
}

function logSheet(sheet, variableName = '') {
  isw.logSheet(sheet, variableName, logIt)
}

function logString(string, stringName = '') {
  isw.logString(string, stringName, logIt)
}

function logSpreadsheet(spreadsheet, variableName = '') {
  isw.logSpreadsheet(spreadsheet, variableName, logIt)
}

function logType(value, name = 'Value') {
  isw.logType(value, name, logIt)
}

// Returns an object with two properties: first and iterator
function setupDaysIterator(startDate) {
  return isw.setupDaysIterator(startDate)
}

function sendMeEmail(subject, body, options) {
  return isw.sendMeEmail(subject, body, options, logIt)
}

function sendEmail(recipient, subject, body, options) {
  return isw.sendEmail(recipient, subject, body, options, logIt)
}

function toast(msg, title, timeoutSeconds) {
  isw.toast(msg, title, timeoutSeconds)
}


let logItLevel = 0