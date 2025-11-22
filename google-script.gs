// ============================================
// GOOGLE APPS SCRIPT FOR GRADUATION INVITATION RSVP
// ============================================
// This script receives form submissions and appends them to Google Sheets
// Deploy this as a Web App and use the URL in your website's script.js

// ===== CONFIGURATION =====
// The name of the sheet where data will be stored
const SHEET_NAME = 'RSVP Responses';
const MESSAGES_SHEET_NAME = 'Personalized Messages';

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

// ===== HANDLE GET REQUESTS - Fetch Personalized Messages =====
function doGet(e) {
  try {
    // Check if inviter parameter is provided
    const inviter = e.parameter.inviter;

    if (!inviter) {
      // No inviter specified, return default response
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          hasCustomMessage: false,
          message: null
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Get the spreadsheet and messages sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let messagesSheet = spreadsheet.getSheetByName(MESSAGES_SHEET_NAME);

    // If messages sheet doesn't exist, return no custom message
    if (!messagesSheet) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          hasCustomMessage: false,
          message: null
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Get all data from messages sheet
    const data = messagesSheet.getDataRange().getValues();

    // Skip header row and search for inviter
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const inviterName = row[0] ? row[0].toString().trim().toLowerCase() : '';
      const customMessage = row[1] ? row[1].toString().trim() : '';

      // Case-insensitive match
      if (inviterName === inviter.toLowerCase() && customMessage) {
        return ContentService
          .createTextOutput(JSON.stringify({
            status: 'success',
            hasCustomMessage: true,
            inviter: row[0],
            message: customMessage
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    // No matching inviter found
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        hasCustomMessage: false,
        message: null
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error fetching personalized message:', error);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        hasCustomMessage: false,
        message: null,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== UTILITY FUNCTION: Initialize Messages Sheet =====
function initializeMessagesSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let messagesSheet = spreadsheet.getSheetByName(MESSAGES_SHEET_NAME);

  if (!messagesSheet) {
    messagesSheet = spreadsheet.insertSheet(MESSAGES_SHEET_NAME);

    // Add headers
    messagesSheet.appendRow(['Inviter Name', 'Custom Message']);

    // Format headers
    const headerRange = messagesSheet.getRange(1, 1, 1, 2);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#010079');
    headerRange.setFontColor('#FFFFFF');

    // Add example data
    messagesSheet.appendRow([
      'Minh',
      'Bạn là người bạn thân thiết nhất của tôi từ năm nhất. Cảm ơn vì đã luôn bên tôi trong suốt hành trình này!'
    ]);

    messagesSheet.appendRow([
      'Lan',
      'Không có bạn, tôi không thể vượt qua những kỳ thi khó khăn. Rất mong được gặp bạn tại buổi lễ!'
    ]);

    // Auto-resize columns
    messagesSheet.autoResizeColumns(1, 2);
    messagesSheet.setColumnWidth(2, 400);

    SpreadsheetApp.getUi().alert('Personalized Messages sheet created with example data!');
  } else {
    SpreadsheetApp.getUi().alert('Personalized Messages sheet already exists.');
  }
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
