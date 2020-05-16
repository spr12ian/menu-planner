function copyFormat_(sourceRange, destinationRange) {
  //console.log("copyFormat_ START");
  const destinationSheet = destinationRange.getSheet();
  const startColumn = destinationRange.getColumn();
  const endColumn = destinationRange.getLastColumn();
  const startRow = destinationRange.getRow();
  const endRow = destinationRange.getLastRow();
  //console.log("startColumn = [%s]", startColumn);
  //console.log("endColumn = [%s]", endColumn);
  //console.log("startRow = [%s]", startRow);
  //console.log("endRow = [%s]", endRow);
  try {
    showCellFormat_(sourceRange);
    showCellFormat_(destinationRange);
    // copyFormatToRange(sheet, column, columnEnd, row, rowEnd)
    sourceRange.copyFormatToRange(destinationSheet, startColumn, endColumn, startRow, endRow);
    showCellFormat_(destinationRange);
  } catch (exception) {
    //console.log(exception);
  }
  //console.log("copyFormat_ FINISH");
}

function getActiveSpreadsheet_() {
  //console.log("getActiveSpreadsheet_ START");
  const activeSpreadsheet = SpreadsheetApp.getActive();
  //console.log(activeSpreadsheet);
  //console.log("getActiveSpreadsheet_ FINISH");
  return activeSpreadsheet;
}

function correctMenuFormats() {
  //console.log("correctMenuFormats START");
  correctDailyMenusFormat_();
  correctMealsFormat_();
  //console.log("correctMenuFormats FINISH");
}

function correctDailyMenusFormat_() {
  //console.log("correctDailyMenusFormat_ START");
  const sourceA1Range = "Daily Menus!A2:A2";
  const destinationA1Range = 'Daily Menus!B2:D';
  
  copyFormatByA1Ranges_(sourceA1Range, destinationA1Range);
  //console.log("correctDailyMenusFormat_ FINISH");
}

function correctMealsFormat_() {
  //console.log("correctMealsFormat_ START");
  const sourceA1Range = "Meals!A2:B2";
  const destinationA1Range = 'Meals!A3:B';
  
  copyFormatByA1Ranges_(sourceA1Range, destinationA1Range);
  //console.log("correctMealsFormat_ FINISH");
}

function copyFormatByA1Ranges_(sourceA1Range, destinationA1Range) {
  //console.log("copyFormatByA1Ranges_ START");
  //console.log(sourceA1Range);
  //console.log(destinationA1Range);
  const sourceRange = getActiveSpreadsheet_().getRange(sourceA1Range);
  const destinationRange = getActiveSpreadsheet_().getRange(destinationA1Range);
  copyFormat_(sourceRange, destinationRange);
  //console.log("copyFormatByA1Ranges_ FINISH");
}

function showCellFormat_(cell) {
  //console.log("showCellFormat START");
  //console.log(cell.getA1Notation());
  //console.log(cell.getValue());
  //console.log(cell.getFontColor());
  //console.log(cell.getFontFamily());
  //console.log(cell.getFontLine());
  //console.log(cell.getFontSize());
  //console.log(cell.getFontStyle());
  //console.log(cell.getFontWeight());
  showTextStyle_(cell);
  //console.log("showCellFormat FINISH");
}

function showTextStyle_(cell) {
  //console.log("showTextStyle_ START");
  //console.log(cell.getTextStyle().getFontFamily());
  //console.log(cell.getTextStyle().getFontSize());
  //console.log(cell.getTextStyle().getForegroundColor());
  //console.log(cell.getTextStyle().isBold());
  //console.log(cell.getTextStyle().isItalic());
  //console.log(cell.getTextStyle().isStrikethrough());
  //console.log(cell.getTextStyle().isUnderline());
  //console.log("showTextStyle_ FINISH");
}