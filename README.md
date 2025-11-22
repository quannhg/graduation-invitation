# 🎓 University Graduation Invitation Website

An elegant, traditional Vietnamese-style graduation ceremony invitation website for **Nguyễn Hồng Quân** with integrated RSVP functionality connected to Google Sheets.

## 📋 Table of Contents

- [Features](#features)
- [Design](#design)
- [Setup Instructions](#setup-instructions)
  - [Part 1: Google Sheets Setup](#part-1-google-sheets-setup)
  - [Part 2: Website Deployment](#part-2-website-deployment)
- [Customization](#customization)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

- **Elegant Design**: Polite, intimate, and traditional Vietnamese aesthetic
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **RSVP Form**: Collects guest names and attendance confirmation
- **Google Sheets Integration**: Automatically stores responses in a spreadsheet
- **Personalized Messages**: Display custom messages for specific guests via URL parameters
- **Form Validation**: Ensures all required fields are filled correctly
- **User Feedback**: Shows success/error messages after form submission
- **Privacy-Focused**: No API keys exposed in frontend code

---

## 🎨 Design

**Color Palette:**
- Navy: `#010079`
- White: `#FFFFFF`
- Gold: `#D5AD36`
- Red-Orange: `#DC582A`

**Typography:**
- Headings: Playfair Display
- Body: Lora, Noto Serif

---

## 🚀 Setup Instructions

### Part 1: Google Sheets Setup

#### Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Rename it to "Graduation RSVP - Nguyễn Hồng Quân" (or any name you prefer)
4. Keep this tab open - you'll need it in the next steps

#### Step 2: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any code in the editor
3. Copy the entire contents of `google-script.gs` from this project
4. Paste it into the Apps Script editor
5. Click the **Save** icon (💾) or press `Ctrl+S` / `Cmd+S`
6. Name your project "RSVP Form Handler" (or any name you prefer)

#### Step 3: Deploy as Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Select **Web app**
4. Configure the deployment:
   - **Description**: "RSVP Form v1"
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone** (this is safe - the script only accepts POST requests)
5. Click **Deploy**
6. **Important**: You'll see an authorization screen:
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to [Your Project Name] (unsafe)**
   - Click **Allow**
7. Copy the **Web app URL** (looks like: `https://script.google.com/macros/s/...../exec`)
8. **Save this URL** - you'll need it in the next part!

---

### Part 2: Website Deployment

You have multiple options for deploying your website. Choose one:

---

#### **Option A: Netlify (Recommended - Easiest)**

##### Step 1: Prepare Your Files

1. Update `script.js`:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_COPIED_WEB_APP_URL_HERE';
   ```
   Replace `YOUR_COPIED_WEB_APP_URL_HERE` with the URL you copied from Google Apps Script.

2. Make sure you have these files:
   - `index.html`
   - `styles.css`
   - `script.js`

##### Step 2: Deploy to Netlify

**Method A: Drag and Drop (No account needed initially)**

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag and drop the folder containing your three files
3. Netlify will give you a random URL like `https://random-name-12345.netlify.app`
4. Done! Your site is live.

**Method B: Using Git (Recommended for version control)**

1. Sign up for a free account at [Netlify](https://app.netlify.com/signup)
2. Install Git if you haven't already
3. In your project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial graduation invitation website"
   ```
4. Create a GitHub repository and push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
5. In Netlify:
   - Click **Add new site** → **Import an existing project**
   - Connect to GitHub and select your repository
   - Click **Deploy site**
6. Your site will be live at `https://your-site-name.netlify.app`

##### Step 3: Custom Domain (Optional)

1. In Netlify, go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow instructions to connect your own domain

---

#### **Option B: GitHub Pages + Google Apps Script**

##### Step 1: Prepare Your Files

1. Update `script.js` with your Google Apps Script URL (as shown in Option A)

##### Step 2: Create GitHub Repository

1. Create a new repository on [GitHub](https://github.com/new)
2. Name it `graduation-invitation` (or any name)
3. Set it to **Public**
4. Don't add README, .gitignore, or license yet
5. Click **Create repository**

##### Step 3: Push Your Code

```bash
cd graduation-invitation
git init
git add .
git commit -m "Initial commit: Graduation invitation website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/graduation-invitation.git
git push -u origin main
```

##### Step 4: Enable GitHub Pages

1. In your GitHub repository, go to **Settings** → **Pages**
2. Under "Source", select **main** branch
3. Click **Save**
4. Your site will be published at `https://YOUR_USERNAME.github.io/graduation-invitation/`
5. Wait 2-3 minutes for the site to go live

---

#### **Option C: Vercel**

##### Step 1: Prepare Your Files

1. Update `script.js` with your Google Apps Script URL (as shown in Option A)

##### Step 2: Deploy to Vercel

1. Sign up at [Vercel](https://vercel.com/signup)
2. Install Vercel CLI (optional) or use the web interface:
   ```bash
   npm i -g vercel
   ```
3. From your project folder, run:
   ```bash
   vercel
   ```
4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `graduation-invitation`
   - Directory? `./`
   - Override settings? **N**
5. Your site will be live at `https://graduation-invitation.vercel.app`

**Alternative: Web Interface**

1. Go to [Vercel](https://vercel.com/new)
2. Import your GitHub repository
3. Click **Deploy**

---

## 🎨 Customization

### Changing Event Details

Edit `index.html`:

```html
<!-- Change graduate name -->
<h1 class="graduate-name">Your Name Here</h1>

<!-- Change event time -->
<p>Your Time Here</p>

<!-- Change location -->
<p>Your Location Here</p>
```

### Changing Colors

Edit `styles.css`:

```css
:root {
    --navy: #010079;       /* Main dark color */
    --gold: #D5AD36;       /* Accent gold */
    --red-orange: #DC582A; /* Secondary accent */
    --white: #FFFFFF;      /* Background */
}
```

### Changing Personal Message

Edit the message section in `index.html`:

```html
<p class="message-text">
    Your personal message here...
</p>
```

### Setting Up Personalized Messages for Guests

You can create custom messages for specific guests that appear when they visit a personalized URL.

#### Step 1: Create Personalized Messages Sheet

1. Open your Google Spreadsheet
2. In the Apps Script editor, select the function `initializeMessagesSheet`
3. Click **Run** (▶️)
4. A new sheet called "Personalized Messages" will be created with example data

#### Step 2: Add Custom Messages

In the "Personalized Messages" sheet, add rows with:

| Inviter Name | Custom Message |
|--------------|----------------|
| Minh | Bạn là người bạn thân thiết nhất của tôi từ năm nhất. Cảm ơn vì đã luôn bên tôi! |
| Lan | Không có bạn, tôi không thể vượt qua những kỳ thi khó khăn. |

#### Step 3: Share Personalized Links

Send personalized URLs to your guests:

```
https://your-website.com/?inviter=Minh
https://your-website.com/?inviter=Lan
```

**How it works:**
- When someone visits with `?inviter=Name` parameter, the script fetches their custom message
- If found, the first paragraph is replaced with their personalized message
- If not found or no parameter, the default message is shown
- The signature adds "Gửi đến [Name]" for a personal touch

**Tips:**
- Names are case-insensitive (Minh = minh = MINH)
- Use URL encoding for names with spaces: `?inviter=Nguyen%20Van%20A`
- Leave the "Custom Message" column empty to use default message

---

## 🧪 Testing

### Test Checklist

- [ ] **Visual Check**: Open the website in a browser and verify:
  - All sections display correctly
  - Colors match the design
  - Text is readable
  - Images load properly

- [ ] **Responsive Check**: Test on different devices:
  - Desktop (1920x1080)
  - Tablet (768x1024)
  - Mobile (375x667)

- [ ] **Form Validation**:
  - Try submitting empty form → Should show validation error
  - Try submitting without checkbox → Should show validation error
  - Try submitting with valid data → Should show success message

- [ ] **Google Sheets Integration**:
  - Submit a test RSVP
  - Check your Google Sheet
  - Verify the data appears correctly with:
    - Timestamp
    - Name
    - Attendance status

- [ ] **Personalized Messages**:
  - Create test entries in "Personalized Messages" sheet
  - Visit `your-website.com/?inviter=TestName`
  - Verify custom message appears
  - Visit without parameter → Should show default message

- [ ] **Cross-Browser Testing**:
  - Chrome
  - Firefox
  - Safari
  - Edge

---

## 🔧 Troubleshooting

### Problem: Form submits but data doesn't appear in Google Sheets

**Solution:**
1. Check if the Google Apps Script URL is correct in `script.js`
2. Verify the Web App is deployed as "Anyone" can access
3. Check the Google Apps Script logs:
   - Open Apps Script editor
   - Click **Executions** (left sidebar)
   - Look for errors

### Problem: "Vui lòng cấu hình Google Apps Script URL" error

**Solution:**
You forgot to update the `GOOGLE_SCRIPT_URL` in `script.js`. Replace:
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```
with your actual URL.

### Problem: Form shows error message after submission

**Solution:**
1. Open browser developer console (F12)
2. Look for error messages
3. Common issues:
   - CORS errors: Normal with `no-cors` mode - ignore if data still saves
   - Network errors: Check your internet connection
   - 404 errors: Wrong Google Apps Script URL

### Problem: Website looks broken on mobile

**Solution:**
1. Clear browser cache
2. Check if all CSS and JS files are loaded
3. Verify file paths are correct (case-sensitive on some hosting)

### Problem: Can't authorize Google Apps Script

**Solution:**
1. Make sure you're logged into the correct Google account
2. Try using an incognito/private browser window
3. If you see "This app isn't verified":
   - Click **Advanced**
   - Click **Go to [Your Project] (unsafe)**
   - This is safe because it's your own script

---

## 📊 Viewing RSVP Data

### View Responses
- Open your Google Spreadsheet
- All responses appear in the "RSVP Responses" sheet
- Columns: Timestamp | Name | Attendance Status

### Get Statistics
1. Open your Google Sheet
2. Click **Extensions** → **Apps Script**
3. In the Apps Script editor, select the function `getRSVPStats`
4. Click **Run** (▶️)
5. Check the **Execution log** for statistics

### Export Data
1. In Google Sheets, click **File** → **Download**
2. Choose your format:
   - Excel (.xlsx)
   - CSV (.csv)
   - PDF (.pdf)

---

## 📁 Project Structure

```
graduation-invitation/
├── index.html          # Main HTML structure
├── styles.css          # All styling and design
├── script.js           # Form handling and validation
├── google-script.gs    # Google Apps Script backend
└── README.md           # This file
```

---

## 🛡️ Privacy & Security

- ✅ No API keys exposed in frontend code
- ✅ Google Apps Script handles all backend operations
- ✅ Form data sent securely to Google Sheets
- ✅ No personal data stored in browser
- ✅ HTTPS encryption (automatic with Netlify/Vercel/GitHub Pages)

---

## 📞 Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [Testing](#testing) checklist
3. Check browser console for errors (F12)
4. Verify all setup steps were completed

---

## 📝 License

This project is free to use and modify for personal purposes.

---

## 🎉 Credits

Created with ❤️ for Nguyễn Hồng Quân's graduation ceremony.

**Design:** Traditional Vietnamese elegance
**Technology:** HTML5, CSS3, JavaScript, Google Apps Script
**Hosting:** Netlify / GitHub Pages / Vercel

---

**Good luck with your graduation ceremony! 🎓**
