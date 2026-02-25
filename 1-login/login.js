/* ===================================================================== */
/* ===>> DOCUMENTATION BLOCK : JS Architecture & Logic Rules <<=== */
/* ===================================================================== */
/* 
    FILE NAME: 1-login/login.js
    PROJECT: R-ight Person (Digital Identity System)
    BACKEND: Supabase (PostgreSQL + Auth)
    
    RULES & FLOW (IMPORTANT):
    
    1. SIGNUP RULES:
       - User must provide: Name, DOB, Gender, Email, Mobile, Pincode, Language.
       - Logic: Email OTP (via Supabase) -> OTP Verification -> Security Check 
         (Device Fingerprint) -> Database Entry.
       - Verification: Bina OTP aur real identity ke account create nahi hoga.

    2. LOGIN RULES (NO PASSWORD):
       - Step 1: User enters Email -> Get OTP.
       - Step 2: Verify OTP.
       - Step 3 (Device Security):
         - If OLD device: Direct entry to Dashboard.
         - If NEW device: Trigger "Device Shift Logic" (3-min timer). 
           Approval from old device or Email is mandatory.

    3. UI FEEDBACK PROTOCOL:
       - User feedback hamesha 'showIsland()' (Dynamic Island) se diya jayega.
       - 'console.log' sirf background debugging ke liye hai.
       - Action buttons par 'loading' state dikhana anivarya hai.

    4. TRANSITION RULES:
       - Smooth fading aur sliding logic (iPadOS Style).
       - Zero-Jerk transitions (No sudden display:none).
*/
/* ===================================================================== */
/* ===>> END OF DOCUMENTATION BLOCK <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 1: System Initialization (FIXED VARIABLE) <<=== */
/* ===================================================================== */

// Project Credentials
const SB_URL = "https://xtzdlepgpqvllwzjfrsh.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0emRsZXBncHF2bGx3empmcnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTI2MzcsImV4cCI6MjA4NzU2ODYzN30.NxX8BPCK_HNQYmn0-7YkdPv12gO8wKgOS5oP2R0OYZc";

// FIX: Variable ka naam '_sb' rakha hai taaki library se kabhi clash na ho
const _sb = supabase.createClient(SB_URL, SB_KEY);

// DOM Elements Selection
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const otpOverlay = document.getElementById('otp-overlay');
const loginBtn = document.getElementById('login-send-otp-btn');
const signupNextBtn = document.getElementById('signup-next-btn');
const verifyBtn = document.getElementById('verify-otp-btn');
const resendBtn = document.getElementById('resend-otp-link');
const backBtn = document.getElementById('otp-back');
const goToSignup = document.getElementById('go-to-signup');
const goToLogin = document.getElementById('go-to-login');
const dynamicIsland = document.getElementById('showIsland');
const islandMsg = document.getElementById('island-message');
const islandIcon = document.getElementById('island-icon');

// Universal Notification System
function showIsland(msg, type = 'info') {
    islandMsg.textContent = msg;
    let iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    if(type === 'success') iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    if(type === 'error') iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    
    islandIcon.innerHTML = iconSvg;
    dynamicIsland.classList.add('active');
    setTimeout(() => { dynamicIsland.classList.remove('active'); }, 3500);
}

function triggerHaptic() { if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(10); }

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 1-login/login.js <<=== */
/* ===================================================================== */

/* ===================================================================== */
/* ===>> BLOCK JS 2: Form Switcher & Transitions <<=== */
/* ===================================================================== */
function toggleForms(show, hide) {
    hide.style.opacity = '0';
    hide.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        hide.style.display = 'none';
        show.style.display = 'block';
        void show.offsetWidth;
        show.style.opacity = '1';
        show.style.transform = 'translateX(0)';
    }, 400);
}

goToSignup.addEventListener('click', () => toggleForms(signupForm, loginForm));
goToLogin.addEventListener('click', () => toggleForms(loginForm, signupForm));

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 1-login/login.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 3: Device Fingerprinting System (Security Core) <<=== */
/* ===================================================================== */
function generateDeviceFingerprint() {
    const nav = window.navigator;
    const screen = window.screen;
    const rawData = [nav.userAgent, nav.language, screen.colorDepth, screen.width + "x" + screen.height, new Date().getTimezoneOffset(), nav.hardwareConcurrency, nav.platform].join('###');
    
    // Create Hash
    let hash = 0;
    for (let i = 0; i < rawData.length; i++) {
        hash = ((hash << 5) - hash) + rawData.charCodeAt(i);
        hash |= 0;
    }
    const finalID = `DF-${Math.abs(hash).toString(36).toUpperCase()}`;
    localStorage.setItem('RP_DeviceID', finalID);
    return finalID;
}

