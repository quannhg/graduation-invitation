// ============================================
// GOOGLE APPS SCRIPT FOR GRADUATION INVITATION RSVP
// ============================================
// This script receives form submissions and appends them to Google Sheets
// Deploy this as a Web App and use the URL in your website's script.js

// ===== CONFIGURATION =====
// The name of the sheet where data will be stored
const SHEET_NAME = 'RSVP Responses';

// ===== MAIN FUNCTION TO HANDLE POST REQUESTS =====
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Get or create the sheet
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Add headers if sheet is new
      sheet.appendRow(['Timestamp', 'Name', 'Attendance Status']);
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, 3);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#010079');
      headerRange.setFontColor('#FFFFFF');
    }

    // Prepare row data
    const timestamp = new Date(data.timestamp);
    const formattedTimestamp = Utilities.formatDate(
      timestamp,
      Session.getScriptTimeZone(),
      'dd/MM/yyyy HH:mm:ss'
    );

    const rowData = [
      formattedTimestamp,
      data.name,
      data.attendance
    ];

    // Append the data to the sheet
    sheet.appendRow(rowData);

    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, 3);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'RSVP recorded successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error for debugging
    console.error('Error processing RSVP:', error);

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== HANDLE GET REQUESTS (Optional - for testing) =====
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'RSVP Web App is running. Use POST method to submit data.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== UTILITY FUNCTION: Get RSVP Statistics =====
// You can run this function manually to get statistics
function getRSVPStats() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    Logger.log('No RSVP data found');
    return;
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  const totalResponses = rows.length;
  const attending = rows.filter(row => row[2] === 'Có tham dự').length;

  Logger.log('=== RSVP STATISTICS ===');
  Logger.log('Total Responses: ' + totalResponses);
  Logger.log('Attending: ' + attending);
  Logger.log('=======================');

  return {
    totalResponses: totalResponses,
    attending: attending
  };
}

// ===== UTILITY FUNCTION: Clear All Data =====
// CAUTION: This will delete all RSVP data
function clearAllRSVPData() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Clear All Data',
    'Are you sure you want to delete ALL RSVP responses? This cannot be undone.',
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (sheet) {
      sheet.clear();
      sheet.appendRow(['Timestamp', 'Name', 'Attendance Status']);
      const headerRange = sheet.getRange(1, 1, 1, 3);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#010079');
      headerRange.setFontColor('#FFFFFF');

      ui.alert('All RSVP data has been cleared.');
    }
  }
}
