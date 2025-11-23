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

    // Prepare timestamp
    const timestamp = new Date(data.timestamp);
    const formattedTimestamp = Utilities.formatDate(
      timestamp,
      Session.getScriptTimeZone(),
      'dd/MM/yyyy HH:mm:ss'
    );

    // Check if this is an update (rowIndex provided)
    if (data.rowIndex) {
      // Update existing row
      sheet.getRange(data.rowIndex, 1).setValue(formattedTimestamp);
      sheet.getRange(data.rowIndex, 2).setValue(data.name);
      sheet.getRange(data.rowIndex, 3).setValue(data.attendance);

      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          message: 'RSVP updated successfully',
          isUpdate: true
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      // Check if user already submitted (by name)
      const allData = sheet.getDataRange().getValues();
      for (let i = 1; i < allData.length; i++) {
        const existingName = allData[i][1] ? allData[i][1].toString().trim().toLowerCase() : '';
        if (existingName === data.name.toLowerCase()) {
          // Update existing submission
          const rowIndex = i + 1; // 1-indexed
          sheet.getRange(rowIndex, 1).setValue(formattedTimestamp);
          sheet.getRange(rowIndex, 3).setValue(data.attendance);

          return ContentService
            .createTextOutput(JSON.stringify({
              status: 'success',
              message: 'RSVP updated successfully',
              isUpdate: true
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }

      // New submission - append row
      const rowData = [
        formattedTimestamp,
        data.name,
        data.attendance
      ];

      sheet.appendRow(rowData);

      // Auto-resize columns for better readability
      sheet.autoResizeColumns(1, 3);

      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          message: 'RSVP recorded successfully',
          isUpdate: false
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

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

// ===== HANDLE GET REQUESTS - Fetch Personalized Messages & Check Submission Status =====
function doGet(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const inviter = e.parameter.inviter;
    const checkSubmission = e.parameter.checkSubmission;

    // If checkSubmission parameter is provided, check if user already submitted
    if (checkSubmission && inviter) {
      const rsvpSheet = spreadsheet.getSheetByName(SHEET_NAME);

      if (rsvpSheet) {
        const data = rsvpSheet.getDataRange().getValues();

        // Search for existing submission (skip header row)
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const submittedName = row[1] ? row[1].toString().trim().toLowerCase() : '';
          const attendance = row[2] ? row[2].toString().trim() : '';

          // Match by inviter ID
          if (submittedName === inviter.toLowerCase()) {
            return ContentService
              .createTextOutput(JSON.stringify({
                status: 'success',
                hasSubmitted: true,
                attendance: attendance,
                rowIndex: i + 1 // Store row index for updates (1-indexed)
              }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
      }

      // No submission found
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          hasSubmitted: false
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Original functionality: fetch personalized message
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
      const urlParam = row[0] ? row[0].toString().trim().toLowerCase() : '';
      const displayName = row[1] ? row[1].toString().trim() : '';
      const customMessage = row[2] ? row[2].toString().trim() : '';

      // Case-insensitive match on URL parameter
      if (urlParam === inviter.toLowerCase() && customMessage) {
        return ContentService
          .createTextOutput(JSON.stringify({
            status: 'success',
            hasCustomMessage: true,
            inviter: displayName || row[0], // Use display name, fallback to URL param
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
    console.error('Error in doGet:', error);

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
    messagesSheet.appendRow(['URL Param', 'Display Name', 'Custom Message']);

    // Format headers
    const headerRange = messagesSheet.getRange(1, 1, 1, 3);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#010079');
    headerRange.setFontColor('#FFFFFF');

    // Add example data
    messagesSheet.appendRow([
      'minh',
      'Minh',
      'Bạn là người bạn thân thiết nhất của tôi từ năm nhất. Cảm ơn vì đã luôn bên tôi trong suốt hành trình này!'
    ]);

    messagesSheet.appendRow([
      'lan',
      'Lan Anh',
      'Không có bạn, tôi không thể vượt qua những kỳ thi khó khăn. Rất mong được gặp bạn tại buổi lễ!'
    ]);

    messagesSheet.appendRow([
      'tuan-nguyen',
      'Tuấn Nguyễn',
      'Những đêm thức khuya làm dự án cùng cậu là kỷ niệm không thể quên. Hẹn gặp cậu nhé!'
    ]);

    // Auto-resize columns
    messagesSheet.autoResizeColumns(1, 3);
    messagesSheet.setColumnWidth(1, 120); // URL Param
    messagesSheet.setColumnWidth(2, 150); // Display Name
    messagesSheet.setColumnWidth(3, 400); // Custom Message

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
