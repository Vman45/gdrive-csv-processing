function doGet() {
  return HtmlService.createHtmlOutputFromFile('form.html');
}

function uploadAndProcess(theForm) {
   var folderName = theForm.theFolder;  // This is a string
   var fileBlob = theForm.theFile;         // This is a Blob.

    var folders = DriveApp.getFoldersByName(folderName);
    var folder = DriveApp.getRootFolder();
    if (folders.hasNext()){
       folder = folders.next();
    }

   var f= folder.createFile(fileBlob);
   createSheet(f, folder);
   return f.getName();
}

function listFolders(){
  var allFolders = DriveApp.getFolders();
  var result = [];
  while (allFolders.hasNext())
  {
    result.push(allFolders.next().getName());
  }
  return result;
}


function createSheet(file, folder){
  // Create new file w/o the extension '.csv'
  var csvName = file.getName();
  var ss = SpreadsheetApp.create(csvName.substr(0,csvName.length-4));
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

function parseCsv(file){
  var content = file.getBlob().getDataAsString();
  Logger.log(content);

  var data = Utilities.parseCsv(content);
  Logger.log(data);

  return processCsv(data);
}

function processCsv(data)
{
  // TODO : processing goes here
  return data;
}
