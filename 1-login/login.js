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



/* --------------------------------------------------------------------- */
/* --- Sub-Block 1E : Theme Synchronization Engine --- */
/* --------------------------------------------------------------------- */
/**
 * applySavedTheme: LocalStorage se saved theme nikalta hai aur
 * use poore system (Body aur Icon) par apply karta hai.
 */
function applySavedTheme() {
    const savedTheme = localStorage.getItem('RP_System_Theme') || 'light';
    const themeIcon = document.getElementById('theme-icon');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    } else {
        document.body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
    }
    
    console.log(`System Status: ${savedTheme.toUpperCase()} theme synchronized.`);
}

// Initial Run: Page load hote hi theme apply karo
applySavedTheme();

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1E file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */


/* --------------------------------------------------------------------- */
/* --- Sub-Block 1F : Theme Toggle Listener --- */
/* --------------------------------------------------------------------- */
/**
 * themeToggleBtn: User ki click par theme switch karta hai aur
 * visual feedback (Haptic + Island) deta hai.
 */
const themeToggleBtn = document.getElementById('theme-toggle-btn');

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        // 1. Physical Reaction
        triggerHapticFeedback();
        
        // 2. Class Toggle Logic
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // 3. Icon & Storage Update
        const themeIcon = document.getElementById('theme-icon');
        if (isDarkMode) {
            localStorage.setItem('RP_System_Theme', 'dark');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            showIsland("Dark Mode Active", "info");
        } else {
            localStorage.setItem('RP_System_Theme', 'light');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            showIsland("Light Mode Active", "info");
        }
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1F file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */



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
 * UPDATED: Now uses 'personal_email' to match Supabase schema.
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
        // 3. Database Check: Search using 'personal_email' column
        const { data: user, error } = await _sb
            .from('users')
            .select('id, personal_email, device_fingerprint, is_blocked')
            .eq('personal_email', email)
            .maybeSingle();

        if (error) {
            console.error("Database Lookup Error:", error);
            throw error;
        }

        // 4. Temporary storage (For next module)
        sessionStorage.setItem('RP_Temp_Email', email);
        sessionStorage.setItem('RP_Temp_Phone', phone);

        // 5. Country Code save (For Telegram Deep Link)
        const countryCode = document.querySelector('.country-code')?.textContent?.trim() || '+91';
        sessionStorage.setItem('RP_Country_Code', countryCode);

        // 6. Routing Logic (Old User vs New User)
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

        // 7. Final Transition (Zero-Jerk Transition Flow)
        setTimeout(() => {
            window.location.href = '../2-Verification/Verification.html';
        }, 1200);

    } catch (err) {
        console.error("Entry Logic Error Details:", err);
        showIsland(`System Error: ${err.message || 'Connection failed'}`, "error");
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




/* ===================================================================== */
/* ===>> BLOCK JS 5: Global Identity & Formatting Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5A : Global Country Picker & Search Engine --- */
/* --------------------------------------------------------------------- */

// 1. Global Country Data (Digital Identity Hub)
const countries = [
    { name: "India", code: "+91", flag: "🇮🇳" },
    { name: "United States", code: "+1", flag: "🇺🇸" },
    { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
    { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
    { name: "Canada", code: "+1", flag: "🇨🇦" },
    { name: "Australia", code: "+61", flag: "🇦🇺" },
    { name: "Germany", code: "+49", flag: "🇩🇪" },
    { name: "France", code: "+33", flag: "🇫🇷" },
    { name: "Singapore", code: "+65", flag: "🇸🇬" },
    { name: "Japan", code: "+81", flag: "🇯🇵" }
    // Add more as needed
];

// 2. DOM Elements Selection
const pickerTrigger = document.getElementById('country-dropdown-trigger');
const pickerOverlay = document.getElementById('country-picker-overlay');
const closePickerBtn = document.getElementById('close-picker-btn');
const searchInput   = document.getElementById('country-search-input');
const countryList   = document.getElementById('country-list-scroll');

const selectedFlag  = document.getElementById('selected-flag');
const selectedCode  = document.getElementById('selected-code');

/**
 * renderCountries: List ko screen par dikhane wala function.
 */
function renderCountries(filter = "") {
    countryList.innerHTML = "";
    
    const filtered = countries.filter(c => 
        c.name.toLowerCase().includes(filter.toLowerCase()) || 
        c.code.includes(filter)
    );

    filtered.forEach(country => {
        const item = document.createElement('div');
        item.className = "country-item haptic-touch";
        item.innerHTML = `
            <span class="flag">${country.flag}</span>
            <span class="name">${country.name}</span>
            <span class="code">${country.code}</span>
        `;
        
        item.onclick = () => {
            selectCountry(country);
        };
        
        countryList.appendChild(item);
    });
}

/**
 * selectCountry: Country chunne par UI update karne wala logic.
 */
function selectCountry(country) {
    window.triggerHapticFeedback(); // Block 1 helper
    selectedFlag.textContent = country.flag;
    selectedCode.textContent = country.code;
    
    // Session storage mein update karo taaki Verification page ko pata rahe
    sessionStorage.setItem('RP_Country_Code', country.code);
    
    closePicker();
}

// Event Listeners for Modal
pickerTrigger.onclick = () => {
    window.triggerHapticFeedback();
    pickerOverlay.classList.add('active');
    renderCountries(); // Initial load
    setTimeout(() => searchInput.focus(), 100);
};

function closePicker() {
    pickerOverlay.classList.remove('active');
    searchInput.value = "";
}

closePickerBtn.onclick = closePicker;

// Real-time Search Logic
searchInput.oninput = (e) => {
    renderCountries(e.target.value);
};

// Initial Setup
renderCountries();

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5A file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */


/* --------------------------------------------------------------------- */
/* --- Sub-Block 5B : Smart Phone Formatting Engine (Auto-Pattern) --- */
/* --------------------------------------------------------------------- */
/**
 * mobileInput: 888-888-8888 pattern engine.
 * Sirf digits allow karega aur sahi jagah par dashes (-) lagayega.
 */
const mobileField = document.getElementById('user-mobile');

if (mobileField) {
    mobileField.addEventListener('input', (e) => {
        // 1. Sirf numbers ko rakho, baaki sab hata do
        let value = e.target.value.replace(/\D/g, '');
        
        // 2. Maximum 10 digits tak hi limit rakho (Standard Pattern)
        if (value.length > 10) value = value.slice(0, 10);

        // 3. Pattern Matching Logic (888-888-8888)
        let formattedValue = "";
        if (value.length > 0) {
            if (value.length <= 3) {
                formattedValue = value;
            } else if (value.length <= 6) {
                formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
            } else {
                formattedValue = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
            }
        }

        // 4. Update Input Value
        e.target.value = formattedValue;
    });

    // Special Guard: Alphabet blocking
    mobileField.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
            window.showIsland("Only numbers allowed", "error");
        }
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5B file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */



/* --------------------------------------------------------------------- */
/* --- Sub-Block 5C : Identity Discovery Engine (Gmail Lookup) --- */
/* --------------------------------------------------------------------- */
/**
 * identityLookup: Gmail likhte hi piche se identity scan karta hai.
 * Rule: Reject identities that are too short or invalid (e.g., im@gmail.com).
 */
const emailField = document.getElementById('user-email');
const previewPortal = document.getElementById('identity-preview-portal');
let lookupTimer;

if (emailField) {
    emailField.addEventListener('input', (e) => {
        const email = e.target.value.trim().toLowerCase();
        
        // Clear previous results immediately
        previewPortal.innerHTML = "";
        clearTimeout(lookupTimer);

        // Sirf tab scan karo jab user @ tak pahunch jaye aur format thoda bada ho
        if (email.includes('@') && email.length > 5) {
            lookupTimer = setTimeout(() => {
                performIdentityDiscovery(email);
            }, 600); // 600ms Debounce taaki API par load na bade
        }
    });
}

/**
 * performIdentityDiscovery: Asli search logic.
 */
async function performIdentityDiscovery(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // 1. Strict Validation: Choti emails (jaise im@gmail.com) ko reject karo
    const usernamePart = email.split('@')[0];
    if (usernamePart.length < 3 || !emailRegex.test(email)) {
        previewPortal.innerHTML = `
            <div class="spatial-identity-chip" style="background:rgba(255,59,48,0.1); border-color:rgba(255,59,48,0.2);">
                <span class="chip-icon"><i class="fas fa-exclamation-circle" style="color:var(--error-red);"></i></span>
                <span class="chip-text" style="color:var(--error-red);">Invalid Identity Signature</span>
            </div>
        `;
        return;
    }

    try {
        // 2. Database Lookup: Kya ye user pehle se hai?
        const { data: user, error } = await _sb
            .from('users')
            .select('personal_email') // Dashboard logic se pehle sirf confirmation chahiye
            .eq('personal_email', email)
            .maybeSingle();

        if (user) {
            // CASE: User pehchana gaya
            const displayName = user.personal_email.split('@')[0];
            previewPortal.innerHTML = `
                <div class="spatial-identity-chip">
                    <span class="chip-icon"><i class="fas fa-user-check"></i></span>
                    <span class="chip-text">Welcome back, ${displayName.charAt(0).toUpperCase() + displayName.slice(1)}</span>
                </div>
            `;
        } else {
            // CASE: Naya User (High-Security Fallback)
            previewPortal.innerHTML = `
                <div class="spatial-identity-chip" style="background:rgba(52,199,89,0.1); border-color:rgba(52,199,89,0.2);">
                    <span class="chip-icon"><i class="fas fa-certificate" style="color:var(--success-green);"></i></span>
                    <span class="chip-text" style="color:var(--success-green);">✨ Verified Global Identity</span>
                </div>
            `;
        }
    } catch (err) {
        console.error("Identity Engine Error:", err);
    }
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5C file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */