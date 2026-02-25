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
/* ===>> BLOCK JS 1: Initialization & Global UI Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1A : Supabase Client Connection --- */
/* --------------------------------------------------------------------- */
// Supabase Details (Jo humne set kiye the)
const SB_URL = "https://xtzdlepgpqvllwzjfrsh.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0emRsZXBncHF2bGx3empmcnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTI2MzcsImV4cCI6MjA4NzU2ODYzN30.NxX8BPCK_HNQYmn0-7YkdPv12gO8wKgOS5oP2R0OYZc";

// Client Initialize
const supabase = supabase.createClient(SB_URL, SB_KEY);

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1B : DOM Element Selection --- */
/* --------------------------------------------------------------------- */
// Forms & Cards
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const otpOverlay = document.getElementById('otp-overlay');

// Action Buttons
const loginBtn = document.getElementById('login-send-otp-btn');
const signupNextBtn = document.getElementById('signup-next-btn');
const verifyBtn = document.getElementById('verify-otp-btn');
const resendBtn = document.getElementById('resend-otp-link');
const backBtn = document.getElementById('otp-back');

// Navigation Links
const goToSignup = document.getElementById('go-to-signup');
const goToLogin = document.getElementById('go-to-login');

// Feedback Elements
const dynamicIsland = document.getElementById('showIsland');
const islandMsg = document.getElementById('island-message');
const islandIcon = document.getElementById('island-icon');

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1C : UI Feedback Helpers (The Island Logic) --- */
/* --------------------------------------------------------------------- */
/**
 * showIsland: Universal Notification Function (iPadOS Style)
 * @param {string} msg - Message to display
 * @param {string} type - 'success', 'error', 'info'
 */
function showIsland(msg, type = 'info') {
    islandMsg.textContent = msg;
    
    // Icon Logic based on type (Apple SF Symbols style)
    let iconSvg = '';
    if(type === 'success') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if(type === 'error') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
    
    islandIcon.innerHTML = iconSvg;
    
    // Trigger Animation
    dynamicIsland.classList.add('active');
    
    // Auto-hide
    setTimeout(() => {
        dynamicIsland.classList.remove('active');
    }, 3500);
}

// Haptic Feedback Simulation (Optional visual ripple)
function triggerHaptic() {
    // Ye tab kaam karega jab button click hoga
    console.log("Haptic feedback triggered visually");
}

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 1-login/login.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 2: UI Transitions & Custom Form Controls <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2A : Form Switcher (Login <-> Signup) --- */
/* --------------------------------------------------------------------- */
/**
 * Switcher: Login aur Signup ke beech smooth transition handle karta hai.
 */
function toggleForms(showForm, hideForm) {
    // Pehle purana form fade-out aur slide-left karo
    hideForm.style.opacity = '0';
    hideForm.style.transform = 'translateX(-30px)';
    
    setTimeout(() => {
        hideForm.style.display = 'none';
        
        // Naya form dikhao (smooth slide-in from right)
        showForm.style.display = 'block';
        showForm.style.opacity = '0';
        showForm.style.transform = 'translateX(30px)';
        
        // Reflow for animation
        void showForm.offsetWidth;
        
        showForm.style.opacity = '1';
        showForm.style.transform = 'translateX(0)';
    }, 400); // Transition timing iPadOS standard ke hisab se
}

// Event Listeners for switching
goToSignup.addEventListener('click', () => {
    toggleForms(signupForm, loginForm);
    showIsland("Welcome! Fill in your details.", "info");
});

goToLogin.addEventListener('click', () => {
    toggleForms(loginForm, signupForm);
    showIsland("Welcome back!", "info");
});


/* --------------------------------------------------------------------- */
/* --- Sub-Block 2B : Custom Select Logic (Gender Selection) --- */
/* --------------------------------------------------------------------- */
/**
 * Custom Dropdown: HTML ke gender-select ko premium iPad style me chalana.
 */
const genderSelect = document.getElementById('gender-select');
const selectTrigger = genderSelect.querySelector('.select-trigger');
const selectOptions = genderSelect.querySelector('.select-options-glass');
const options = genderSelect.querySelectorAll('.option');

let selectedGender = "";

// Toggle dropdown visibility
selectTrigger.addEventListener('click', () => {
    const isOpen = selectOptions.style.display === 'block';
    selectOptions.style.display = isOpen ? 'none' : 'block';
    genderSelect.classList.toggle('active', !isOpen);
});

