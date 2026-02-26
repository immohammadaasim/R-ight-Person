/* ===================================================================== */
/* ===>> BLOCK JS 0: Documentation & Verification Logic Rules <<=== */
/* ===================================================================== */
/* 
    FILE NAME: 2-verification/Verification.js
    PROJECT: R-ight Person (Digital Identity System)
    ARCHITECTURE: Modular Architecture (Verification Engine)
    
    SYSTEM FLOW:
    1. READ IDENTITY: Get user info (Email/Phone) from sessionStorage.
    2. PATH CHOICE: User selects Telegram (Free), iMail, or WhatsApp.
    3. ACCESS -R- KEY: System sends 6-digit code via chosen path.
    4. DEVICE GUARD (OLD USERS):
       - If New Device: Trigger 3-minute Real-time Approval.
       - If Same Device: Bypass to Dashboard.
    5. IDENTITY SETUP: Redirect to dashboard for final registration.

    RULES:
    - User cannot stay on this page without temporary session data.
    - All success/error messages MUST use showIsland().
    - Haptic visuals (scale-down) simulated on every interaction.
    - Zero-Jerk Transitions: Smooth fade/slide between views.
*/
/* ===================================================================== */
/* ===>> END OF BLOCK JS 0 file : 2-verification/Verification.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 1: Initialization & Verification UI Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1A : Supabase Client & Connection Setup --- */
/* --------------------------------------------------------------------- */
const SB_URL = "https://xtzdlepgpqvllwzjfrsh.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0emRsZXBncHF2bGx3empmcnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTI2MzcsImV4cCI6MjA4NzU2ODYzN30.NxX8BPCK_HNQYmn0-7YkdPv12gO8wKgOS5oP2R0OYZc";

// Initialize Supabase for this module
const _sb = supabase.createClient(SB_URL, SB_KEY);

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1B : DOM Element Selection (Verification) --- */
/* --------------------------------------------------------------------- */
// Views
const selectionView = document.getElementById('selection-view');
const keyInputView = document.getElementById('key-input-view');
const shiftGuardView = document.getElementById('shift-guard-view');

// Path Cards
const pathTelegram = document.getElementById('path-telegram');
const pathEmail = document.getElementById('path-email');
const pathWhatsapp = document.getElementById('path-whatsapp');

// Action Elements
const verifyKeyBtn = document.getElementById('verify-key-btn');
const resendKeyBtn = document.getElementById('resend-key-btn');
const goBackBtn = document.getElementById('go-back-entry');
const changePathBtn = document.getElementById('back-to-selection');
const keyBoxes = document.querySelectorAll('.key-box');

// UI Feedback
const dynamicIsland = document.getElementById('showIsland');
const islandMsg = document.getElementById('island-message');
const islandIcon = document.getElementById('island-icon');

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1C : Universal UI Helpers (The Island & Haptics) --- */
/* --------------------------------------------------------------------- */
/**
 * showIsland: User ko har choti-badi baat batane wala universal function.
 */
function showIsland(msg, type = 'info') {
    islandMsg.textContent = msg;
    dynamicIsland.className = `dynamic-island active ${type}`;
    
    let iconSvg = '';
    if(type === 'success') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if(type === 'error') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
    islandIcon.innerHTML = iconSvg;

    setTimeout(() => { dynamicIsland.classList.remove('active'); }, 3500);
}

