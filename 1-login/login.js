/* ===================================================================== */
/* ===>> BLOCK JS 1: System Initialization & Security Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1A : Supabase & Project Credentials --- */
/* --------------------------------------------------------------------- */
const SB_URL = "https://xtzdlepgpqvllwzjfrsh.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0emRsZXBncHF2bGx3empmcnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTI2MzcsImV4cCI6MjA4NzU2ODYzN30.NxX8BPCK_HNQYmn0-7YkdPv12gO8wKgOS5oP2R0OYZc";

// Initialize Supabase once for the Entry Module
const _sb = supabase.createClient(SB_URL, SB_KEY);
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1A file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1B : DOM Elements Selection (Entry Portal) --- */
/* --------------------------------------------------------------------- */
// Input Fields
const mobileInput = document.getElementById('user-mobile');
const emailInput  = document.getElementById('user-email');

// UI View Slots
const previewPortal = document.getElementById('identity-preview-portal');

// Action Buttons
const continueBtn = document.getElementById('entry-continue-btn');
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1B file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1C : Device Fingerprinting System (Security DNA) --- */
/* --------------------------------------------------------------------- */
/**
 * generateDeviceFingerprint: Device ki hardware aur software detail se 
 * ek unique ID (Digital DNA) banata hai.
 */
function generateDeviceFingerprint() {
    const nav = window.navigator;
    const screen = window.screen;

    const rawDNA = [
        nav.userAgent,
        nav.language,
        screen.width + "x" + screen.height,
        nav.platform
    ].join('###');

    const deviceHash = createSecureHash(rawDNA);
    const finalID = `DF-${deviceHash.toUpperCase()}`;
    
    localStorage.setItem('RP_DeviceID', finalID);
    return finalID;
}

function createSecureHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; 
    }
    return Math.abs(hash).toString(36).substring(0, 10);
}

// Global Device ID for this session
const currentDID = localStorage.getItem('RP_DeviceID') || generateDeviceFingerprint();
console.log("Modular Engine: Device ID Sync Complete ->", currentDID);
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1C file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 1-login/login.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 2: Global Identity & Formatting Logic <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2A : Smart Phone Formatting (888-888-8888) --- */
/* --------------------------------------------------------------------- */
/**
 * applyPhonePattern: Mobile field mein auto-dashes lagata hai.
 * Rule: Sirf digits allow karna aur 10 digit ka standard maintain karna.
 */
