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
/* ===>> BLOCK JS 2: Path Selection & Telegram Deep Link Logic <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2A : Path Selection Listeners --- */
/* --------------------------------------------------------------------- */

// 1. Telegram Path (Primary Free Path)
pathTelegram.addEventListener('click', () => {
    triggerHaptic();
    initiateTelegramFlow();
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
/* --- Sub-Block 2B : Telegram Flow Initiator (Hex-Secure Engine) --- */
/* --------------------------------------------------------------------- */
function initiateTelegramFlow() {
    const phone = sessionStorage.getItem('RP_Temp_Phone');
    const countryCode = sessionStorage.getItem('RP_Country_Code') || '+91';

    if (!phone) {
        showIsland("Session expired. Please login again.", "error");
        setTimeout(() => { window.location.href = '../1-login/login.html'; }, 2000);
        return;
    }

    const fullPhoneRaw = countryCode + phone;
    const cleanNumber = fullPhoneRaw.replace(/\D/g, ''); 

    /**
     * God-Level Encoding: Hexadecimal 
     * Isme koi symbols (+, /, =) nahi hote, isliye Telegram ise 100% accept karega.
     */
    const toHex = (str) => {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += str.charCodeAt(i).toString(16);
        }
        return result;
    };

    const hexEncodedParam = toHex(cleanNumber);

    // Final Deep Link (Bulletproof for Mobile & Web)
    const botUsername = "Rightpersonverification_bot";
    const deepLink = `https://t.me/${botUsername}?start=${hexEncodedParam}`;

    showTelegramOpenButton(deepLink, fullPhoneRaw);
}
/* --------------------------------------------------------------------- */
/* --- End Block 2B file : 2-Verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2C : Telegram Open Button UI --- */
/* --------------------------------------------------------------------- */
/**
 * showTelegramOpenButton: Selection view me "Open Telegram" button inject karta hai.
 */
function showTelegramOpenButton(deepLink, displayPhone) {
    // Agar pehle se hai to dobara mat banao
    if (document.getElementById('telegram-open-wrapper')) return;

    const selectionList = document.querySelector('.selection-list');

    const wrapper = document.createElement('div');
    wrapper.id = 'telegram-open-wrapper';
    wrapper.style.cssText = `
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        animation: fadeSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    `;

    wrapper.innerHTML = `
        <style>
            @keyframes fadeSlideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>

        <!-- Info Box -->
        <div style="
            background: rgba(0,122,255,0.08);
            border: 1px solid rgba(0,122,255,0.2);
            border-radius: 14px;
            padding: 12px 14px;
            font-size: 13px;
            color: #007AFF;
            line-height: 1.6;
        ">
            📱 Number: <b>${displayPhone}</b><br>
            Tap below → Telegram opens → Press <b>START</b> → Key arrives instantly!
        </div>

        <!-- Open Telegram Button -->
        <a id="open-telegram-btn" href="${deepLink}" target="_blank" style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            height: 54px;
            background: linear-gradient(135deg, #2AABEE 0%, #229ED9 100%);
            color: white;
            border-radius: 16px;
            text-decoration: none;
            font-size: 16px;
            font-weight: 600;
            font-family: inherit;
            box-shadow: 0 8px 20px rgba(42,171,238,0.3);
            transition: all 0.2s ease;
        ">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.76-1.63 6.27-2.71 7.53-3.23 3.58-1.48 4.32-1.74 4.81-1.75.11 0 .35.03.5.16.13.11.17.26.18.37 0 .04.01.12 0 .19z"/>
            </svg>
            Open Telegram to get Key
        </a>

        <!-- Already got key button -->
        <button id="already-got-key-btn" style="
            width: 100%;
            height: 48px;
            background: transparent;
            border: 1.5px solid rgba(0,122,255,0.3);
            border-radius: 14px;
            color: #007AFF;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s ease;
        ">I have my Key → Enter it</button>
    `;

    selectionList.after(wrapper);

    // Haptic on open telegram button
    document.getElementById('open-telegram-btn').addEventListener('click', () => {
        triggerHaptic();
        showIsland("Opening Telegram...", "info");
        
        // 3 second baad "Enter Key" view automatically suggest karo
        setTimeout(() => {
            showIsland("Got your key? Tap 'I have my Key'", "info");
        }, 3000);
    });

    // "I have my Key" button
    document.getElementById('already-got-key-btn').addEventListener('click', () => {
        triggerHaptic();
        document.getElementById('target-identity').textContent = 'Telegram';
        switchView(keyInputView, selectionView);
        startOTPTimer();
    });
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
    const wrapper = document.getElementById('telegram-open-wrapper');
    if (wrapper) wrapper.remove();
    switchView(selectionView, keyInputView);
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 2-Verification/Verification.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 3: Access -R- Key Passcode Logic & Verification <<=== */
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
    // Sirf numbers allow karo
    box.addEventListener('input', (e) => {
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

    // Paste support
    box.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
        if (pastedData.length === 6) {
            keyBoxes.forEach((b, i) => { b.value = pastedData[i] || ''; });
            keyBoxes[5].focus();
        }
    });
});
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 3A file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* —-- Function#2 BLOCK JS 3B: Verify Identity Execution —-- */
/* --------------------------------------------------------------------- */
/**
 * verifyKeyBtn: 
 * Database lookup ke liye ab 'login_mobile' (Old: phone) ka use hoga.
 * Rule: Match hone par turant delete nahi karna, taaki Sub-Block 4A 
 * Telegram ka verified naam utha sake.
 */