function triggerHaptic() {
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(10);
    console.log("Haptic Visual: Simulated");
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1D : View Controller (Zero-Jerk Transition) --- */
/* --------------------------------------------------------------------- */
/**
 * switchView: Ek view se dusre par jane ka makkhan jaisa smooth transition.
 */
function switchView(show, hide) {
    hide.classList.remove('active');
    setTimeout(() => {
        hide.style.display = 'none';
        show.style.display = 'block';
        void show.offsetWidth; // Reflow for animation
        show.classList.add('active');
    }, 400);
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1E : Module Gatekeeper (Security Check) --- */
/* --------------------------------------------------------------------- */
/**
 * checkSession: Ensure karta hai ki user login.html se hi aaya hai.
 */
function checkSession() {
    const tempEmail = sessionStorage.getItem('RP_Temp_Email');
    const tempPhone = sessionStorage.getItem('RP_Temp_Phone');

    if (!tempEmail || !tempPhone) {
        // Bina data ke access denied
        window.location.href = '../1-login/login.html';
    } else {
        showIsland("Select your Identity Path", "info");
    }
}

// Start Security Check immediately
document.addEventListener('DOMContentLoaded', checkSession);

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 2-verification/Verification.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 2: Path Selection & Access -R- Key Request <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2A : Path Selection Listeners --- */
/* --------------------------------------------------------------------- */

// 1. Telegram Path (Primary Free Path)
pathTelegram.addEventListener('click', () => {
    triggerHaptic();
    showIsland("Telegram path selected. Enter your Chat ID...", "info");
    
    // Chat ID input dikhao
    showChatIDPrompt();
});

// 2. iMail Path (Coming Soon - Paid $1.00)
pathEmail.addEventListener('click', () => {
    triggerHaptic();
    showIsland("iMail Path is coming soon ($1.00 fee).", "info");
});

// 3. WhatsApp Path (Coming Soon - Paid $2.00)
pathWhatsapp.addEventListener('click', () => {
    triggerHaptic();
    showIsland("WhatsApp Premium is coming soon ($2.00 fee).", "info");
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2B : Chat ID Prompt (Telegram User Identification) --- */
/* --------------------------------------------------------------------- */
/**
 * showChatIDPrompt: User se uska Telegram Chat ID mangta hai.
 * User apna Chat ID @userinfobot se pata kar sakta hai.
 */
function showChatIDPrompt() {
    // Agar pehle se prompt hai to dobara mat banao
    if (document.getElementById('chatid-wrapper')) return;

    const selectionList = document.querySelector('.selection-list');

    // Chat ID input wrapper banana
    const wrapper = document.createElement('div');
    wrapper.id = 'chatid-wrapper';
    wrapper.style.cssText = `
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        animation: fadeSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    `;

    wrapper.innerHTML = `
        <style>
            @keyframes fadeSlideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
        <div style="
            background: rgba(0,122,255,0.08);
            border: 1px solid rgba(0,122,255,0.2);
            border-radius: 14px;
            padding: 12px 14px;
            font-size: 13px;
            color: #007AFF;
            line-height: 1.5;
        ">
            💡 Get your Chat ID: Open Telegram → Search <b>@userinfobot</b> → Send <b>/start</b> → Copy your ID
        </div>
        <div style="
            display: flex;
            align-items: center;
            background: rgba(0,0,0,0.04);
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s ease;
        " id="chatid-input-wrapper">
            <input 
                type="number" 
                id="telegram-chat-id" 
                placeholder="Your Telegram Chat ID"
                style="
                    flex: 1;
                    height: 52px;
                    padding: 0 16px;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-size: 16px;
                    font-family: inherit;
                    color: inherit;
                "
            />
            <button id="send-otp-btn" style="
                height: 52px;
                padding: 0 20px;
                background: linear-gradient(180deg, #007AFF 0%, #0063CC 100%);
                color: white;
                border: none;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                font-family: inherit;
                border-radius: 0 16px 16px 0;
                transition: all 0.2s ease;
            ">Send Key</button>
        </div>
    `;

    selectionList.after(wrapper);

    // Focus input par
    setTimeout(() => {
        document.getElementById('telegram-chat-id')?.focus();
        
        // Input focus glow
        const inputWrapper = document.getElementById('chatid-input-wrapper');
        document.getElementById('telegram-chat-id').addEventListener('focus', () => {
            inputWrapper.style.borderColor = '#007AFF';
            inputWrapper.style.boxShadow = '0 0 0 4px rgba(0,122,255,0.15)';
        });
        document.getElementById('telegram-chat-id').addEventListener('blur', () => {
            inputWrapper.style.borderColor = 'rgba(0,0,0,0.08)';
            inputWrapper.style.boxShadow = 'none';
        });
    }, 100);

    // Send button click
    document.getElementById('send-otp-btn').addEventListener('click', () => {
        triggerHaptic();
        const chatId = document.getElementById('telegram-chat-id').value.trim();
        
        if (!chatId) {
            showIsland("Please enter your Telegram Chat ID.", "error");
            return;
        }

        // Chat ID session me save karo
        sessionStorage.setItem('RP_Telegram_ChatID', chatId);
        
        // OTP bhejo
        requestAccessKey(chatId);
    });
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2C : Request Access Key (Edge Function Call) --- */
/* --------------------------------------------------------------------- */
/**
 * requestAccessKey: Supabase Edge Function ko call karke Telegram par OTP bhejta hai.
 */
async function requestAccessKey(chatId) {
    // Button loading state
    const sendBtn = document.getElementById('send-otp-btn');
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.textContent = '...';
    }

    showIsland("Sending your Access -R- Key...", "info");

    try {
        // Supabase Edge Function call
        const response = await fetch(
            'https://xtzdlepgpqvllwzjfrsh.supabase.co/functions/v1/send-telegram-otp',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId })
            }
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Unknown error');
        }

        // OTP session me save karo (verification ke liye)
        sessionStorage.setItem('RP_Expected_OTP', result.otp);

        showIsland("Access -R- Key sent to your Telegram!", "success");

        // Key input view par le jao
        document.getElementById('target-identity').textContent = 'Telegram';
        switchView(keyInputView, selectionView);
        startOTPTimer();

    } catch (err) {
        console.error("OTP Send Error:", err.message);
        showIsland("Failed to send key. Check your Chat ID.", "error");
        
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send Key';
        }
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2D : Navigation Helpers --- */
/* --------------------------------------------------------------------- */

// "Edit Mobile/Gmail" dabane par wapis login page par bhejo
goBackBtn.addEventListener('click', () => {
    triggerHaptic();
    window.location.href = '../1-login/login.html';
});

// "Change Path" dabane par wapis selection cards dikhao
changePathBtn.addEventListener('click', () => {
    triggerHaptic();
    // Chat ID wrapper hata do
    const chatWrapper = document.getElementById('chatid-wrapper');
    if (chatWrapper) chatWrapper.remove();
    switchView(selectionView, keyInputView);
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 2-Verification/Verification.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 3: Access -R- Key Passcode Logic & Verification <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3A : Auto-Focus Input Behavior --- */
/* --------------------------------------------------------------------- */
/**
 * keyBoxes: 6-digit boxes ka smart behavior handle karta hai.
 */
keyBoxes.forEach((box, index) => {
    // Number type karne par agle box me focus karo
    box.addEventListener('input', (e) => {
        // Sirf numbers allow karo
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        
        if (e.target.value.length === 1 && index < keyBoxes.length - 1) {
            keyBoxes[index + 1].focus();
        }
    });

    // Backspace dabane par piche wale box me jao
    box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && index > 0) {
            keyBoxes[index - 1].focus();
        }
    });

    // Paste support (agar user poora code paste kare)
    box.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
        if (pastedData.length === 6) {
            keyBoxes.forEach((b, i) => {
                b.value = pastedData[i] || '';
            });
            keyBoxes[5].focus();
        }
    });
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3B : Verify Identity Execution --- */
/* --------------------------------------------------------------------- */
/**
 * verifyKeyBtn: Session me saved OTP se match karke identity confirm karta hai.
 */
verifyKeyBtn.addEventListener('click', async () => {
    triggerHaptic();

    // 1. Boxes se poora code nikalo
    let enteredOTP = "";
    keyBoxes.forEach(box => enteredOTP += box.value);

    if (enteredOTP.length < 6) {
        return showIsland("Please enter the full 6-digit key.", "error");
    }

    // 2. Session me saved OTP se match karo
    const expectedOTP = sessionStorage.getItem('RP_Expected_OTP');

    if (!expectedOTP) {
        showIsland("Session expired. Please start again.", "error");
        setTimeout(() => { window.location.href = '../1-login/login.html'; }, 2000);
        return;
    }

    // UI State: Loading
    verifyKeyBtn.disabled = true;
    verifyKeyBtn.querySelector('.btn-text').style.opacity = '0';
    verifyKeyBtn.querySelector('.btn-loader').style.display = 'block';

    // 3. OTP match check
    if (enteredOTP === expectedOTP) {
        // OTP sahi hai
        showIsland("Identity Confirmed!", "success");

        // OTP session se hata do (security)
        sessionStorage.removeItem('RP_Expected_OTP');

        // 4. Routing Logic
        await handleIdentitySuccess();

    } else {
        // OTP galat hai
        showIsland("Invalid Key. Please check and try again.", "error");

        // Boxes reset karo
        keyBoxes.forEach(box => box.value = "");
        keyBoxes[0].focus();

        // Button reset
        verifyKeyBtn.disabled = false;
        verifyKeyBtn.querySelector('.btn-text').style.opacity = '1';
        verifyKeyBtn.querySelector('.btn-loader').style.display = 'none';
    }
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3C : Countdown Timer & Resend Logic --- */
/* --------------------------------------------------------------------- */
let otpTimer;

function startOTPTimer() {
    let timeLeft = 120; // 2 Minutes
    const timerDisplay = document.getElementById('resend-timer');
    resendKeyBtn.disabled = true;

    clearInterval(otpTimer);
    otpTimer = setInterval(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if (timeLeft <= 0) {
            clearInterval(otpTimer);
            resendKeyBtn.disabled = false;
            timerDisplay.textContent = "0:00";
            showIsland("You can now request a new key.", "info");
        }
        timeLeft--;
    }, 1000);
}

// Resend Button Click
resendKeyBtn.addEventListener('click', () => {
    triggerHaptic();
    const chatId = sessionStorage.getItem('RP_Telegram_ChatID');
    
    if (!chatId) {
        showIsland("Session lost. Please go back and try again.", "error");
        return;
    }

    // Boxes reset karo
    keyBoxes.forEach(box => box.value = "");
    keyBoxes[0].focus();

    // Naya OTP bhejo
    requestAccessKey(chatId);
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : 2-Verification/Verification.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 4: Device Guard & Anti-Theft Logic (Shift System) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A : handleIdentitySuccess (Routing Engine) --- */
/* --------------------------------------------------------------------- */
/**
 * handleIdentitySuccess: Verification ke baad user ki pehchan aur device check karta hai.
 */
async function handleIdentitySuccess() {
    const currentDID = localStorage.getItem('RP_DeviceID');
    const userType = sessionStorage.getItem('RP_User_Type');
    const email = sessionStorage.getItem('RP_Temp_Email');

    // 1. Agar User bilkul naya hai
    if (userType === 'NEW') {
        try {
            // Naye user ko database me save karo
            const { error } = await _sb
                .from('users')
                .insert({
                    email: email,
                    phone: sessionStorage.getItem('RP_Temp_Phone'),
                    device_fingerprint: currentDID,
                    is_blocked: false,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;

            showIsland("New Identity Confirmed. Welcome!", "success");
            setTimeout(() => { 
                window.location.href = '../3-dashboard/dashboard.html'; 
            }, 1500);

        } catch (err) {
            console.error("New User Save Error:", err);
            showIsland("Failed to save identity. Try again.", "error");
            
            // Button reset
            verifyKeyBtn.disabled = false;
            verifyKeyBtn.querySelector('.btn-text').style.opacity = '1';
            verifyKeyBtn.querySelector('.btn-loader').style.display = 'none';
        }
        return;
    }

    // 2. Agar User purana hai, device check karo
    try {
        const { data: user, error } = await _sb
            .from('users')
            .select('id, device_fingerprint, is_blocked')
            .eq('email', email)
            .single();

        if (error) throw error;

        // Blocked account check
        if (user.is_blocked) {
            return showHighAlert("This Identity is permanently suspended.");
        }

        // 3. Device Comparison
        if (user.device_fingerprint === currentDID) {
            // Wahi purana device
            showIsland("Device Verified. Welcome back!", "success");
            setTimeout(() => { 
                window.location.href = '../3-dashboard/dashboard.html'; 
            }, 1500);
        } else {
            // Naya device — Shift Protocol
            triggerDeviceShiftProtocol(user.id, currentDID);
        }

    } catch (err) {
        console.error("Device Guard Error:", err);
        showIsland("Security check failed. Contact Support.", "error");
        
        // Button reset
        verifyKeyBtn.disabled = false;
        verifyKeyBtn.querySelector('.btn-text').style.opacity = '1';
        verifyKeyBtn.querySelector('.btn-loader').style.display = 'none';
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : Trigger Device Shift (3-Minute Timer) --- */
/* --------------------------------------------------------------------- */
const shiftTimerText = document.getElementById('shift-timer-text');
const timerRing = document.getElementById('timer-progress-ring');
let shiftCountdown;

function triggerDeviceShiftProtocol(uid, newDID) {
    showIsland("New Device detected! Authorization required.", "error");

    // Guard view dikhao
    const cardContainer = document.querySelector('.spatial-glass-card');
    
    // Purani views hatao
    selectionView.style.display = 'none';
    keyInputView.style.display = 'none';
    
    // Guard view dikhao
    shiftGuardView.style.display = 'block';
    void shiftGuardView.offsetWidth;
    shiftGuardView.classList.add('active');

    let timeLeft = 180;
    const totalTime = 180;
    const ringCircumference = 339;

    clearInterval(shiftCountdown);
    shiftCountdown = setInterval(() => {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        shiftTimerText.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        // Ring update
        const offset = ringCircumference - (timeLeft / totalTime) * ringCircumference;
        timerRing.style.strokeDashoffset = offset;

        if (timeLeft <= 0) {
            clearInterval(shiftCountdown);
            handleShiftExpiry();
        }
        timeLeft--;
    }, 1000);

    // Real-time listener
    startShiftSyncListener(uid, newDID);
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4C : High Alert & Block Screen --- */
/* --------------------------------------------------------------------- */
function showHighAlert(reason) {
    const blockScreen = document.getElementById('high-alert-screen');
    document.getElementById('block-reason').textContent = reason;
    blockScreen.style.display = 'flex';
    
    // Poore portal ko lock karo
    document.getElementById('app-container').style.display = 'none';
}

function handleShiftExpiry() {
    showIsland("Shift request expired. Please try again.", "error");
    setTimeout(() => { 
        window.location.href = '../1-login/login.html'; 
    }, 2000);
}

/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : 2-Verification/Verification.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 5: Real-time Identity Sync & Portal Finalization <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5A : Start Shift Sync Listener (The Magic Bridge) --- */
/* --------------------------------------------------------------------- */
/**
 * startShiftSyncListener: Supabase Real-time channel ka use karke primary 
 * device se aane wale APPROVED ya REJECTED signal ko sunta hai.
 */
function startShiftSyncListener(uid, newDID) {
    const syncChannel = _sb.channel(`identity-sync-${uid}`);

    syncChannel
        .on('broadcast', { event: 'auth-response' }, async ({ payload }) => {
            const { action, targetDeviceID } = payload;

            if (targetDeviceID === newDID) {
                if (action === 'APPROVED') {
                    clearInterval(shiftCountdown);
                    showIsland("Authorization Granted!", "success");
                    await finalizeIdentityEntry(uid, newDID);
                } else if (action === 'REJECTED') {
                    clearInterval(shiftCountdown);
                    
                    // Device ko permanently block karo
                    await _sb
                        .from('blocked_devices')
                        .insert({ 
                            device_id: newDID, 
                            reason: 'Rejected by primary device',
                            created_at: new Date().toISOString()
                        });

                    showHighAlert("Authorization REJECTED. This device is now permanently flagged.");
                }
            }
        })
        .subscribe((status) => {
            console.log("Real-time sync status:", status);
        });
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5B : Finalize Identity Entry (Database Sync) --- */
/* --------------------------------------------------------------------- */
/**
 * finalizeIdentityEntry: Naye device ki fingerprint ko users table me 
 * update karke dashboard par bhejta hai.
 */
async function finalizeIdentityEntry(uid, newDID) {
    try {
        const { error } = await _sb
            .from('users')
            .update({ device_fingerprint: newDID })
            .eq('id', uid);

        if (error) throw error;

        showIsland("Device Sync Complete. Redirecting...", "success");

        setTimeout(() => {
            window.location.href = '../3-dashboard/dashboard.html';
        }, 1800);

    } catch (err) {
        console.error("Sync Error:", err);
        showIsland("Sync failed. Please try manual re-entry.", "error");
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5C : Email Shift Link (Lost Phone Protocol) --- */
/* --------------------------------------------------------------------- */
document.getElementById('shift-via-email')?.addEventListener('click', (e) => {
    e.preventDefault();
    triggerHaptic();
    showIsland("Email shift link will be active after 3 minutes.", "info");
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5D : Page Load Animation (Apple visionOS Feel) --- */
/* --------------------------------------------------------------------- */
window.addEventListener('load', () => {
    // Session check
    const tempEmail = sessionStorage.getItem('RP_Temp_Email');
    if (!tempEmail) {
        window.location.href = '../1-login/login.html';
        return;
    }

    // Card entrance animation
    const card = document.querySelector('.spatial-glass-card');
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95) translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
        }, 100);
    }

    showIsland("Select your Identity Path", "info");
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 5 file : 2-Verification/Verification.js <<=== */
/* ===================================================================== */