if (mobileInput) {
    mobileInput.addEventListener('input', (e) => {
        // Digits ke ilawa sab saaf karo
        let val = e.target.value.replace(/\D/g, '').substring(0, 10);
        
        let formatted = "";
        if (val.length > 0) {
            if (val.length <= 3) {
                formatted = val;
            } else if (val.length <= 6) {
                formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
            } else {
                formatted = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`;
            }
        }
        e.target.value = formatted;
    });

    // Keyboard Guard: Alphabets block karo
    mobileInput.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) e.preventDefault();
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2A file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2B : Identity Discovery Engine (Gmail Lookup) --- */
/* --------------------------------------------------------------------- */
/**
 * identityDiscovery: Real-time mein Gmail se naam ya badge nikalta hai.
 * Rule: Debounce (600ms) taaki search typing ke sath match kare.
 */
let discoveryTimer;

if (emailInput) {
    emailInput.addEventListener('input', (e) => {
        const email = e.target.value.trim().toLowerCase();
        
        // Slot saaf karo aur timer reset karo
        if (previewPortal) previewPortal.innerHTML = "";
        clearTimeout(discoveryTimer);

        if (email.includes('@') && email.length > 5) {
            discoveryTimer = setTimeout(() => {
                executeIdentityLookup(email);
            }, 600);
        }
    });
}

/**
 * executeIdentityLookup: Database aur Global status check karta hai.
 */
async function executeIdentityLookup(email) {
    if (!previewPortal) return;

    try {
        // 1. Supabase Check: Pehle apne database mein dhoondo
        const { data: user } = await _sb
            .from('users')
            .select('personal_email')
            .eq('personal_email', email)
            .maybeSingle();

        if (user) {
            // Case: Welcome Old User
            const name = user.personal_email.split('@')[0];
            previewPortal.innerHTML = `
                <div class="spatial-identity-chip">
                    <span class="chip-icon"><i class="fas fa-user-check"></i></span>
                    <span class="chip-text">Welcome back, ${name.charAt(0).toUpperCase() + name.slice(1)}</span>
                </div>
            `;
        } else {
            // Case: New User (High-Security Verified Badge)
            previewPortal.innerHTML = `
                <div class="spatial-identity-chip" style="background:rgba(52,199,89,0.1); border-color:rgba(52,199,89,0.2);">
                    <span class="chip-icon"><i class="fas fa-certificate" style="color:var(--success-green);"></i></span>
                    <span class="chip-text" style="color:var(--success-green);">✨ Verified Global Identity</span>
                </div>
            `;
        }
    } catch (err) {
        console.error("Discovery Engine Offline:", err);
    }
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2B file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 1-login/login.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 3: Main Entry Engine & Identity Routing <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3A : Strict Identity Validation Logic --- */
/* --------------------------------------------------------------------- */
/**
 * validateIdentityEntry: Check karta hai ki data system rules ke mutabiq hai ya nahi.
 * Rule: Phone must be 10 digits, Email must be a full valid signature.
 */
function validateIdentityEntry(email, phone) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanPhone = phone.replace(/-/g, ''); // Dashes hata kar check karo

    if (cleanPhone.length < 10) {
        window.showIsland("Enter full 10-digit mobile number", "error");
        return false;
    }

    // Strict Email check (im@gmail.com jaise fake formats ko rokne ke liye)
    const emailParts = email.split('@');
    if (!emailRegex.test(email) || emailParts[0].length < 3) {
        window.showIsland("Invalid Gmail Signature", "error");
        return false;
    }

    return true;
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 3A file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3B : Entry Execution & Routing Engine --- */
/* --------------------------------------------------------------------- */
/**
 * handleContinueAction: Continue button dabane par data process karta hai.
 */
if (continueBtn) {
    continueBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim().toLowerCase();
        const phone = mobileInput.value.trim();

        // 1. Validation Check
        if (!validateIdentityEntry(email, phone)) return;

        // 2. UI State: Haptic + Loading
        if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();
        
        continueBtn.disabled = true;
        const btnText = continueBtn.querySelector('.btn-text');
        const btnLoader = continueBtn.querySelector('.btn-loader');
        
        if (btnText) btnText.style.opacity = '0';
        if (btnLoader) btnLoader.style.display = 'block';

        try {
            // 3. Database Check: Search for Existing Identity
            const { data: user, error } = await _sb
                .from('users')
                .select('id, personal_email, device_fingerprint, is_blocked')
                .eq('personal_email', email)
                .maybeSingle();

            if (error) throw error;

            // 4. Identity Memory: Session storage mein data save karo
            sessionStorage.setItem('RP_Temp_Email', email);
            sessionStorage.setItem('RP_Temp_Phone', phone.replace(/-/g, ''));
            
            const countryCode = document.getElementById('selected-code')?.textContent || '+91';
            sessionStorage.setItem('RP_Country_Code', countryCode);

            // 5. User Type Logic
            if (user) {
                if (user.is_blocked) {
                    window.showIsland("This Identity is suspended", "error");
                    resetEntryUI();
                    return;
                }
                sessionStorage.setItem('RP_User_Type', 'OLD');
                window.showIsland("Identity Identified. Redirecting...", "success");
            } else {
                sessionStorage.setItem('RP_User_Type', 'NEW');
                window.showIsland("New Identity detected. Welcome!", "success");
            }

            // 6. Smooth Redirect (3-Page Flow)
            setTimeout(() => {
                window.location.href = '../2-Verification/Verification.html';
            }, 1200);

        } catch (err) {
            console.error("Entry Engine Error:", err);
            window.showIsland("Network connection interrupted", "error");
            resetEntryUI();
        }
    });
}

/**
 * resetEntryUI: Error aane par button ko normal karta hai.
 */
function resetEntryUI() {
    continueBtn.disabled = false;
    const btnText = continueBtn.querySelector('.btn-text');
    const btnLoader = continueBtn.querySelector('.btn-loader');
    if (btnText) btnText.style.opacity = '1';
    if (btnLoader) btnLoader.style.display = 'none';
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 3B file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : 1-login/login.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 4: Global Country Picker Logic Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A : Country Dataset & Selector Elements --- */
/* --------------------------------------------------------------------- */
// 1. Global Identity Regions (Duniya ki list)
const regions = [
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
];

// 2. DOM Selection for Picker
const pickerTrigger  = document.getElementById('country-dropdown-trigger');
const pickerOverlay  = document.getElementById('country-picker-overlay');
const closePickerBtn = document.getElementById('close-picker-btn');
const searchBox      = document.getElementById('country-search-input');
const listContainer  = document.getElementById('country-list-scroll');

const displayFlag    = document.getElementById('selected-flag');
const displayCode    = document.getElementById('selected-code');
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4A file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : Picker Render & Search Engine --- */
/* --------------------------------------------------------------------- */
/**
 * renderPickerList: List ko screen par filter karke dikhata hai.
 */
function renderPickerList(filterText = "") {
    if (!listContainer) return;
    listContainer.innerHTML = "";

    const filtered = regions.filter(r => 
        r.name.toLowerCase().includes(filterText.toLowerCase()) || 
        r.code.includes(filterText)
    );

    filtered.forEach(region => {
        const item = document.createElement('div');
        item.className = "country-item haptic-touch";
        item.innerHTML = `
            <span class="flag">${region.flag}</span>
            <span class="name">${region.name}</span>
            <span class="code">${region.code}</span>
        `;
        
        item.onclick = () => finalizeRegionSelection(region);
        listContainer.appendChild(item);
    });
}

/**
 * finalizeRegionSelection: Country chunne par UI aur memory update karta hai.
 */
function finalizeRegionSelection(region) {
    if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();
    
    // UI Update
    displayFlag.textContent = region.flag;
    displayCode.textContent = region.code;
    
    // Memory Update (For next pages)
    sessionStorage.setItem('RP_Country_Code', region.code);
    
    closeRegionPicker();
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4B file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4C : Modal Controls & Initialization --- */
/* --------------------------------------------------------------------- */
/**
 * openRegionPicker: Modal ko reveal karta hai.
 */
if (pickerTrigger) {
    pickerTrigger.onclick = () => {
        if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();
        pickerOverlay.classList.add('active');
        renderPickerList(); // Refresh list
        setTimeout(() => searchBox.focus(), 150);
    };
}

function closeRegionPicker() {
    pickerOverlay.classList.remove('active');
    searchBox.value = "";
}

if (closePickerBtn) closePickerBtn.onclick = closeRegionPicker;

// Real-time Search Listener
if (searchBox) {
    searchBox.oninput = (e) => renderPickerList(e.target.value);
}

// Initial Run
renderPickerList();
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4C file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : 1-login/login.js <<=== */
/* ===================================================================== */