// Initial ID set
const currentDeviceID = localStorage.getItem('RP_DeviceID') || generateDeviceFingerprint();
/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : 1-login/login.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 4: Smart OTP System (Identity Check Fix) <<=== */
/* ===================================================================== */

// OTP Auto-focus logic
const otpBoxes = document.querySelectorAll('.otp-box');
otpBoxes.forEach((box, index) => {
    box.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < otpBoxes.length - 1) otpBoxes[index + 1].focus();
    });
    box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && index > 0) otpBoxes[index - 1].focus();
    });
});

/**
 * sendOTP: Pehle identity check karega, phir hi code bhejega.
 */
async function sendOTP(email, type = 'login') {
    triggerHaptic();
    const activeBtn = type === 'login' ? loginBtn : signupNextBtn;
    const originalText = activeBtn.innerHTML;
    
    activeBtn.innerHTML = `<div class="btn-loader"></div>`;
    activeBtn.disabled = true;

    try {
        // 1. DATABASE CHECK (Pehle dekho user hamare record me hai ya nahi)
        const { data: userExists, error: dbError } = await _sb
            .from('users')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (dbError) throw new Error("Database connection error");

        // 2. LOGIC GATE (Decision making)
        if (type === 'login' && !userExists) {
            // User login karna chahta hai par account nahi hai
            showIsland("Account not found. Please sign up first.", "error");
            activeBtn.innerHTML = originalText;
            activeBtn.disabled = false;
            return;
        }

        if (type === 'signup' && userExists) {
            // User naya account banana chahta hai par email pehle se hai
            showIsland("Email already registered. Please sign in.", "error");
            activeBtn.innerHTML = originalText;
            activeBtn.disabled = false;
            return;
        }

        // 3. SEND OTP (Sirf tab jab upar ke rules pass honge)
        const { error } = await _sb.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: type === 'signup' // Signup me true, Login me false
            }
        });

        if (error) throw error;

        // Success UI change
        document.getElementById('display-email').textContent = email;
        otpOverlay.style.display = 'flex';
        showIsland("Verification code sent!", "success");
        startOTPTimer();

    } catch (error) {
        console.error("Auth Error:", error.message);
        showIsland(error.message || "Failed to send code", "error");
    } finally {
        activeBtn.innerHTML = originalText;
        activeBtn.disabled = false;
    }
}

// Button Listeners
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    if (!email) return showIsland("Please enter email", "error");
    sendOTP(email, 'login');
});

signupNextBtn.addEventListener('click', () => {
    const email = document.getElementById('signup-email').value;
    if (!email) return showIsland("Please enter email", "error");
    sendOTP(email, 'signup');
});

// Timer & Navigation
let timer;
function startOTPTimer() {
    let timeLeft = 120;
    const timerDisplay = document.getElementById('otp-timer');
    resendBtn.disabled = true;
    clearInterval(timer);
    timer = setInterval(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            resendBtn.disabled = false;
        }
        timeLeft--;
    }, 1000);
}

backBtn.addEventListener('click', () => {
    otpOverlay.style.display = 'none';
    clearInterval(timer);
});
/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : 1-login/login.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 5: Verification & Database Finalization (403 FIX) <<=== */
/* ===================================================================== */

verifyBtn.addEventListener('click', async () => {
    triggerHaptic();
    
    let token = "";
    otpBoxes.forEach(box => token += box.value);
    if (token.length < 6) return showIsland("Enter 6-digit code", "error");

    const email = document.getElementById('display-email').textContent;
    const originalText = verifyBtn.innerHTML;
    verifyBtn.innerHTML = `<div class="btn-loader"></div>`;
    verifyBtn.disabled = true;

    try {
        // --- 403 FIX Logic ---
        // Hum pehle 'magiclink' type try karenge kyunki Supabase OTP ko isi me count karta hai
        let { data, error } = await _sb.auth.verifyOtp({
            email,
            token,
            type: 'magiclink' 
        });

        // Agar magiclink fail ho, to 'signup' try karo (naye users ke liye)
        if (error) {
            console.log("Magiclink verify failed, trying signup type...");
            const secondaryTry = await _sb.auth.verifyOtp({
                email,
                token,
                type: 'signup'
            });
            data = secondaryTry.data;
            error = secondaryTry.error;
        }

        if (error) throw error;

        showIsland("Identity Verified!", "success");
        
        const isSignup = signupForm.style.display === 'block';
        if (isSignup) {
            await finalizeSignup(data.user.id, email);
        } else {
            handleLoginSuccess(data.user.id, email);
        }

    } catch (error) {
        console.error("Verification Error:", error.message);
        if (error.status === 403) {
            showIsland("Too many attempts. Wait 15 mins.", "error");
        } else {
            showIsland("Invalid code. Try again.", "error");
        }
        otpBoxes.forEach(box => box.value = "");
        otpBoxes[0].focus();
    } finally {
        verifyBtn.innerHTML = originalText;
        verifyBtn.disabled = false;
    }
});

