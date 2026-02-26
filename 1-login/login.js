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
/* ===>> BLOCK JS 1: Initialization & Global UI Engine (UPDATED) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1A : Supabase Client & Project Config --- */
/* --------------------------------------------------------------------- */
const SB_URL = "https://xtzdlepgpqvllwzjfrsh.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0emRsZXBncHF2bGx3empmcnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTI2MzcsImV4cCI6MjA4NzU2ODYzN30.NxX8BPCK_HNQYmn0-7YkdPv12gO8wKgOS5oP2R0OYZc";

// Global Instance
const _sb = supabase.createClient(SB_URL, SB_KEY);

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1B : DOM Element Selection (Selection Portal IDs) --- */
/* --------------------------------------------------------------------- */
// Main Form Containers
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const selectionPortal = document.getElementById('selection-portal');
const otpOverlay = document.getElementById('otp-overlay');

// Primary Buttons
const loginContinueBtn = document.getElementById('login-continue-btn');
const signupNextBtn = document.getElementById('signup-next-btn');
const selectionBackBtn = document.getElementById('selection-back-btn');
const verifyBtn = document.getElementById('verify-otp-btn');

// Selection Portal Cards
const chooseTelegram = document.getElementById('choose-telegram');
const chooseEmail = document.getElementById('choose-email');
const chooseWhatsapp = document.getElementById('choose-whatsapp');

// Navigation Links
const goToSignup = document.getElementById('go-to-signup');
const goToLogin = document.getElementById('go-to-login');

// Universal Notification Elements
const dynamicIsland = document.getElementById('showIsland');
const islandMsg = document.getElementById('island-message');
const islandIcon = document.getElementById('island-icon');

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1C : Universal Notification Engine --- */
/* --------------------------------------------------------------------- */
/**
 * showIsland: User ko har action par Apple style visual feedback deta hai.
 */
function showIsland(msg, type = 'info') {
    islandMsg.textContent = msg;
    let iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    
    if(type === 'success') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if(type === 'error') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    }
    
    islandIcon.innerHTML = iconSvg;
    dynamicIsland.classList.add('active');
    
    setTimeout(() => {
        dynamicIsland.classList.remove('active');
    }, 3500);
}

function triggerHaptic() {
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10); // Haptic feedback simulation
    }
}

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
/* ===>> BLOCK JS 4: Selection Logic & Path Routing (Access -R- Key) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A : Selection Card Listeners --- */
/* --------------------------------------------------------------------- */

// 1. Telegram Path (Free - Recommended)
chooseTelegram.addEventListener('click', () => {
    triggerHaptic();
    const phone = document.getElementById('login-mobile').value || document.getElementById('signup-mobile').value;
    
    showIsland("Connecting to Telegram Bot...", "info");
    
    // Telegram Bot Logic yahan shuru hogi
    handleVerificationPath('TELEGRAM', phone, 0);
});

// 2. iMail Path (Paid - $1)
chooseEmail.addEventListener('click', () => {
    triggerHaptic();
    showIsland("iMail Path costs $1.00. Payment system loading...", "warning");
    
    // Future: Integrate Stripe/PayPal here
    // Abhi ke liye hum seedha aage bhej rahe hain testing ke liye
    const email = document.getElementById('signup-email')?.value || "user@imail.com";
    handleVerificationPath('EMAIL', email, 1.00);
});

// 3. WhatsApp Path (Paid - $2)
chooseWhatsapp.addEventListener('click', () => {
    triggerHaptic();
    showIsland("WhatsApp Premium costs $2.00. Loading...", "warning");
    
    // Future: Integrate Payment
    const phone = document.getElementById('login-mobile').value || document.getElementById('signup-mobile').value;
    handleVerificationPath('WHATSAPP', phone, 2.00);
});


/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : Path Routing Logic --- */
/* --------------------------------------------------------------------- */
/**
 * handleVerificationPath: User ke chune huye raste ke hisab se action leta hai.
 * @param {string} method - TELEGRAM, EMAIL, ya WHATSAPP
 * @param {string} target - Phone number ya Email
 * @param {number} price - Cost of verification
 */
async function handleVerificationPath(method, target, price) {
    // 1. Target email/phone dikhao overlay par
    document.getElementById('display-email').textContent = target;
    
    // 2. Access -R- Key bhejne ki taiyari (Placeholder call)
    if(method === 'TELEGRAM') {
        // Asli Telegram Bot API call yahan aayegi (Phase 2)
        showIsland("Key sent to your Telegram!", "success");
    } else {
        // Email/WhatsApp Logic
        showIsland(`Key sent via ${method}!`, "success");
    }

    // 3. Smooth transition to OTP (Access -R- Key) Overlay
    showAccessKeyOverlay();
}


