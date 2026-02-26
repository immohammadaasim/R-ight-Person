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
    const email = sessionStorage.getItem('RP_Temp_Email');
    
    showIsland("Requesting Key via Telegram...", "info");
    
    // Asli OTP bhejne ka logic trigger karo
    requestAccessKey(email, 'TELEGRAM');
});

// 2. iMail Path (Coming Soon - Paid $1.00)
pathEmail.addEventListener('click', () => {
    triggerHaptic();
    showIsland("iMail Path is coming soon ($1.00 fee).", "warning");
});

// 3. WhatsApp Path (Coming Soon - Paid $2.00)
pathWhatsapp.addEventListener('click', () => {
    triggerHaptic();
    showIsland("WhatsApp Premium is coming soon ($2.00 fee).", "warning");
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2B : Request Access Key (Supabase Auth) --- */
/* --------------------------------------------------------------------- */
/**
 * requestAccessKey: User ke chosen email par 6-digit code bhejta hai.
 */
async function requestAccessKey(email, pathType) {
    try {
        // Supabase OTP System call
        const { error } = await _sb.auth.signInWithOtp({
            email: email,
            options: {
                // User naya ho ya purana, OTP jana chahiye
                shouldCreateUser: sessionStorage.getItem('RP_User_Type') === 'NEW'
            }
        });

        if (error) throw error;

        // Success: UI update karo
        document.getElementById('target-identity').textContent = pathType;
        showIsland(`Access -R- Key sent to your ${pathType}!`, "success");
        
        // Transition to 6-digit boxes view
        switchView(keyInputView, selectionView);
        
        // Timer shuru karo (Logic Block 3 me aayega)
        startOTPTimer();

    } catch (err) {
        console.error("Auth Request Error:", err.message);
        showIsland("Failed to send key. Check your connection.", "error");
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2C : Navigation Helpers --- */
/* --------------------------------------------------------------------- */

// "Edit Mobile/Gmail" dabane par wapis login page par bhejo
goBackBtn.addEventListener('click', () => {
    triggerHaptic();
    window.location.href = '../1-login/login.html';
});

// "Change Path" dabane par wapis selection cards dikhao
changePathBtn.addEventListener('click', () => {
    triggerHaptic();
    switchView(selectionView, keyInputView);
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 2-verification/Verification.js <<=== */
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
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3B : Verify Identity Execution --- */
/* --------------------------------------------------------------------- */
/**
 * verifyKeyBtn: 6-digit code ko verify karke identity confirm karta hai.
 */
verifyKeyBtn.addEventListener('click', async () => {
    triggerHaptic();
    
    // 1. Boxes se poora code nikalon
    let token = "";
    keyBoxes.forEach(box => token += box.value);

    if (token.length < 6) {
        return showIsland("Please enter the full 6-digit key.", "error");
    }

    const email = sessionStorage.getItem('RP_Temp_Email');
    
    // UI State: Loading
    verifyKeyBtn.disabled = true;
    verifyKeyBtn.querySelector('.btn-text').style.opacity = '0';
    verifyKeyBtn.querySelector('.btn-loader').style.display = 'block';

    try {
        // 2. Supabase Verification Call
        // Note: Supabase me OTP ke liye 'magiclink' type use hota hai
        const { data, error } = await _sb.auth.verifyOtp({
            email: email,
            token: token,
            type: 'magiclink' 
        });

        if (error) throw error;

        // 3. Success!
        showIsland("Identity Confirmed!", "success");

        // 4. Routing Logic: Dashboard ya Device Guard?
        handleIdentitySuccess(data.user.id);

    } catch (err) {
        console.error("Verification Error:", err.message);
        showIsland("Invalid Key. Please check and try again.", "error");
        
        // Boxes reset karo aur pehle par focus lao
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
    const email = sessionStorage.getItem('RP_Temp_Email');
    requestAccessKey(email, 'TELEGRAM'); // Block 2 function call
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : 2-verification/Verification.js <<=== */
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
async function handleIdentitySuccess(uid) {
    const currentDID = localStorage.getItem('RP_DeviceID');
    const userType = sessionStorage.getItem('RP_User_Type');

    // 1. Agar User bilkul naya (New Identity) hai
    if (userType === 'NEW') {
        showIsland("New Identity Confirmed. Welcome!", "success");
        setTimeout(() => { window.location.href = '../3-dashboard/dashboard.html'; }, 1500);
        return;
    }

    // 2. Agar User purana hai, to database se uska registered device check karo
    try {
        const { data: user, error } = await _sb
            .from('users')
            .select('device_fingerprint, is_blocked')
            .eq('id', uid)
            .single();

        if (error) throw error;

        // Blocked account check
        if (user.is_blocked) {
            return showHighAlert("This Identity is permanently suspended.");
        }

        // 3. Device Comparison Logic
        if (user.device_fingerprint === currentDID) {
            // Wahi purana device hai
            showIsland("Device Verified. Welcome back!", "success");
            setTimeout(() => { window.location.href = '../3-dashboard/dashboard.html'; }, 1500);
        } else {
            // Naya device detected -> Shift Protocol trigger karo
            triggerDeviceShiftProtocol(uid, currentDID);
        }

    } catch (err) {
        console.error("Device Guard Error:", err);
        showIsland("Security engine failed. Contact Support.", "error");
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : Trigger Device Shift (3-Minute Timer) --- */
/* --------------------------------------------------------------------- */
const shiftTimerText = document.getElementById('shift-timer-text');
const timerRing = document.getElementById('timer-progress-ring');
let shiftCountdown;

function triggerDeviceShiftProtocol(uid, newDID) {
    showIsland("Unauthorized Device! Authorization required.", "warning");
    
    // UI Switch: Key Input hatao aur Guard View dikhao
    switchView(shiftGuardView, keyInputView);
    
    let timeLeft = 180; // 3 Minutes (180 Seconds)
    const totalTime = 180;
    const ringCircumference = 339; // 2 * PI * 54

    clearInterval(shiftCountdown);
    shiftCountdown = setInterval(() => {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        shiftTimerText.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        
        // Circular ring update logic
        const offset = ringCircumference - (timeLeft / totalTime) * ringCircumference;
        timerRing.style.strokeDashoffset = offset;

        if (timeLeft <= 0) {
            clearInterval(shiftCountdown);
            handleShiftExpiry();
        }
        timeLeft--;
    }, 1000);

    // Real-time listener shuru karo (Final Block me detail code aayega)
    startShiftSyncListener(uid, newDID);
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4C : High Alert & Block Screen --- */
/* --------------------------------------------------------------------- */
function showHighAlert(reason) {
    const blockScreen = document.getElementById('high-alert-screen');
    document.getElementById('block-reason').textContent = reason;
    blockScreen.style.display = 'flex';
    appContainer.style.display = 'none'; // Poore portal ko lock kar do
}

function handleShiftExpiry() {
    showIsland("Shift request expired. Try manual login.", "error");
    setTimeout(() => { window.location.href = '../1-login/login.html'; }, 2000);
}

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
 * startShiftSyncListener: Supabase Real-time channel ka use karke primary 
 * device se aane wale 'APPROVED' ya 'REJECTED' signal ko sunta hai.
 */
function startShiftSyncListener(uid, newDID) {
    // Unique channel for this specific user's sync
    const syncChannel = _sb.channel(`identity-sync-${uid}`);

    syncChannel
        .on('broadcast', { event: 'auth-response' }, async ({ payload }) => {
            const { action, targetDeviceID } = payload;

            // Check karo ki ye signal isi naye device ke liye bheja gaya hai
            if (targetDeviceID === newDID) {
                if (action === 'APPROVED') {
                    // Stop timer and notify user
                    clearInterval(shiftCountdown);
                    showIsland("Authorization Granted by Primary Device!", "success");
                    
                    // Naye device ko active banana
                    await finalizeIdentityEntry(uid, newDID);
                } 
                else if (action === 'REJECTED') {
                    clearInterval(shiftCountdown);
                    showHighAlert("Authorization REJECTED. This device is now flagged.");
                }
            }
        })
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log("Modular Engine: Real-time sync active for UID ->", uid);
            }
        });
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5B : Finalize Identity Entry (Database Sync) --- */
/* --------------------------------------------------------------------- */
/**
 * finalizeIdentityEntry: Naye device ki fingerprint ko 'users' table me 
 * permanent update karke dashboard par bhejta hai.
 */
async function finalizeIdentityEntry(uid, newDID) {
    try {
        // Database update command
        const { error } = await _sb
            .from('users')
            .update({ device_fingerprint: newDID })
            .eq('id', uid);

        if (error) throw error;

        // Success: Transition to the Identity World
        showIsland("Identity Sync Complete. Redirecting...", "success");
        
        setTimeout(() => {
            window.location.href = '../3-dashboard/dashboard.html';
        }, 1800);

    } catch (err) {
        console.error("Sync Error:", err);
        showIsland("Database sync failed. Try manual re-entry.", "error");
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5C : Post-Verification Clean Exit --- */
/* --------------------------------------------------------------------- */
// Agar user 3 minute tak wait nahi karna chahta aur email rasta chunta hai
document.getElementById('shift-via-email')?.addEventListener('click', (e) => {
    e.preventDefault();
    triggerHaptic();
    showIsland("Email link will be active in 3 minutes.", "info");
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5D : Initial Module UI Polish --- */
/* --------------------------------------------------------------------- */
// Page load par halki si animation taaki Apple visionOS feel aaye
window.addEventListener('load', () => {
    const card = document.querySelector('.spatial-glass-card');
    if(card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transition = 'all 0.8s var(--spring-bounce)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 100);
    }
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 5 file : 2-verification/Verification.js <<=== */
/* ===================================================================== */