async function finalizeSignup(uid, email) {
    showIsland("Saving identity...", "info");
    const genderValue = document.querySelector('#gender-select .option.selected')?.getAttribute('data-value') || "not_specified";

    const userData = {
        id: uid,
        email: email,
        full_name: document.getElementById('signup-name').value,
        dob: document.getElementById('signup-birthday').value,
        phone: document.getElementById('signup-mobile').value,
        pincode: document.getElementById('signup-pincode').value,
        language: document.getElementById('signup-language').value,
        gender: genderValue,
        device_fingerprint: localStorage.getItem('RP_DeviceID'),
        created_at: new Date()
    };

    try {
        const { error } = await _sb.from('users').insert([userData]);
        if (error) throw error;
        showIsland("Signup Complete!", "success");
        setTimeout(() => { window.location.href = '../dashboard/dashboard.html'; }, 1500);
    } catch (error) {
        showIsland("DB Error: Check if table exists", "error");
    }
}
/* ===================================================================== */
/* ===>> END OF BLOCK JS 5 file : 1-login/login.js <<=== */
/* ===================================================================== */




/* ===================================================================== */
/* ===>> BLOCK JS 6: Device Security & Guard Engine (FIXED) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 6A : handleLoginSuccess (Device Logic) --- */
/* --------------------------------------------------------------------- */
/**
 * handleLoginSuccess: Ye tay karta hai ki user seedha andar jayega ya 
 * use permission leni padegi.
 */