/* --------------------------------------------------------------------- */
/* --- Sub-Block 4C : Access -R- Key Overlay Controller --- */
/* --------------------------------------------------------------------- */
/**
 * showAccessKeyOverlay: 6-digit boxes wali screen dikhata hai.
 */
function showAccessKeyOverlay() {
    otpOverlay.style.display = 'flex';
    otpOverlay.style.opacity = '0';
    
    // Reflow and Animate
    void otpOverlay.offsetWidth;
    otpOverlay.style.transition = 'opacity 0.4s var(--ios-ease)';
    otpOverlay.style.opacity = '1';
    
    // Timer shuru karo
    startAccessKeyTimer();
    
    // Pehle box par focus karo
    setTimeout(() => {
        otpBoxes[0].focus();
    }, 500);
}

// Back button on Overlay
backBtn.addEventListener('click', () => {
    otpOverlay.style.opacity = '0';
    setTimeout(() => {
        otpOverlay.style.display = 'none';
    }, 400);
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : 1-login/login.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 5: Verification Execution & Final Identity Setup <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5A : Verify Access -R- Key --- */
/* --------------------------------------------------------------------- */
/**
 * verifyBtn Listener: 6-digit boxes se code uthakar verify karta hai.
 */
verifyBtn.addEventListener('click', async () => {
    triggerHaptic();
    
    // 1. Ikhatha karo saara code
    let token = "";
    otpBoxes.forEach(box => token += box.value);

    if (token.length < 6) return showIsland("Enter full 6-digit key", "error");

    const targetIdentity = document.getElementById('display-email').textContent;
    const originalText = verifyBtn.innerHTML;
    
    // UI Loading
    verifyBtn.innerHTML = `<div class="btn-loader"></div>`;
    verifyBtn.disabled = true;

    try {
        // 2. Supabase Verification Call
        // Note: Supabase OTP flow me 'magiclink' ya 'signup' type use hota hai
        const { data, error } = await _sb.auth.verifyOtp({
            email: targetIdentity, // Agar email hai
            token: token,
            type: 'magiclink' 
        });

        if (error) throw error;

        showIsland("Identity Confirmed!", "success");

        // 3. Logic Gate: Signup vs Login
        if (lastForm === signupForm) {
            await finalizeSignup(data.user.id, targetIdentity);
        } else {
            // Purana user: Device Guard trigger karo
            handleLoginSuccess(data.user.id, targetIdentity);
        }

    } catch (error) {
        console.error("Verification Error:", error.message);
        showIsland("Invalid Key. Please try again.", "error");
        otpBoxes.forEach(box => box.value = "");
        otpBoxes[0].focus();
    } finally {
        verifyBtn.innerHTML = originalText;
        verifyBtn.disabled = false;
    }
});


/* --------------------------------------------------------------------- */
/* --- Sub-Block 5B : Finalize Signup (Identity Database Entry) --- */
/* --------------------------------------------------------------------- */
/**
 * finalizeSignup: User ke real data ko 'users' table me permanent save karta hai.
 */
async function finalizeSignup(uid, identity) {
    showIsland("Securing your Digital Identity...", "info");

    const userData = {
        id: uid,
        email: document.getElementById('signup-email')?.value || identity,
        full_name: document.getElementById('signup-name').value,
        dob: document.getElementById('signup-birthday').value,
        phone: document.getElementById('signup-mobile').value,
        pincode: document.getElementById('signup-pincode').value,
        language: document.getElementById('signup-language').value,
        gender: selectedGender || "not_specified", // Block 2 se variable
        device_fingerprint: localStorage.getItem('RP_DeviceID'),
        created_at: new Date()
    };

    try {
        // Database Insert
        const { error } = await _sb
            .from('users')
            .insert([userData]);

        if (error) throw error;

        // Success: Redirect to Dashboard
        showIsland("Registration Elite! Welcome aboard.", "success");
        setTimeout(() => { 
            window.location.href = '../dashboard/dashboard.html'; 
        }, 1500);

    } catch (error) {
        console.error("Database Insert Error:", error);
        showIsland("Data Sync Failed. Contact Security.", "error");
    }
}


/* --------------------------------------------------------------------- */
/* --- Sub-Block 5C : Access Key Timer & Resend Logic --- */
/* --------------------------------------------------------------------- */
let keyTimer;
function startAccessKeyTimer() {
    let timeLeft = 120;
    const timerDisplay = document.getElementById('otp-timer');
    resendBtn.disabled = true;
    
    clearInterval(keyTimer);
    keyTimer = setInterval(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        
        if (timeLeft <= 0) {
            clearInterval(keyTimer);
            resendBtn.disabled = false;
        }
        timeLeft--;
    }, 1000);
}

// Resend Trigger
resendBtn.addEventListener('click', () => {
    const target = document.getElementById('display-email').textContent;
    showIsland("Requesting new Access -R- Key...", "info");
    // Path logic dobara trigger karo
    handleVerificationPath('TELEGRAM', target, 0); 
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 5 file : 1-login/login.js <<=== */
/* ===================================================================== */




/* ===================================================================== */
/* ===>> BLOCK JS 6: Device Guard & Anti-Theft Engine (UPDATED) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 6A : handleLoginSuccess (The Gatekeeper) --- */
/* --------------------------------------------------------------------- */
/**
 * handleLoginSuccess: Login ke baad ye tay karta hai ki entry seedha hogi ya verification se.
 */
async function handleLoginSuccess(uid, identity) {
    const currentDID = localStorage.getItem('RP_DeviceID');
    
    try {
        // 1. Database se user ka active device fingerprint fetch karo
        const { data: user, error } = await _sb
            .from('users')
            .select('device_fingerprint, is_blocked')
            .eq('id', uid)
            .single();

        if (error) throw error;

        // 2. Security Check: Kya account blocked hai?
        if (user.is_blocked) {
            return showHighAlert("This Identity is permanently suspended for security reasons.");
        }

        // 3. Comparison: Kya ye wahi purana device hai?
        if (user.device_fingerprint === currentDID) {
            showIsland("Device Verified. Welcome back!", "success");
            setTimeout(() => { 
                window.location.href = '../dashboard/dashboard.html'; 
            }, 1500);
        } 
        // 4. New Device Alert: Shift System trigger karo
        else {
            triggerDeviceShiftSystem(uid, user.device_fingerprint, currentDID);
        }

    } catch (err) {
        console.error("Security Engine Error:", err);
        showIsland("Security verification failed. Try manual entry.", "error");
    }
}


/* --------------------------------------------------------------------- */
/* --- Sub-Block 6B : Device Shift UI & Timer Logic --- */
/* --------------------------------------------------------------------- */
const shiftPopup = document.getElementById('shift-popup');
const shiftTimerText = document.getElementById('shift-timer-text');
let shiftCountdown;

/**
 * triggerDeviceShiftSystem: Naye device par 3-min timer aur popup dikhata hai.
 */
function triggerDeviceShiftSystem(uid, oldDID, newDID) {
    showIsland("New Device Detected! Authorization required.", "warning");
    
    // UI Transition: OTP Overlay hatao aur Shift popup dikhao
    otpOverlay.style.display = 'none';
    shiftPopup.style.display = 'block';
    
    let timeLeft = 180; // 3 Minutes (Apple Security Standard)
    
    clearInterval(shiftCountdown);
    shiftCountdown = setInterval(() => {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        shiftTimerText.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        
        if (timeLeft <= 0) {
            clearInterval(shiftCountdown);
            handleShiftTimeout();
        }
        timeLeft--;
    }, 1000);

    // Real-time Approval ka wait karo (Block 7 me detail me aayega)
    listenForShiftApproval(uid, newDID);
}


/* --------------------------------------------------------------------- */
/* --- Sub-Block 6C : High Alert & Device Blocking --- */
/* --------------------------------------------------------------------- */
/**
 * showHighAlert: Suspicious device ko poori tarah block kar deta hai.
 */
function showHighAlert(reason) {
    const blockScreen = document.getElementById('block-screen');
    const appContainer = document.getElementById('app-container');
    
    blockScreen.querySelector('p').textContent = reason;
    blockScreen.style.display = 'flex';
    appContainer.style.display = 'none'; // Lock the app UI
    
    logSecurityEvent('DEVICE_BLOCKED', reason);
}

/**
 * logSecurityEvent: Har suspicious activity ko security_logs table me dalta hai.
 */
async function logSecurityEvent(type, details) {
    const deviceID = localStorage.getItem('RP_DeviceID');
    await _sb.from('security_logs').insert([{
        event_type: type,
        device_fingerprint: deviceID,
        details: details
    }]);
}

function handleShiftTimeout() {
    shiftPopup.style.display = 'none';
    showIsland("Shift request expired. Try again.", "error");
}


/* --------------------------------------------------------------------- */
/* --- Sub-Block 6D : Approval Listener Placeholder --- */
/* --------------------------------------------------------------------- */
function listenForShiftApproval(uid, newDID) {
    // Ye function agle block me Supabase Real-time se connect hoga
    console.log("Listening for authorization signal from primary device...");
}

/* ===================================================================== */
/* ===>> END OF BLOCK JS 6 file : 1-login/login.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 7: Real-time Sync & Portal Initialization (FINAL) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 7A : Listen For Authorization Signal (Real-time) --- */
/* --------------------------------------------------------------------- */
/**
 * listenForShiftApproval: Supabase Real-time channel ka use karke primary 
 * device ke signal ka wait karta hai.
 */
function listenForShiftApproval(uid, newDID) {
    // Naya channel banao user ki unique ID se
    const channel = _sb.channel(`identity-auth-${uid}`);

    channel
        .on('broadcast', { event: 'shift-action' }, async ({ payload }) => {
            const { action, targetDevice } = payload;

            // Sirf is specific device ke liye signal pakdo
            if (targetDevice === newDID) {
                if (action === 'APPROVED') {
                    clearInterval(shiftCountdown);
                    showIsland("Authorization Granted! Syncing Identity...", "success");
                    
                    // Final Step: Database update karo aur andar bhejo
                    await finalizeDeviceShift(uid, newDID);
                } 
                else if (action === 'REJECTED') {
                    clearInterval(shiftCountdown);
                    showHighAlert("Authorization REJECTED by primary device.");
                }
            }
        })
        .subscribe();
}


/* --------------------------------------------------------------------- */
/* --- Sub-Block 7B : Finalize Device Shift (Database Write) --- */
/* --------------------------------------------------------------------- */
/**
 * finalizeDeviceShift: Naye device ki fingerprint ko 'users' table me update karta hai.
 */
async function finalizeDeviceShift(uid, newDID) {
    try {
        const { error } = await _sb
            .from('users')
            .update({ device_fingerprint: newDID })
            .eq('id', uid);

        if (error) throw error;

        showIsland("System Sync Complete. Welcome.", "success");
        
        // Final Transition to Dashboard
        setTimeout(() => {
            window.location.href = '../dashboard/dashboard.html';
        }, 1500);

    } catch (err) {
        showIsland("Database sync failed. Try manual entry.", "error");
    }
}


/* --------------------------------------------------------------------- */
/* --- Sub-Block 7C : Broadcast Logic (Old Device side) --- */
/* --------------------------------------------------------------------- */
/**
 * sendAuthSignal: Jab purane device par notification aayegi, wahan se signal bhejega.
 */
async function sendAuthSignal(uid, action, targetDID) {
    const channel = _sb.channel(`identity-auth-${uid}`);
    
    await channel.send({
        type: 'broadcast',
        event: 'shift-action',
        payload: { action: action, targetDevice: targetDID }
    });

    if (action === 'APPROVED') {
        showIsland("Identity Authorized. Logging out this device.", "info");
        // Security Rule: Purane device ko logout kar do
        setTimeout(async () => {
            await _sb.auth.signOut();
            window.location.reload();
        }, 2000);
    }
}

// Approval/Reject Button Listeners (Manual triggers for testing)
document.getElementById('approve-shift-btn')?.addEventListener('click', () => {
    triggerHaptic();
    console.log("Remote Approval Triggered");
});

document.getElementById('reject-shift-btn')?.addEventListener('click', () => {
    triggerHaptic();
    console.log("Remote Rejection Triggered");
});


/* --------------------------------------------------------------------- */
/* --- Sub-Block 7D : App Initialization Engine (On Load) --- */
/* --------------------------------------------------------------------- */
/**
 * initIdentityPortal: Page load hote hi session aur state check karta hai.
 */
async function initIdentityPortal() {
    // 1. Check for active session
    const { data: { session } } = await _sb.auth.getSession();
    
    if (session) {
        // Agar user login hai, to uska device check karo
        handleLoginSuccess(session.user.id, session.user.email);
    } else {
        // Naye user ke liye portal ready
        showIsland("Portal Secure & Ready", "success");
    }

    // 2. Initial UI Animation
    appContainer.style.opacity = '0';
    setTimeout(() => {
        appContainer.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)';
        appContainer.style.opacity = '1';
    }, 100);
}

// Sabse pehle engine start karo
document.addEventListener('DOMContentLoaded', initIdentityPortal);

/* ===================================================================== */
/* ===>> END OF BLOCK JS 7 file : 1-login/login.js <<=== */
/* ===================================================================== */