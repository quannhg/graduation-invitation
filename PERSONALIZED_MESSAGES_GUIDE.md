# 📧 Personalized Messages Setup Guide

This guide will walk you through setting up custom, personalized invitation messages for each of your guests.

---

## 🎯 What Are Personalized Messages?

Instead of sending the same generic invitation to everyone, you can create **custom messages** for specific friends that will appear when they visit a unique URL.

**Example:**
- Your friend **Minh** visits: `https://your-site.com/?inviter=Minh`
- They see: *"Bạn là người bạn thân thiết nhất của tôi từ năm nhất. Cảm ơn vì đã luôn bên tôi trong suốt hành trình này!"*

- Your friend **Lan** visits: `https://your-site.com/?inviter=Lan`
- They see: *"Không có bạn, tôi không thể vượt qua những kỳ thi khó khăn. Rất mong được gặp bạn tại buổi lễ!"*

---

## 📋 Step-by-Step Setup

### Step 1: Open Your Google Spreadsheet

1. Go to your Google Spreadsheet (the one you created for RSVP responses)
2. Keep this tab open

---

### Step 2: Run the Initialization Function

1. Click **Extensions** → **Apps Script**
2. In the Apps Script editor, you should see your code from `google-script.gs`
3. At the top of the editor, find the function dropdown (it says "Select function")
4. Click the dropdown and select **`initializeMessagesSheet`**

   ![Function Dropdown](https://i.imgur.com/example.png)

5. Click the **Run** button (▶️ play icon)
6. **First time running:**
   - You'll see an "Authorization required" popup
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to [Your Project Name] (unsafe)**
   - Click **Allow**
7. Wait a few seconds for the script to run
8. You'll see a popup: **"Personalized Messages sheet created with example data!"**
9. Click **OK**

---

### Step 3: View the New Sheet

1. Go back to your Google Spreadsheet
2. You should now see a new tab at the bottom called **"Personalized Messages"**
3. Click on it to open

You'll see a table with 2 columns:

| URL Param | Display Name | Custom Message |
|-----------|--------------|----------------|
| minh | Minh | Bạn là người bạn thân thiết nhất của tôi từ năm nhất. Cảm ơn vì đã luôn bên tôi trong suốt hành trình này! |
| lan | Lan Anh | Không có bạn, tôi không thể vượt qua những kỳ thi khó khăn. Rất mong được gặp bạn tại buổi lễ! |

These are **example entries** to show you how it works.

---

### Step 4: Add Your Custom Messages

Now it's time to add messages for your real guests!

1. **Delete the example rows** if you don't need them
2. **Add new rows** for each guest you want to personalize:

**Column A - URL Param:**
- Short, URL-friendly identifier for this guest
- Use lowercase, no spaces (use hyphens for multiple words)
- Examples: `tuan`, `ngoc-anh`, `hoang`, `minh-chau`
- This is what goes in the URL: `?inviter=tuan`

**Column B - Display Name:**
- The guest's full name as you want it to appear on the website
- Can include proper capitalization, spaces, Vietnamese characters
- Examples: `Tuấn`, `Ngọc Anh`, `Hoàng`, `Minh Châu`
- This appears in "Gửi đến [Display Name]"

**Column C - Custom Message:**
- Write a personal message for this specific guest
- Be heartfelt and genuine!
- Keep it 1-3 sentences for best readability

**Example entries:**

| URL Param | Display Name | Custom Message |
|-----------|--------------|----------------|
| tuan | Tuấn | Cậu là người đã động viên tôi nhiều nhất trong những ngày tháng khó khăn. Không có cậu, hôm nay tôi không thể đứng ở đây được! |
| ngoc-anh | Ngọc Anh | Từ năm nhất đến giờ, chúng ta đã cùng nhau vượt qua bao nhiêu kỳ thi và dự án. Cảm ơn vì đã là người bạn đồng hành tuyệt vời! |
| hoang | Hoàng | Những buổi học nhóm cùng cậu luôn là kỷ niệm đáng nhớ nhất. Rất mong được ăn mừng cùng cậu trong ngày đặc biệt này! |
| minh-chau | Minh Châu | Em là người em gái mà anh luôn tự hào. Cảm ơn em đã luôn tin tưởng và ủng hộ anh! |

---

### Step 5: Save Your Sheet

Google Sheets automatically saves, but make sure you see **"All changes saved in Drive"** at the top.

---

### Step 6: Create Personalized URLs

For each guest, create a unique URL by adding `?inviter=Name` to your website URL.

**Format:**
```
https://your-website.com/?inviter=GuestName
```

**Examples:**
```
https://your-website.com/?inviter=Tuấn
https://your-website.com/?inviter=Ngọc Anh
https://your-website.com/?inviter=Hoàng
https://your-website.com/?inviter=Minh Châu
```

**For names with spaces**, use `%20`:
```
https://your-website.com/?inviter=Ngọc%20Anh
https://your-website.com/?inviter=Minh%20Châu
```

Or use a URL shortener like [bit.ly](https://bit.ly) or [tinyurl.com](https://tinyurl.com) to make them cleaner!

---

### Step 7: Share Links with Your Guests

Now send these personalized URLs to your guests via:
- **Facebook Messenger**
- **Zalo**
- **WhatsApp**
- **Email**
- **SMS**

**Example message:**
```
Chào Tuấn,

Mình rất vui được mời cậu đến dự lễ tốt nghiệp của mình!
Nhấn vào link này để xem lời mời: https://your-site.com/?inviter=tuan

Mong được gặp cậu!
Quân
```

---

## 🎨 How It Looks

### Without Personalized URL
When someone visits: `https://your-website.com`

They see the **default message**:
> *"Sau một hành trình với thật nhiều kỷ niệm, ngày tốt nghiệp của Quân đã đến! Sự hiện diện của anh/chị/bạn sẽ là niềm vui rất lớn..."*

### With Personalized URL
When Tuấn visits: `https://your-website.com/?inviter=Tuấn`

The first paragraph is **replaced** with his custom message:
> *"Cậu là người đã động viên tôi nhiều nhất trong những ngày tháng khó khăn. Không có cậu, hôm nay tôi không thể đứng ở đây được!"*

And the signature shows:
> **Nguyễn Hồng Quân**
> *Gửi đến Tuấn*

---

## ✅ Testing Your Setup

### Test Locally (if using `npx serve`):

1. Make sure your server is running: `npx serve`
2. Open: `http://localhost:3000/?inviter=tuan`
3. You should see the custom message with "Tuấn" displayed

### Test on Live Website:

1. Deploy your website (Netlify, Vercel, GitHub Pages)
2. Open: `https://your-site.com/?inviter=tuan`
3. Verify the custom message appears with "Tuấn" as the display name

---

## 📝 Important Notes

### ✓ Name Matching Rules

- **Case insensitive**: `tuan`, `Tuan`, `TUAN` all match the same entry
- **Exact spelling**: Make sure the URL param matches the "URL Param" column exactly
- **Use hyphens for spaces**: `ngoc-anh` instead of `Ngọc Anh`
- **URL encoding**: If you must use spaces, they become `%20` in URLs

### ✓ What If No Match?

If someone visits with a name that's **not in your sheet**, they'll see the **default message**. No errors!

### ✓ Empty Message Column

If you leave the "Custom Message" column **empty** for someone, they'll get the default message even if their name is in the sheet.

### ✓ Updating Messages

You can **edit messages anytime**:
1. Open your Google Sheet
2. Change the message in Column B
3. Save (automatic)
4. The change is **live immediately** — no redeployment needed!

---

## 🔧 Troubleshooting

### Problem: Custom message not showing

**Solutions:**
1. **Check the spreadsheet:**
   - Is the "Personalized Messages" sheet created?
   - Is the guest's name spelled correctly?
   - Is there actually a message in Column B?

2. **Check the URL:**
   - Does it have `?inviter=Name` at the end?
   - Is the name spelled exactly as in the sheet?

3. **Check Google Apps Script deployment:**
   - Is the Web App deployed with "Anyone" access?
   - Did you redeploy after making changes to the script?

4. **Check browser console:**
   - Press `F12` to open Developer Tools
   - Go to the **Console** tab
   - Look for error messages

### Problem: "Authorization required" error

**Solution:**
- This is normal the first time
- Follow Step 2 instructions to authorize the script
- Click "Advanced" → "Go to [Your Project] (unsafe)"
- This is safe because it's your own script

### Problem: Sheet says "already exists"

**Solution:**
- The sheet was already created!
- Just go to your spreadsheet and look for the "Personalized Messages" tab
- No need to run `initializeMessagesSheet` again

---

## 💡 Tips & Best Practices

### Writing Great Personalized Messages

1. **Be specific**: Mention shared memories or experiences
   - ❌ "Cảm ơn bạn đã là bạn tốt của tôi"
   - ✅ "Những buổi học nhóm cùng cậu vào 2 giờ sáng trước kỳ thi là kỷ niệm không thể nào quên!"

2. **Keep it concise**: 1-3 sentences is perfect
   - Too long = people won't read it all
   - Too short = might feel generic

3. **Be genuine**: Write from the heart
   - Your friends will feel the authenticity

4. **Proofread**: Check for typos before saving

### Organizing Your Messages

Create a separate document to draft all messages first:

```
TUẤN: Cậu là người đã động viên tôi...
NGỌC ANH: Từ năm nhất đến giờ...
HOÀNG: Những buổi học nhóm...
```

Then copy-paste them into the spreadsheet. This way you can:
- Review all messages together
- Check for consistency in tone
- Get feedback from someone you trust

### Batch URL Creation

Use a spreadsheet formula to generate all URLs automatically:

In a new column (Column C), enter:
```
=CONCATENATE("https://your-website.com/?inviter=", ENCODEURL(A2))
```

Drag down to fill for all rows. Now you have all URLs ready to copy!

---

## 📊 Tracking Who Visited

Want to see who opened their personalized link?

You can use **Google Analytics** or **bit.ly** link tracking to monitor visits to each personalized URL.

---

## 🎉 Final Checklist

Before sending invitations:

- [ ] "Personalized Messages" sheet created
- [ ] All guest names added to Column A
- [ ] All custom messages written in Column B
- [ ] Messages proofread for typos
- [ ] Tested at least 2-3 personalized URLs
- [ ] URLs created for all guests
- [ ] URLs shortened (optional, but cleaner)
- [ ] Ready to send!

---

## ❓ Questions?

If you run into issues:
1. Review this guide carefully
2. Check the main README.md for general setup
3. Look at the Google Apps Script code comments
4. Test with example names first before sending to real guests

---

**Good luck with your graduation invitations! 🎓**

*Remember: The personal touch makes all the difference. Your friends will appreciate the effort!*