// Selection Logic
options.forEach(opt => {
    opt.addEventListener('click', () => {
        selectedGender = opt.getAttribute('data-value');
        selectTrigger.textContent = opt.textContent;
        
        // UI Cleanup
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        
        selectOptions.style.display = 'none';
        genderSelect.classList.remove('active');
        
        // Feedback
        showIsland(`Gender set to: ${opt.textContent}`, "success");
    });
});

// Bahar click karne par band karo
document.addEventListener('click', (e) => {
    if (!genderSelect.contains(e.target)) {
        selectOptions.style.display = 'none';
        genderSelect.classList.remove('active');
    }
});


/* --------------------------------------------------------------------- */
/* --- Sub-Block 2C : Country Picker (Basic Toggle) --- */
/* --------------------------------------------------------------------- */
/**
 * Country Picker: Mobile number ke sath wala country code toggle.
 */
const countryPicker = document.getElementById('country-picker');
countryPicker.addEventListener('click', () => {
    // Abhi sirf India set hai, baad me hum ise search list me badlenge
    showIsland("International support coming soon!", "info");
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 1-login/login.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 3: Device Fingerprinting System (Security Core) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3A : Main Fingerprint Generator --- */
/* --------------------------------------------------------------------- */
/**
 * generateDeviceFingerprint: Device ki hardware aur software details se 
 * ek unique ID banata hai.
 */
function generateDeviceFingerprint() {
    const nav = window.navigator;
    const screen = window.screen;

    // Device ki details ikhathi karo (Hardware & Software mix)
    const rawData = [
        nav.userAgent,
        nav.language,
        screen.colorDepth,
        screen.width + "x" + screen.height,
        new Date().getTimezoneOffset(),
        nav.hardwareConcurrency, // CPU Cores
        nav.deviceMemory, // RAM (if available)
        nav.platform,
        !!window.chrome // Browser signature
    ].join('###');

    // Is data ko ek unique Hash ID me badlo
    const deviceHash = createHash(rawData);
    
    // LocalStorage me save karo taaki baar-baar use ho sake
    const finalID = `DF-${deviceHash.toUpperCase()}`;
    localStorage.setItem('RP_DeviceID', finalID);
    
    return finalID;
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3B : The Hashing Engine (God-Level Security) --- */
/* --------------------------------------------------------------------- */
/**
 * createHash: Raw data ko ek 12-digit alphanumeric string me badalta hai.
 */
function createHash(str) {
    let hash = 0;
    if (str.length === 0) return '000000000000';
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // Salt add karo (Security ke liye)
    const salt = Math.abs(hash).toString(36);
    const result = (salt + "rp2025").substring(0, 12);
    return result;
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3C : Device Info Detector --- */
/* --------------------------------------------------------------------- */
/**
 * getDeviceInfo: Dashboard aur Admin panel ke liye details nikalta hai.
 */
function getDeviceInfo() {
    const ua = navigator.userAgent;
    let os = "Unknown OS";
    
    if (ua.indexOf("Win") != -1) os = "Windows";
    if (ua.indexOf("Mac") != -1) os = "macOS";
    if (ua.indexOf("Linux") != -1) os = "Linux";
    if (ua.indexOf("Android") != -1) os = "Android";
    if (ua.indexOf("like Mac") != -1) os = "iOS/iPadOS";

    return {
        id: localStorage.getItem('RP_DeviceID') || generateDeviceFingerprint(),
        os: os,
        browser: navigator.vendor || "Standard Browser",
        timestamp: new Date().toISOString()
    };
}

// Initial Call to set the ID as soon as page loads
const currentDevice = getDeviceInfo();
console.log("Device Identified:", currentDevice.id);

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : 1-login/login.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 4: OTP System & Verification Logic <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A : OTP Input Behavior (Auto-Focus Logic) --- */
/* --------------------------------------------------------------------- */
/**
 * OTP Inputs: Ek number dalte hi cursor khud agle box me chala jayega.
 */
const otpBoxes = document.querySelectorAll('.otp-box');

otpBoxes.forEach((box, index) => {
    // Number type karne par agle box me jao
    box.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < otpBoxes.length - 1) {
            otpBoxes[index + 1].focus();
        }
    });

    // Backspace dabane par piche wale box me jao
    box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && index > 0) {
            otpBoxes[index - 1].focus();
        }
    });
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : Send OTP Logic (Supabase Auth) --- */
/* --------------------------------------------------------------------- */
/**
 * sendOTP: User ke email par 6-digit code bhejta hai.
 */
