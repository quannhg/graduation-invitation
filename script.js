// ===== CONFIGURATION =====
// Replace this URL with your deployed Google Apps Script Web App URL
// https://docs.google.com/spreadsheets/d/1F7quDFWsAij1RxuKT-pPVlxhNyDh3RuXCa8M_neAY8w/edit?usp=sharing
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_Ahh6pHa6ObqK87Jr-BqOQfFJRIFbZfONsEGxZ0Qp0j5NWmiLdHh11SvLEUFs01MjyA/exec';

// ===== DOM ELEMENTS =====
const form = document.getElementById('rsvpForm');
const friendNameInput = document.getElementById('friendName');
const willAttendYes = document.getElementById('willAttendYes');
const willAttendNo = document.getElementById('willAttendNo');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const formMessage = document.getElementById('formMessage');
const messageTextElements = document.querySelectorAll('.message-text');
const signatureNameElement = document.querySelector('.signature-name');
const messageLoader = document.getElementById('messageLoader');
const messageContent = document.getElementById('messageContent');
const occasionText = document.getElementById('occasionText');
const pageSkeleton = document.getElementById('pageSkeleton');
const mainContent = document.getElementById('mainContent');

// ===== FORM VALIDATION =====
function validateForm() {
    // Clear previous custom validation messages
    friendNameInput.setCustomValidity('');

    // Only validate name field if inviter is not present
    if (!currentInviterData) {
        // Validate name field
        const name = friendNameInput.value.trim();
        if (!name) {
            friendNameInput.setCustomValidity('Vui lòng nhập họ tên của bạn');
            return false;
        }

        if (name.length < 2) {
            friendNameInput.setCustomValidity('Họ tên phải có ít nhất 2 ký tự');
            return false;
        }
    }

    // Validate attendance radio buttons
    if (!willAttendYes.checked && !willAttendNo.checked) {
        willAttendYes.setCustomValidity('Vui lòng chọn trạng thái tham dự');
        return false;
    } else {
        willAttendYes.setCustomValidity('');
        willAttendNo.setCustomValidity('');
    }

    return true;
}

// ===== SHOW MESSAGE =====
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.classList.remove('hidden');

    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== HIDE MESSAGE =====
function hideMessage() {
    formMessage.classList.add('hidden');
}

// ===== SET LOADING STATE =====
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
}

// ===== SUBMIT FORM =====
async function submitForm(formData) {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Note: With 'no-cors' mode, we can't read the response
        // We assume success if no error is thrown
        return { success: true };
    } catch (error) {
        console.error('Submission error:', error);
        return { success: false, error: error.message };
    }
}

// ===== HANDLE FORM SUBMISSION =====
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide any previous messages
    hideMessage();

    // Validate form
    if (!validateForm()) {
        form.reportValidity();
        return;
    }

    // Prepare form data
    const attendance = willAttendYes.checked ? 'Có tham dự' : 'Không tham dự';

    // Use inviter ID if available (unique identifier), otherwise use the entered name
    const nameToSubmit = currentInviterData
        ? currentInviterData.urlParam  // Use unique URL param (e.g., "tuan", "ngoc-anh")
        : friendNameInput.value.trim(); // Use manually entered name

    const formData = {
        name: nameToSubmit,
        attendance: attendance,
        timestamp: new Date().toISOString()
    };

    // Check if Google Script URL is configured
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        showMessage(
            '⚠️ Vui lòng cấu hình Google Apps Script URL trong file script.js để gửi form.',
            'error'
        );
        return;
    }

    // Set loading state
    setLoadingState(true);

    // Submit form
    const result = await submitForm(formData);

    // Handle result
    setLoadingState(false);

    if (result.success) {
        // Use display name for message (if available), otherwise use submitted name
        const displayName = currentInviterData
            ? currentInviterData.displayName  // Use full display name (e.g., "Tuấn Nguyễn")
            : formData.name;                  // Use manually entered name

        // Customize message based on attendance choice
        let successMessage = '';
        if (attendance === 'Có tham dự') {
            successMessage = `✓ Cảm ơn ${displayName}! Rất mong được gặp bạn tại buổi lễ!`;
        } else {
            successMessage = `✓ Cảm ơn ${displayName} đã phản hồi. Rất tiếc vì bạn không thể tham dự. Hy vọng sẽ có dịp gặp bạn sau!`;
        }

        showMessage(successMessage, 'success');

        // Keep the form state after submission - don't reset
        // This helps users understand their submission was successful
        // and they can see what they selected
    } else {
        showMessage(
            '✗ Đã xảy ra lỗi khi gửi xác nhận. Vui lòng thử lại sau hoặc liên hệ trực tiếp sdt/facebook ở cuối trang.',
            'error'
        );
    }
});

