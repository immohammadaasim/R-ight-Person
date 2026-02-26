/* ===================================================================== */
/* ===>> BLOCK JS 0: Documentation & Modular Engine Rules <<=== */
/* ===================================================================== */
/* 
    FILE NAME: 1-login/login.js
    PROJECT: R-ight Person (Digital Identity System)
    ARCHITECTURE: Modular Architecture (Entry Module)
    
    LOGIC FLOW:
    1. INITIALIZE: Set up Supabase connection and select DOM elements.
    2. FINGERPRINT: Generate unique Device ID (DF-ID) for security.
    3. VALIDATE: Check if Mobile & Gmail inputs are real and valid.
    4. GATEWAY BRIDGE: 
       - If New User: Route to Selection Portal in gateway.html.
       - If Old User: Trigger Device Verification in gateway.html.
       
    RULES:
    - No direct navigation allowed to gateway.html without basic validation.
    - All UI feedback must go through showIsland() (Dynamic Island).
    - Haptic visuals mandatory on all button actions.
    - Silent logging for background debugging.
*/
/* ===================================================================== */
/* ===>> END OF BLOCK JS 0 file : 1-login/login.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 1: System Initialization & Global UI Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1A : Supabase & Project Credentials --- */
/* --------------------------------------------------------------------- */
const SB_URL = "https://xtzdlepgpqvllwzjfrsh.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0emRsZXBncHF2bGx3empmcnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTI2MzcsImV4cCI6MjA4NzU2ODYzN30.NxX8BPCK_HNQYmn0-7YkdPv12gO8wKgOS5oP2R0OYZc";

// Modular Architecture: Initialize Supabase once
const _sb = supabase.createClient(SB_URL, SB_KEY);

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1B : DOM Element Selection (Entry Portal) --- */
/* --------------------------------------------------------------------- */
// Input Elements
const mobileInput = document.getElementById('user-mobile');
const emailInput = document.getElementById('user-email');
const countryTrigger = document.getElementById('country-trigger');

// Action Buttons
const continueBtn = document.getElementById('entry-continue-btn');

// Notification UI
const dynamicIsland = document.getElementById('showIsland');
const islandMsg = document.getElementById('island-message');
const islandIcon = document.getElementById('island-icon');

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1C : Universal Notification Protocol (The Island) --- */
/* --------------------------------------------------------------------- */
/**
 * showIsland: User ko har choti-badi baat batane wala function.
 * @param {string} msg - Jo user ko dikhana hai.
 * @param {string} type - 'success', 'error', ya 'info'.
 */
function showIsland(msg, type = 'info') {
    // 1. Text aur Style set karo
    islandMsg.textContent = msg;
    dynamicIsland.className = `dynamic-island active ${type}`;
    
    // 2. Icon change logic (Thin Apple-style SVGs)
    let iconSvg = '';
    if(type === 'success') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if(type === 'error') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
    islandIcon.innerHTML = iconSvg;

    // 3. Auto-hide logic (iPadOS standard: 3.5s)
    setTimeout(() => {
        dynamicIsland.classList.remove('active');
    }, 3500);
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1D : Haptic Visuals & Feedback Helper --- */
/* --------------------------------------------------------------------- */
function triggerHapticFeedback() {
    // Mobile devices par real vibration trigger karega
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10);
    }
    // Background silent log for ELITE debugging
    console.log("System Status: Haptic feedback simulated.");
}

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 1-login/login.js <<=== */
/* ===================================================================== */




/* ===================================================================== */
/* ===>> BLOCK JS 2: Device Fingerprinting System (Security Engine) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2A : Fingerprint Generator (Identity DNA) --- */
/* --------------------------------------------------------------------- */
/**
 * generateDeviceFingerprint: Device ki hardware aur software detail se 
 * ek unique ID (Digital DNA) banata hai.
 */