async function handleLoginSuccess(uid, email) {
    const currentDID = localStorage.getItem('RP_DeviceID');
    
    try {
        // FIX: '_sb' use kiya hai user data check karne ke liye
        const { data: user, error } = await _sb
            .from('users')
            .select('device_fingerprint, is_blocked')
            .eq('id', uid)
            .single();

        if (error) throw error;

        // 1. Check if user is blocked
        if (user.is_blocked) {
            return showHighAlert("This account is permanently suspended.");
        }

        // 2. Device Comparison
        if (user.device_fingerprint === currentDID) {
            showIsland("Device Verified. Welcome!", "success");
            setTimeout(() => { window.location.href = '../dashboard/dashboard.html'; }, 1500);
        } 
        // 3. New Device Detected
        else {
            triggerDeviceShiftSystem(uid, user.device_fingerprint, currentDID);
        }

    } catch (err) {
        showIsland("Security verification failed.", "error");
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 6B : Device Shift UI & Timer --- */
/* --------------------------------------------------------------------- */
const shiftPopup = document.getElementById('shift-popup');
const shiftTimerText = document.getElementById('shift-timer-text');
let shiftCountdown;

function triggerDeviceShiftSystem(uid, oldDID, newDID) {
    showIsland("New Device! Waiting for approval...", "warning");
    
    // Switch UI
    otpOverlay.style.display = 'none';
    shiftPopup.style.display = 'block';
    
    let timeLeft = 180; // 3 Minutes
    
    clearInterval(shiftCountdown);
    shiftCountdown = setInterval(() => {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        shiftTimerText.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        
        if (timeLeft <= 0) {
            clearInterval(shiftCountdown);
            showHighAlert("Request Expired. Please try again.");
            shiftPopup.style.display = 'none';
        }
        timeLeft--;
    }, 1000);

    // Waiting for signal (Block 7 me detail logic aayega)
    listenForShiftApproval(uid, newDID);
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 6C : High Alert Logic --- */
/* --------------------------------------------------------------------- */
function showHighAlert(reason) {
    const blockScreen = document.getElementById('block-screen');
    blockScreen.querySelector('p').textContent = reason;
    blockScreen.style.display = 'flex';
    appContainer.style.display = 'none';
    
    markDeviceBlocked(reason);
}

async function markDeviceBlocked(reason) {
    const deviceID = localStorage.getItem('RP_DeviceID');
    // FIX: '_sb' use kiya hai logs ke liye
    await _sb.from('security_logs').insert([{
        event_type: 'BLOCK_TRIGGERED',
        device_fingerprint: deviceID,
        details: reason
    }]);
}

function listenForShiftApproval(uid, newDID) {
    console.log("Waiting for signal from old device...");
}

/* ===================================================================== */
/* ===>> END OF BLOCK JS 6 file : 1-login/login.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 7: Real-time Sync & Final Authorization (FIXED) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 7A : Listen For Shift Approval (Real-time) --- */
/* --------------------------------------------------------------------- */
/**
 * listenForShiftApproval: Supabase Real-time channel se signal sunta hai.
 */
function listenForShiftApproval(uid, newDID) {
    // FIX: Variable '_sb' use kiya hai taaki library se takrao na ho
    const channel = _sb.channel(`device-shift-${uid}`);

    channel
        .on('broadcast', { event: 'shift-action' }, async ({ payload }) => {
            const { action, targetDevice } = payload;

            // Check karo ki ye signal isi naye device ke liye hai
            if (targetDevice === newDID) {
                if (action === 'APPROVED') {
                    clearInterval(shiftCountdown);
                    showIsland("Identity Authorized! Entering Dashboard...", "success");
                    await completeDeviceShift(uid, newDID);
                } 
                else if (action === 'REJECTED') {
                    clearInterval(shiftCountdown);
                    showHighAlert("Access Rejected by the account owner.");
                }
            }
        })
        .subscribe();
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 7B : Approve/Reject Signals (Old Device side) --- */
/* --------------------------------------------------------------------- */
/**
 * broadcastShiftAction: Purane device se naye device ko signal bhejta hai.
 */
async function broadcastShiftAction(uid, action, targetDID) {
    const channel = _sb.channel(`device-shift-${uid}`);
    
    await channel.send({
        type: 'broadcast',
        event: 'shift-action',
        payload: { action: action, targetDevice: targetDID }
    });

    if (action === 'APPROVED') {
        showIsland("Device Authorized. Sign-out in progress.", "info");
        setTimeout(async () => {
            await _sb.auth.signOut();
            window.location.reload();
        }, 2000);
    } else {
        showIsland("Device Blocked Successfully.", "error");
        shiftPopup.style.display = 'none';
    }
}

// Event Listeners for Shift Buttons (Approving from another device)
document.getElementById('approve-shift-btn').addEventListener('click', async () => {
    triggerHaptic();
    const { data: { session } } = await _sb.auth.getSession();
    if(session) {
        // uid aur targetID Notification system se aayenge (Phase 2)
        console.log("Device Approval Clicked");
    }
});

document.getElementById('reject-shift-btn').addEventListener('click', () => {
    triggerHaptic();
    console.log("Device Rejection Clicked");
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 7C : Complete Device Shift (DB Update) --- */
/* --------------------------------------------------------------------- */
async function completeDeviceShift(uid, newDID) {
    try {
        const { error } = await _sb
            .from('users')
            .update({ device_fingerprint: newDID })
            .eq('id', uid);

        if (error) throw error;

        showIsland("System Sync Complete.", "success");
        setTimeout(() => {
            window.location.href = '../dashboard/dashboard.html';
        }, 1500);

    } catch (err) {
        showIsland("Data sync failed. Try manual login.", "error");
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 7D : Session Management & Load Engine --- */
/* --------------------------------------------------------------------- */
/**
 * initApp: Page load hote hi session aur initial state check karta hai.
 */
async function initApp() {
    const { data: { session } } = await _sb.auth.getSession();
    
    if (session) {
        // Agar user login hai, to device verification shuru karo
        handleLoginSuccess(session.user.id, session.user.email);
    } else {
        showIsland("Portal Secure & Ready", "success");
    }
}

// Page load hote hi shuru karo
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Smooth initial fading for iPadOS feel
    appContainer.style.opacity = '0';
    setTimeout(() => {
        appContainer.style.transition = 'opacity 0.8s ease';
        appContainer.style.opacity = '1';
    }, 150);
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 7 file : 1-login/login.js <<=== */
/* ===================================================================== */