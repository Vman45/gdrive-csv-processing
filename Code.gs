function doGet() {
  return HtmlService.createHtmlOutputFromFile('form.html');
}

function uploadAndProcess(theForm) {
   var anExampleText = theForm.anExample;  // This is a string
   var fileBlob = theForm.theFile;         // This is a Blob.

    var folders = DriveApp.getFoldersByName("csv-test");
    var folder = folders.next();

   var f= folder.createFile(fileBlob);
   createSheet(f, folder);
//   var adoc = DocsList.createFile(fileBlob);
   return f.getName();
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

  return data;
}


// test function
function open() {
  var folders = DriveApp.getFoldersByName("csv-test");
  var folder = folders.next();
  var files=folder.getFilesByType(MimeType.CSV);

   while (files.hasNext()) {
     var file = files.next();
     Logger.log(file.getName());
     createSheet(file, folder);
   }
}