verifyKeyBtn.addEventListener('click', async () => {
    if (typeof triggerHaptic === 'function') triggerHaptic();

    // 1. Boxes se poora 6-digit code nikalo
    let enteredOTP = "";
    keyBoxes.forEach(box => enteredOTP += box.value);

    if (enteredOTP.length < 6) {
        return showIsland("Please enter the full 6-digit key.", "error");
    }

    const phone = sessionStorage.getItem('RP_Temp_Phone');
    const countryCode = sessionStorage.getItem('RP_Country_Code') || '+91';
    const fullPhone = (countryCode + phone).replace(/\s/g, '');

    if (!phone) {
        showIsland("Session expired. Please login again.", "error");
        setTimeout(() => { window.location.href = '../1-login/login.html'; }, 2000);
        return;
    }

    // UI State: Loading Visuals
    verifyKeyBtn.disabled = true;
    verifyKeyBtn.querySelector('.btn-text').style.opacity = '0';
    verifyKeyBtn.querySelector('.btn-loader').style.display = 'block';

    try {
        // 2. Database Lookup: Fetch OTP using 'login_mobile' column (New Naming)
        const { data: otpRecord, error } = await _sb
            .from('otp_store')
            .select('otp, expires_at')
            .eq('login_mobile', fullPhone) 
            .maybeSingle();

        if (error || !otpRecord) {
            throw new Error('Key not found. Please request a new code.');
        }

        // 3. Expiry Check
        const now = new Date();
        const expiry = new Date(otpRecord.expires_at);
        if (now > expiry) {
            throw new Error('Verification Key expired.');
        }

        // 4. OTP Match Check (The Gatekeeper)
        if (enteredOTP !== otpRecord.otp) {
            throw new Error('Invalid Key. Access Denied.');
        }

        // 5. Match Success!
        showIsland("Identity Confirmed!", "success");

        // Execute Final Identity Bridge (Sub-Block 4A)
        await handleIdentitySuccess();

    } catch (err) {
        console.error("Verification Guard Error:", err.message);
        showIsland(err.message, "error");

        // Clear Boxes for Retry
        keyBoxes.forEach(box => box.value = "");
        keyBoxes[0].focus();

        // Reset Button
        verifyKeyBtn.disabled = false;
        verifyKeyBtn.querySelector('.btn-text').style.opacity = '1';
        verifyKeyBtn.querySelector('.btn-loader').style.display = 'none';
    }
});
/* --------------------------------------------------------------------- */
/* —-- Function#2 END OF BLOCK JS 3B: file : 2-verification/Verification.js —-- */
/* --------------------------------------------------------------------- */


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

    // Boxes reset karo
    keyBoxes.forEach(box => box.value = "");
    keyBoxes[0].focus();

    // Wapis selection view par le jao
    const wrapper = document.getElementById('telegram-open-wrapper');
    if (wrapper) wrapper.remove();
    switchView(selectionView, keyInputView);

    showIsland("Please tap Telegram path again to resend.", "info");
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : 2-Verification/Verification.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 4: Device Guard & Anti-Theft Logic (Shift System) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A : handleIdentitySuccess (The Final Identity Bridge) --- */
/* --------------------------------------------------------------------- */
/**
 * handleIdentitySuccess: 
 * Naye naming convention (login_email, login_mobile, provider_name, telegram_name)
 * ke sath users table mein verified data silent save karta hai.
 */
