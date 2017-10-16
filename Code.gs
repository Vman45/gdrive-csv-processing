/**
 * Entry point, the GET request to Webapp
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('form.html');
}

/**
 * Upload file handler
 */
function uploadAndProcess(theForm) {
   var folderName = theForm.theFolder;
   var fileBlob = theForm.theFile;

   if (fileBlob.length==0){
     throw new Error( "No file is choosen or it is empty" );
   }

   var folders = DriveApp.getFoldersByName(folderName);
   var folder = DriveApp.getRootFolder();
   if (folders.hasNext()){
       folder = folders.next();
   }

   var f= folder.createFile(fileBlob);
   createSheet(f, folder);
   return f.getName();
}

/**
 * List Folders
 */
function listFolders(){
  var allFolders = DriveApp.getFolders();
  var result = [];
  while (allFolders.hasNext())
  {
    result.push(allFolders.next().getName());
  }
  return result;
}

/**
 * Create Sheet from the give CSV file in the given folder
 */
function createSheet(file, folder){
  // Create new file w/o the extension '.csv'
  var csvName = file.getName();
  var sheetName = csvName;
  if (endsWith(csvName.toLowerCase(),'.csv')){
     sheetName = csvName.substr(0,csvName.length-4);
  }
  var ss = SpreadsheetApp.create(sheetName);
  // move to the same folder where CSV file is
  var temp = DriveApp.getFileById(ss.getId());
  folder.addFile(temp)
  DriveApp.getRootFolder().removeFile(temp)

  // get the main sheet
  var sheet = ss.getSheets()[0];

  // Copy from CSV into the destination
  var data = parseCsv(file);
  for (var i = 0; i < data.length; i++) {
    sheet.appendRow(data[i]);
  }
}

/**
 * Check if the string ends with the given suffix
 */
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/**
 * Parse CSV into 2D array
 */
function parseCsv(file){
  var content = file.getBlob().getDataAsString();
  var data = Utilities.parseCsv(content);
  Logger.log(data);
  // call process and return the data
  return processCsv(data);
}
