class Config {
  constructor(menuPlanner) { //console.log("Config");
    this.menuPlanner = menuPlanner; //console.log(menuPlanner);
    this.readKeyValues();
    //console.log(this);
  }

  getDaysToShopFor() { //console.log("Config.getDaysToShopFor");
    const daysToShopForKey = "Days to shop for"; //console.log(daysToShopForKey);
    const daysToShopFor = this.getValue(daysToShopForKey); //console.log(daysToShopFor);
    return daysToShopFor;
  }

  getDefaultSheetName() { //console.log("Config.getDefaultSheetName");
    const defaultSheetName = "Config"; //console.log("defaultSheetName: [%s]", defaultSheetName);
    return defaultSheetName;
  }

  getKeyValues() { //console.log("Config.getKeyValues");
    return this.keyValues;
  }

  getSheet() { //console.log("Config.getSheet");  
    const sheet = this.menuPlanner.getActiveSpreadsheet().getSheetByName(this.getSheetName()); //console.log(sheet);
    return sheet;
  }

  getSheetName() { //console.log("Config.getSheetName");
    const sheetName = this.sheetName || this.getDefaultSheetName(); //console.log("sheetName: [%s]", sheetName);
    return sheetName;
  }

  getShoppingStartDate() { //console.log("Config.getShoppingStartDate");
    const shoppingStartDateKey = "Shopping start date"; //console.log(shoppingStartDateKey);
    const shoppingStartDate = this.getValue(shoppingStartDateKey).toDateString(); //console.log(shoppingStartDate);
    return shoppingStartDate;
  }

  getValue(key) { //console.log("Config.getValue");
    let value;
    //console.log(key);
    //console.log(this.keyValues);

    for (let i in this.keyValues) { //console.log(i);
      //console.log(this.keyValues[i]);
      //console.log(this.keyValues[i][0]);
      if (this.keyValues[i][0] === key) {
        value = this.keyValues[i][1]; //console.log("value [%s]", value);
        break;
      }
    }
  
    return value;
  }

  getWeekToShopFor() { //console.log("Config.getWeekToShopFor");
    const weekToShopForKey = "Week to shop for"; //console.log(weekToShopForKey);
    const weekToShopFor = this.getValue(weekToShopForKey); //console.log("weekToShopFor: [%s]", weekToShopFor);
    return weekToShopFor;
  }

  readKeyValues() { //console.log("Config.readKeyValues");
    const a1QuantityTypes = "Config!A2:B"; //console.log(a1QuantityTypes);
    this.keyValues = this.getSheet().getRange(a1QuantityTypes).getValues(); //console.log(this.keyValues);
    return this;
  }
}