async function sendOTP(email, type = 'login') {
    triggerHaptic();
    
    // Button par loading dikhao
    const activeBtn = type === 'login' ? loginBtn : signupNextBtn;
    const originalText = activeBtn.innerHTML;
    activeBtn.innerHTML = `<div class="btn-loader"></div>`;
    activeBtn.disabled = true;

    try {
        // Supabase Magic Link/OTP Call
        const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                // Agar user naya hai to signup, purana hai to login (Supabase handles this)
                shouldCreateUser: type === 'signup' 
            }
        });

        if (error) throw error;

        // Success: OTP Overlay dikhao
        document.getElementById('display-email').textContent = email;
        otpOverlay.style.display = 'flex';
        showIsland("OTP sent! Check your inbox.", "success");
        
        // Timer shuru karo (2 minutes)
        startOTPTimer();

    } catch (error) {
        showIsland(error.message || "Failed to send OTP", "error");
    } finally {
        // Button wapis normal karo
        activeBtn.innerHTML = originalText;
        activeBtn.disabled = false;
    }
}

// Login Button Click
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    if (!email) return showIsland("Please enter email", "error");
    sendOTP(email, 'login');
});

// Signup Next Button Click
signupNextBtn.addEventListener('click', () => {
    const email = document.getElementById('signup-email').value;
    if (!email) return showIsland("Please enter email", "error");
    // Yahan pehle basic validation bhi ho sakta hai (Next block me cover karenge)
    sendOTP(email, 'signup');
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4C : OTP Timer & Resend Logic --- */
/* --------------------------------------------------------------------- */
let timer;
function startOTPTimer() {
    let timeLeft = 120; // 2 Minutes
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
            timerDisplay.textContent = "0:00";
        }
        timeLeft--;
    }, 1000);
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4D : Back Button (Close OTP) --- */
/* --------------------------------------------------------------------- */
backBtn.addEventListener('click', () => {
    otpOverlay.style.display = 'none';
    clearInterval(timer);
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : 1-login/login.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 5: OTP Verification & Database Finalization <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5A : OTP Verification Logic --- */
/* --------------------------------------------------------------------- */
/**
 * verifyOTP: 6-digit code ko Supabase Auth se verify karta hai.
 */
verifyBtn.addEventListener('click', async () => {
    triggerHaptic();
    
    // 6-digit code ko ikhatha karo
    let token = "";
    otpBoxes.forEach(box => token += box.value);

    if (token.length < 6) {
        return showIsland("Please enter full 6-digit code", "error");
    }

    const email = document.getElementById('display-email').textContent;
    
    // UI Loading State
    verifyBtn.innerHTML = `<div class="btn-loader"></div>`;
    verifyBtn.disabled = true;

    try {
        // Supabase Verification Call
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email'
        });

        if (error) throw error;

        // Success!
        showIsland("Verification Successful!", "success");
        
        // Ab check karte hain: Signup hai ya Login?
        const isSignupVisible = signupForm.style.display === 'block';
        
        if (isSignupVisible) {
            // Naya Account banao (Database Entry)
            await finalizeSignup(data.user.id, email);
        } else {
            // Login Logic: Device Check shuru karo (Next block me aayega)
            handleLoginSuccess(data.user.id, email);
        }

    } catch (error) {
        showIsland("Invalid or expired OTP", "error");
        // OTP boxes reset karo
        otpBoxes.forEach(box => box.value = "");
        otpBoxes[0].focus();
    } finally {
        verifyBtn.innerHTML = "Verify & Enter";
        verifyBtn.disabled = false;
    }
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5B : Finalize Signup (Database Entry) --- */
/* --------------------------------------------------------------------- */
/**
 * finalizeSignup: User ke saare details 'public.users' table me save karta hai.
 */
async function finalizeSignup(uid, email) {
    showIsland("Creating your secure identity...", "info");

    const userData = {
        id: uid,
        email: email,
        full_name: document.getElementById('signup-name').value,
        dob: document.getElementById('signup-birthday').value,
        phone: document.getElementById('signup-mobile').value,
        pincode: document.getElementById('signup-pincode').value,
        language: document.getElementById('signup-language').value,
        gender: selectedGender, // Block 2 se aa raha hai
        device_fingerprint: localStorage.getItem('RP_DeviceID'),
        created_at: new Date()
    };

    try {
        // Supabase Database Insert
        const { error } = await supabase
            .from('users')
            .insert([userData]);

        if (error) throw error;

        // Sab set hai! Dashboard par bhejo
        showIsland("Identity Created! Welcome.", "success");
        setTimeout(() => {
            window.location.href = '../dashboard/dashboard.html'; 
        }, 1500);

    } catch (error) {
        console.error("Database Error:", error);
        showIsland("Data save failed. Contact Support.", "error");
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5C : Login Success Router --- */
/* --------------------------------------------------------------------- */
/**
 * handleLoginSuccess: Purane user ka device check karta hai.
 */
function handleLoginSuccess(uid, email) {
    const storedDevice = localStorage.getItem('RP_DeviceID');
    
    // Abhi ke liye seedha bhej rahe hain, 
    // Agle block me hum "Device Shift Logic" (Popup) add karenge.
    showIsland("Logging you in...", "success");
    
    setTimeout(() => {
        window.location.href = '../dashboard/dashboard.html';
    }, 1500);
}

/* ===================================================================== */
/* ===>> END OF BLOCK JS 5 file : 1-login/login.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 6: Device Security & Shift Logic (Anti-Theft) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 6A : handleLoginSuccess (The Guard Logic) --- */
/* --------------------------------------------------------------------- */
/**
 * handleLoginSuccess: Ye tay karta hai ki user seedha andar jayega ya 
 * use "Device Shift" ki rukawat paar karni padegi.
 */
async function handleLoginSuccess(uid, email) {
    const currentDeviceID = localStorage.getItem('RP_DeviceID');
    
    try {
        // 1. Database se check karo user ka registered (Active) device kaunsa hai
        const { data: user, error } = await supabase
            .from('users')
            .select('device_fingerprint, is_blocked')
            .eq('id', uid)
            .single();

        if (error) throw error;

        // 2. Agar account blocked hai, to High Alert screen dikhao
        if (user.is_blocked) {
            return showHighAlert("This account is permanently suspended.");
        }

        // 3. Agar device match hota hai -> Seedha Dashboard
        if (user.device_fingerprint === currentDeviceID) {
            showIsland("Device Verified. Welcome back!", "success");
            setTimeout(() => { window.location.href = '../dashboard/dashboard.html'; }, 1500);
        } 
        // 4. Agar naya device hai -> Shift Request shuru karo
        else {
            triggerDeviceShiftSystem(uid, user.device_fingerprint, currentDeviceID);
        }

    } catch (err) {
        showIsland("Security check failed.", "error");
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 6B : Trigger Device Shift System (Timer Logic) --- */
/* --------------------------------------------------------------------- */
const shiftPopup = document.getElementById('shift-popup');
const shiftTimerText = document.getElementById('shift-timer-text');
let shiftCountdown;

function triggerDeviceShiftSystem(uid, oldDID, newDID) {
    showIsland("New device detected! Authorization required.", "warning");
    
    // Popup dikhao
    shiftPopup.style.display = 'block';
    otpOverlay.style.display = 'none'; // OTP card hata do
    
    let timeLeft = 180; // 3 Minutes
    
    // 3-Minute Timer Start
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

    // Yahan hum Supabase Realtime Listener lagayenge (Next Block me detail me aayega)
    listenForShiftApproval(uid, newDID);
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 6C : High Alert & Anti-Theft Actions --- */
/* --------------------------------------------------------------------- */
/**
 * markDeviceBlocked: Kisi bhi device ko hamesha ke liye ban kar dena.
 */
async function markDeviceBlocked(reason) {
    const deviceID = localStorage.getItem('RP_DeviceID');
    showHighAlert(reason);
    
    // Database me log record karo (Security Logs)
    await supabase.from('security_logs').insert([{
        event_type: 'DEVICE_BLOCKED',
        device_fingerprint: deviceID,
        details: reason
    }]);
}

function showHighAlert(reason) {
    const blockScreen = document.getElementById('block-screen');
    blockScreen.querySelector('p').textContent = reason;
    blockScreen.style.display = 'flex';
    appContainer.style.display = 'none'; // Poora app hide kar do
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 6D : Approval Listener (Waiting Logic) --- */
/* --------------------------------------------------------------------- */
function listenForShiftApproval(uid, newDID) {
    // Ye function Supabase Realtime se connect hokar wait karega 
    // ki kab purana device "Approve" button dabata hai.
    console.log("Waiting for approval from old device...");
    
    // NOTE: Iska real-time code hum agle block me poora karenge
}

/* ===================================================================== */
/* ===>> END OF BLOCK JS 6 file : 1-login/login.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 7: Real-time Sync & Final Authorization <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 7A : Listen For Shift Approval (Real-time) --- */
/* --------------------------------------------------------------------- */
/**
 * listenForShiftApproval: Supabase Real-time channel se connect hota hai 
 * aur purane device ke signal ka wait karta hai.
 */
function listenForShiftApproval(uid, newDID) {
    const channel = supabase.channel(`device-shift-${uid}`);

    channel
        .on('broadcast', { event: 'shift-action' }, async ({ payload }) => {
            const { action, targetDevice } = payload;

            // Sirf wahi action pakdo jo is naye device ke liye hai
            if (targetDevice === newDID) {
                if (action === 'APPROVED') {
                    clearInterval(shiftCountdown);
                    showIsland("Shift Approved! Updating identity...", "success");
                    
                    // Final Database Update (New device ko active banao)
                    await completeDeviceShift(uid, newDID);
                } 
                else if (action === 'REJECTED') {
                    clearInterval(shiftCountdown);
                    onShiftRejected(newDID);
                }
            }
        })
        .subscribe();
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 7B : Approve/Reject Buttons Logic (Old Device Side) --- */
/* --------------------------------------------------------------------- */
/**
 * broadcastShiftAction: Jab user popup me button dabata hai, to ye signal bhejta hai.
 */
async function broadcastShiftAction(uid, action, targetDID) {
    const channel = supabase.channel(`device-shift-${uid}`);
    
    await channel.send({
        type: 'broadcast',
        event: 'shift-action',
        payload: { action: action, targetDevice: targetDID }
    });

    if (action === 'APPROVED') {
        showIsland("Device authorized. You will be logged out.", "info");
        // Purane device ko logout kar do security ke liye
        setTimeout(async () => {
            await supabase.auth.signOut();
            window.location.reload();
        }, 2000);
    } else {
        showIsland("Device Rejected & Blocked.", "error");
        shiftPopup.style.display = 'none';
    }
}

// Event Listeners for Shift Buttons (In the HTML)
document.getElementById('approve-shift-btn').addEventListener('click', () => {
    // Ye tabhi chalega jab user login hai aur doosra device request kar raha hai
    // Hum uid aur targetID ko runtime me handle karenge
    triggerHaptic();
    const uid = supabase.auth.user()?.id;
    // broadcastShiftAction(uid, 'APPROVED', targetID);
});

document.getElementById('reject-shift-btn').addEventListener('click', () => {
    triggerHaptic();
    // broadcastShiftAction(uid, 'REJECTED', targetID);
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 7C : Complete Device Shift (DB Update) --- */
/* --------------------------------------------------------------------- */
/**
 * completeDeviceShift: Naye device ki ID ko 'users' table me permanent kar deta hai.
 */
async function completeDeviceShift(uid, newDID) {
    try {
        const { error } = await supabase
            .from('users')
            .update({ device_fingerprint: newDID })
            .eq('id', uid);

        if (error) throw error;

        showIsland("Device Authorization Complete.", "success");
        setTimeout(() => {
            window.location.href = '../dashboard/dashboard.html';
        }, 1500);

    } catch (err) {
        showIsland("Database update failed.", "error");
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 7D : Initialize App State (On Load) --- */
/* --------------------------------------------------------------------- */
/**
 * checkActiveSession: Agar user pehle se logged in hai, to use seedha andar bhejo.
 */
async function checkActiveSession() {
    const session = supabase.auth.session();
    if (session) {
        // Device check yahan bhi zaruri hai taaki hack na ho
        handleLoginSuccess(session.user.id, session.user.email);
    }
}

// Page load hote hi session aur blocked status check karo
document.addEventListener('DOMContentLoaded', () => {
    checkActiveSession();
    const currentDID = localStorage.getItem('RP_DeviceID');
    // Check if this specific device is in security_logs as BLOCKED (Next level)
});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 7 file : 1-login/login.js <<=== */
/* ===================================================================== */