async function handleIdentitySuccess() {
    const currentDID = localStorage.getItem('RP_DeviceID');
    const userType = sessionStorage.getItem('RP_User_Type');
    const tempEmail = sessionStorage.getItem('RP_Temp_Email');
    const tempPhone = sessionStorage.getItem('RP_Temp_Phone');
    const countryCode = sessionStorage.getItem('RP_Country_Code') || '+91';
    const fullPhone = (countryCode + tempPhone).replace(/\s/g, '');

    // Google/Yahoo Data from Session
    const verifiedName = sessionStorage.getItem('RP_Verified_Name') || "";
    const providerUID  = sessionStorage.getItem('RP_Provider_UID') || "";
    const authProvider = sessionStorage.getItem('RP_Auth_Provider') || "manual";

    // UI state: Processing
    verifyKeyBtn.disabled = true;
    verifyKeyBtn.querySelector('.btn-text').style.opacity = '0';
    verifyKeyBtn.querySelector('.btn-loader').style.display = 'block';

    try {
        // 1. Capture Telegram Name from otp_store (login_mobile column)
        const { data: otpData } = await _sb
            .from('otp_store')
            .select('telegram_name') 
            .eq('login_mobile', fullPhone)
            .maybeSingle();
        
        const telegramName = otpData?.telegram_name || "";

        // SCENARIO 1: Naya Identity Registration (First Time)
        if (userType === 'NEW') {
            const { error } = await _sb
                .from('users')
                .insert({
                    login_email: tempEmail,      
                    login_mobile: tempPhone,              
                    device_fingerprint: currentDID,
                    is_blocked: false,
                    created_at: new Date().toISOString(),
                    security_level: 'Standard',
                    // Hidden Identity Columns Updated
                    provider_name: verifiedName,         
                    provider_uid: providerUID,           
                    auth_provider: authProvider,         
                    telegram_name: telegramName 
                });

            if (error) throw new Error(error.message);

            showIsland("New Identity Created Successfully!", "success");
            setTimeout(() => { window.location.href = '../3-Dashboard/Dashboard.html'; }, 2000);
            return;
        }

        // SCENARIO 2: Purana Identity Sync (Login Flow)
        const { data: user, error: userError } = await _sb
            .from('users')
            .select('id, device_fingerprint, is_blocked')
            .eq('login_email', tempEmail)
            .single();

        if (userError) throw new Error("Account not found.");

        if (user.is_blocked) {
            return showHighAlert("This Identity is permanently suspended.");
        }

        // Silent Update: Data refresh in new columns
        await _sb
            .from('users')
            .update({ 
                provider_name: verifiedName,
                telegram_name: telegramName,
                identity_synced_at: new Date().toISOString()
            })
            .eq('id', user.id);

        // Device Guard Check
        if (user.device_fingerprint === currentDID) {
            showIsland("Device Verified. Welcome back!", "success");
            setTimeout(() => { window.location.href = '../3-Dashboard/Dashboard.html'; }, 1500);
        } else {
            // New device triggered shift protocol
            triggerDeviceShiftProtocol(user.id, currentDID);
        }

    } catch (err) {
        console.error("Identity Bridge Error:", err);
        showIsland(err.message, "error");
        
        verifyKeyBtn.disabled = false;
        verifyKeyBtn.querySelector('.btn-text').style.opacity = '1';
        verifyKeyBtn.querySelector('.btn-loader').style.display = 'none';
    }
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4A file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : Trigger Device Shift (Anti-Theft Protocol) --- */
/* --------------------------------------------------------------------- */
let shiftCountdown;

function triggerDeviceShiftProtocol(uid, newDID) {
    const shiftTimerText = document.getElementById('shift-timer-text');
    const timerRing = document.getElementById('timer-progress-ring');
    
    showIsland("New Device detected! Verification required.", "error");

    selectionView.style.display = 'none';
    keyInputView.style.display = 'none';
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
        if(shiftTimerText) shiftTimerText.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        const offset = ringCircumference - (timeLeft / totalTime) * ringCircumference;
        if(timerRing) timerRing.style.strokeDashoffset = offset;

        if (timeLeft <= 0) {
            clearInterval(shiftCountdown);
            handleShiftExpiry();
        }
        timeLeft--;
    }, 1000);

    if (typeof startShiftSyncListener === 'function') {
        startShiftSyncListener(uid, newDID);
    }
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4B file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4C : High Alert Logic (Access Blocked) --- */
/* --------------------------------------------------------------------- */
function showHighAlert(reason) {
    const blockScreen = document.getElementById('high-alert-screen');
    const blockReasonText = document.getElementById('block-reason');
    if (blockReasonText) blockReasonText.textContent = reason;
    if (blockScreen) blockScreen.style.display = 'flex';
    
    const container = document.getElementById('app-container');
    if (container) container.style.display = 'none';
}

