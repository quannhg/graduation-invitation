// ===== CONFIGURATION =====
// Replace this URL with your deployed Google Apps Script Web App URL
// https://docs.google.com/spreadsheets/d/1F7quDFWsAij1RxuKT-pPVlxhNyDh3RuXCa8M_neAY8w/edit?usp=sharing
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyUxPXL_XnJxAT69790E8LjJrjlsTGdoszoD1ldatnVjg_i3l7XW3klIrE1esVQZOxrRA/exec';

// ===== DOM ELEMENTS =====
const form = document.getElementById('rsvpForm');
const friendNameInput = document.getElementById('friendName');
const willAttendCheckbox = document.getElementById('willAttend');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const formMessage = document.getElementById('formMessage');
const messageTextElements = document.querySelectorAll('.message-text');
const signatureNameElement = document.querySelector('.signature-name');

// ===== FORM VALIDATION =====
function validateForm() {
    // Clear previous custom validation messages
    friendNameInput.setCustomValidity('');
    willAttendCheckbox.setCustomValidity('');

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

    // Validate attendance checkbox
    if (!willAttendCheckbox.checked) {
        willAttendCheckbox.setCustomValidity('Vui lòng xác nhận tham dự');
        return false;
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
    const formData = {
        name: friendNameInput.value.trim(),
        attendance: willAttendCheckbox.checked ? 'Có tham dự' : 'Không tham dự',
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
        showMessage(
            `✓ Cảm ơn ${formData.name}! Xác nhận của bạn đã được ghi nhận. Rất mong được gặp bạn tại buổi lễ!`,
            'success'
        );

        // Reset form after successful submission
        setTimeout(() => {
            form.reset();
            hideMessage();
        }, 5000);
    } else {
        showMessage(
            '✗ Đã xảy ra lỗi khi gửi xác nhận. Vui lòng thử lại sau hoặc liên hệ trực tiếp với chúng tôi.',
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

willAttendCheckbox.addEventListener('change', () => {
    if (willAttendCheckbox.checked) {
        willAttendCheckbox.setCustomValidity('');
    }
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

        // Fetch personalized message
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?inviter=${encodeURIComponent(inviter)}`);
        const data = await response.json();

        if (data.status === 'success' && data.hasCustomMessage && data.message) {
            // Replace the first message paragraph with custom message
            if (messageTextElements.length > 0) {
                messageTextElements[0].textContent = data.message;
            }

            // Optionally add a personal greeting to the signature
            if (signatureNameElement) {
                signatureNameElement.innerHTML = `Nguyễn Hồng Quân<br><small style="font-size: 0.9rem; opacity: 0.8;">Gửi đến ${data.inviter}</small>`;
            }
        }
    } catch (error) {
        console.error('Error fetching personalized message:', error);
        // Silently fail and use default message
    }
}

// ===== LOAD PERSONALIZED MESSAGE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    fetchPersonalizedMessage();
});
