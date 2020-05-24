function onOpen() {
  var mySpreadsheet = new MySpreadsheet();
  var dailyMenus = new DailyMenus(mySpreadsheet);
  mySpreadsheet.toast("Please wait while I do a few tasks", "Please wait!", 500);
  mySpreadsheet.createMenu();
  dailyMenus.goToTodaysMenu();
  mySpreadsheet.toast("You can do your thing now.", "I'm finished!", 30);
}