function handleShiftExpiry() {
    showIsland("Verification time expired. Please re-login.", "error");
    setTimeout(() => { window.location.href = '../1-login/login.html'; }, 2000);
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4C file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : 2-verification/Verification.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 5: Real-time Identity Sync & Portal Finalization <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5A : Start Shift Sync Listener (The Magic Bridge) --- */
/* --------------------------------------------------------------------- */
/**
 * startShiftSyncListener: 
 * Supabase Real-time channel ka use karke primary device se APPROVED ya 
 * REJECTED signal sunta hai.
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
                    
                    // Device ko permanently block karo (Hiden Security Layer)
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
/* --- End Sub-Block 5A file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5B : Finalize Identity Entry (Database Sync) --- */
/* --------------------------------------------------------------------- */
/**
 * finalizeIdentityEntry: 
 * Naye device ki fingerprint ko 'users' table me update karke 
 * dashboard par bhejta hai.
 */
async function finalizeIdentityEntry(uid, newDID) {
    try {
        // Naming convention check: ID se naya fingerprint update
        const { error } = await _sb
            .from('users')
            .update({ device_fingerprint: newDID })
            .eq('id', uid);

        if (error) throw error;

        showIsland("Device Sync Complete. Redirecting...", "success");

        setTimeout(() => {
            // Path Fix: Case sensitive folder name (3-Dashboard)
            window.location.href = '../3-Dashboard/Dashboard.html';
        }, 1800);

    } catch (err) {
        console.error("Sync Error:", err);
        showIsland("Sync failed. Please try manual re-entry.", "error");
    }
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5B file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5C : Email Shift Link (Lost Phone Protocol) --- */
/* --------------------------------------------------------------------- */
document.getElementById('shift-via-email')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof triggerHaptic === 'function') triggerHaptic();
    showIsland("Email shift link will be active after 3 minutes.", "info");
});
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5C file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5D : Page Load Animation & Session Check --- */
/* --------------------------------------------------------------------- */
window.addEventListener('load', () => {
    // Session Guard: Check user status
    const tempEmail = sessionStorage.getItem('RP_Temp_Email');
    if (!tempEmail) {
        window.location.href = '../1-login/login.html';
        return;
    }

    // Card entrance animation (visionOS Style)
    const card = document.querySelector('.spatial-glass-card');
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95) translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.8s var(--spring-bounce)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
        }, 100);
    }

    if (typeof showIsland === 'function') showIsland("Select your Identity Path", "info");
});
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5D file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 5 file : 2-verification/Verification.js <<=== */
/* ===================================================================== */