// ===== INPUT VALIDATION ON CHANGE =====
friendNameInput.addEventListener('input', () => {
    if (friendNameInput.value.trim()) {
        friendNameInput.setCustomValidity('');
    }
});

willAttendYes.addEventListener('change', () => {
    willAttendYes.setCustomValidity('');
    willAttendNo.setCustomValidity('');
});

willAttendNo.addEventListener('change', () => {
    willAttendYes.setCustomValidity('');
    willAttendNo.setCustomValidity('');
});

// ===== SMOOTH SCROLL FOR ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== FETCH PERSONALIZED MESSAGE =====
async function fetchPersonalizedMessage() {
    try {
        // Get inviter parameter from URL
        const urlParams = new URLSearchParams(window.location.search);
        const inviter = urlParams.get('inviter');

        if (!inviter) {
            // No inviter parameter, use default message
            return;
        }

        // Check if Google Script URL is configured
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            console.warn('Google Apps Script URL not configured');
            return;
        }

        // Show loading spinner
        if (messageLoader && messageContent) {
            messageLoader.classList.remove('hidden');
            messageContent.style.display = 'none';
        }

        // Fetch personalized message
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?inviter=${encodeURIComponent(inviter)}`);
        const data = await response.json();

        // Hide loading spinner
        if (messageLoader && messageContent) {
            messageLoader.classList.add('hidden');
            messageContent.style.display = 'block';
        }

        if (data.status === 'success' && data.hasCustomMessage && data.message) {
            // Replace the first message paragraph with custom message
            if (messageTextElements.length > 0) {
                messageTextElements[0].textContent = data.message;
            }

            // Replace "anh/chị/bạn" with display name in second paragraph
            if (messageTextElements.length > 1 && data.inviter) {
                const secondMessage = messageTextElements[1].textContent;
                messageTextElements[1].textContent = secondMessage.replace('anh/chị/bạn', data.inviter);
            }

            // Replace "bạn/anh/chị" in hero occasion text
            if (occasionText && data.inviter) {
                occasionText.textContent = `Mời ${data.inviter} đến tham dự`;
            }

            // Optionally add a personal greeting to the signature
            if (signatureNameElement) {
                signatureNameElement.innerHTML = `Quân<br><small style="font-size: 0.9rem; opacity: 0.8;">Gửi đến ${data.inviter}</small>`;
            }
        }
    } catch (error) {
        console.error('Error fetching personalized message:', error);

        // Hide loading spinner on error
        if (messageLoader && messageContent) {
            messageLoader.classList.add('hidden');
            messageContent.style.display = 'block';
        }
        // Silently fail and use default message
    }
}

// ===== HIDE SKELETON AND SHOW CONTENT =====
function showContent() {
    if (pageSkeleton && mainContent) {
        pageSkeleton.classList.add('hidden');
        mainContent.classList.remove('hidden');
    }
}

// Store inviter data globally
let currentInviterData = null;

// ===== PREFILL FORM WITH INVITER NAME =====
function prefillFormWithInviterData(inviterName) {
    if (inviterName && friendNameInput) {
        // Hide the name input field and its parent form-group
        const nameFormGroup = friendNameInput.closest('.form-group');
        if (nameFormGroup) {
            nameFormGroup.style.display = 'none';
        }

        // Set the value but keep it hidden
        friendNameInput.value = inviterName;

        // Also pre-select "Yes" for better UX
        if (willAttendYes) {
            willAttendYes.checked = true;
        }
    }
}

// ===== LOAD PERSONALIZED MESSAGE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', async () => {
    // Get inviter parameter to check if we need to wait for personalization
    const urlParams = new URLSearchParams(window.location.search);
    const inviter = urlParams.get('inviter');

    if (inviter && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        // Wait for personalized message to load before showing content
        await fetchPersonalizedMessage();

        // Prefill form with inviter's display name if available
        // The display name is set in fetchPersonalizedMessage via data.inviter
        const urlParams2 = new URLSearchParams(window.location.search);
        const inviterParam = urlParams2.get('inviter');

        // Try to get the display name from the personalized data
        // We need to fetch it again or store it globally
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?inviter=${encodeURIComponent(inviterParam)}`);
            const data = await response.json();

            if (data.status === 'success' && data.inviter) {
                currentInviterData = {
                    urlParam: inviterParam,
                    displayName: data.inviter
                };
                prefillFormWithInviterData(data.inviter);
            }
        } catch (error) {
            console.log('Could not prefill form data');
        }
    }

    // Show content after personalization (or immediately if no inviter)
    showContent();
});
