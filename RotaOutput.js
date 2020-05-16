class RotaOutput {
  constructor(mySpreadsheet) { //console.log("RotaOutput");
    this.mySpreadsheet = mySpreadsheet; //console.log("RotaOutput mySpreadsheet: %s", mySpreadsheet);
  }

  getDefaultSheetName() { //console.log("RotaOutput.getDefaultSheetName");
    const defaultSheetName = "Rota Output"; //console.log("defaultSheetName: [%s]", defaultSheetName);
    return defaultSheetName;
  }

  getMySpreadsheet() {
    return this.mySpreadsheet;
  }

  getSheetName() { //console.log("DailyMenus.getSheetName");
    const sheetName = this.sheetName || this.getDefaultSheetName(); //console.log("sheetName: [%s]", sheetName);
    return sheetName;
  }

  getSheet() { //console.log("DailyMenus.getSheet");  
    const sheet = this.mySpreadsheet.getActiveSpreadsheet().getSheetByName(this.getSheetName()); //console.log(sheet);
    return sheet;
  }
  
  setValues(values) {;
    const startRow = 1;
    const startColumn = 1;
    const howManyRows = values.length;
    const howManyColumns = values[0].length;

    this.getSheet().getRange(startRow, startColumn, howManyRows, howManyColumns).setValues(values);
  }
}