function generateDeviceFingerprint() {
    const nav = window.navigator;
    const screen = window.screen;

    // Device attributes ikhatha karo (Hardware + Software)
    const rawDNA = [
        nav.userAgent,
        nav.language,
        screen.colorDepth,
        screen.width + "x" + screen.height,
        new Date().getTimezoneOffset(),
        nav.hardwareConcurrency, // CPU Cores count
        nav.platform,
        !!window.chrome // Browser signature
    ].join('###');

    // Is data ko ek unique Hash ID me badlo
    const deviceHash = createSecureHash(rawDNA);
    const finalID = `DF-${deviceHash.toUpperCase()}`;
    
    // LocalStorage me save karo taaki future modules (gateway/dashboard) ise use kar sakein
    localStorage.setItem('RP_DeviceID', finalID);
    
    return finalID;
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2B : The Hashing Logic (Pro-Elite Level) --- */
/* --------------------------------------------------------------------- */
/**
 * createSecureHash: Raw string ko 12-digit alphanumeric code me badalta hai.
 */
function createSecureHash(str) {
    let hash = 0;
    if (str.length === 0) return '000000000000';
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32bit integer conversion
    }
    
    // Salt aur Base-36 conversion for premium security
    const salt = Math.abs(hash).toString(36);
    return (salt + "rp2025").substring(0, 12);
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2C : Initial Security Run --- */
/* --------------------------------------------------------------------- */
// Page load hote hi device ki pehchan pakki karo
const currentDeviceID = localStorage.getItem('RP_DeviceID') || generateDeviceFingerprint();

// Silent Log (Only for developers, not for users)
console.log("Modular Engine: Device ID Identified ->", currentDeviceID);

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 1-login/login.js <<=== */
/* ===================================================================== */




/* ===================================================================== */
/* ===>> BLOCK JS 3: Entry Engine & Identity Routing (FULL BLOCK) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3A : Input Validation (Real-Time Safety) --- */
/* --------------------------------------------------------------------- */
/**
 * validateEntry: Check karta hai ki email aur phone ka format sahi hai.
 */
function validateEntry(email, phone) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!phone || phone.length < 7) {
        showIsland("Please enter a valid mobile number.", "error");
        return false;
    }
    if (!email || !emailRegex.test(email)) {
        showIsland("Please enter a valid Gmail address.", "error");
        return false;
    }
    return true;
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3B : Main Entry Execution (The Bridge) --- */
/* --------------------------------------------------------------------- */
/**
 * handleEntry: "Continue" button dabane par asli logic trigger karta hai.
 */
continueBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim().toLowerCase();
    const phone = mobileInput.value.trim();

    // 1. Basic validation check
    if (!validateEntry(email, phone)) return;

    // 2. Visual Feedback (Haptic + Loading)
    triggerHapticFeedback();
    continueBtn.disabled = true;
    continueBtn.querySelector('.btn-text').style.opacity = '0';
    continueBtn.querySelector('.btn-loader').style.display = 'block';

    try {
        // 3. Database Check: Kya ye user pehle se registered hai?
        const { data: user, error } = await _sb
            .from('users')
            .select('id, email, device_fingerprint, is_blocked')
            .eq('email', email)
            .maybeSingle();

        if (error) throw error;

        // 4. Temporary storage (taaki Verification.html ko pata chale ki kaun aaya hai)
        sessionStorage.setItem('RP_Temp_Email', email);
        sessionStorage.setItem('RP_Temp_Phone', phone);

        // 5. Routing Logic
        if (user) {
            // CASE: OLD USER
            if (user.is_blocked) {
                showIsland("This account is suspended.", "error");
                resetBtnState();
                return;
            }
            sessionStorage.setItem('RP_User_Type', 'OLD');
            sessionStorage.setItem('RP_Active_DID', user.device_fingerprint);
            showIsland("Account identified. Proceeding...", "success");
        } else {
            // CASE: NEW USER
            sessionStorage.setItem('RP_User_Type', 'NEW');
            showIsland("New Identity detected. Welcome!", "success");
        }

        // 6. Final Transition: Bhejo Verification.html par (PATH FIXED)
        setTimeout(() => {
            window.location.href = '../2-verification/Verification.html';
        }, 1200);

    } catch (err) {
        console.error("Entry Logic Error:", err);
        showIsland("Connection failed. Try again.", "error");
        resetBtnState();
    }
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3C : UI Reset Helper --- */
/* --------------------------------------------------------------------- */
function resetBtnState() {
    continueBtn.disabled = false;
    continueBtn.querySelector('.btn-text').style.opacity = '1';
    continueBtn.querySelector('.btn-loader').style.display = 'none';
}

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : 1-login/login.js <<=== */
/* ===================================================================== */




/* ===================================================================== */
/* ===>> BLOCK JS 4: Entry Validation & Gateway Routing (FULL BLOCK) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A : Extended Input Validation Rules --- */
/* --------------------------------------------------------------------- */
/**
 * validateInputs: Mobile aur Email ki strict validation karta hai.
 */
function validateInputs(email, mobile) {
    if (!mobile || mobile.replace(/[^\d]/g, '').length < 7) {
        showIsland("Please enter a valid mobile number.", "error");
        mobileInput.focus();
        return false;
    }
    
    const emailRegex = /^[^\s@]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
        showIsland("Please enter a valid Gmail address.", "error");
        emailInput.focus();
        return false;
    }
    return true;
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : Global Continue Action (Path Safety) --- */
/* --------------------------------------------------------------------- */
/**
 * Note: Ye block extra validation layer ke liye hai. 
 * Isme redirection path ko fix kar diya gaya hai.
 */
async function triggerGlobalEntry() {
    const email = emailInput.value.trim().toLowerCase();
    const mobile = mobileInput.value.trim();

    if (!validateInputs(email, mobile)) return;

    // Redirection call for safety (PATH FIXED)
    console.log("Modular Architecture: Routing to Verification Module...");
    // window.location.href = '../2-verification/Verification.html';
}

/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : 1-login/login.js <<=== */
/* ===================================================================== */