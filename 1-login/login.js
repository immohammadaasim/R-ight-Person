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

/**
 * triggerHapticFeedback: Local helper for physical touch visual.
 */
function triggerHapticFeedback() {
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(10);
    console.log("System: Haptic visual simulated.");
}
// Export helper globally for Theme.js or others
window.triggerHapticFeedback = triggerHapticFeedback;

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
/* --- Sub-Block 2A : Smart Phone Formatting Engine (Auto-Pattern) --- */
/* --------------------------------------------------------------------- */
/**
 * applyPhoneFormatting: Mobile field mein dashes (-) lagata hai.
 * Rule: Sirf digits allow karna aur 10 digit ka standard maintain karna.
 */
if (mobileInput) {
    mobileInput.addEventListener('input', (e) => {
        // Numbers ke ilawa sab saaf karo
        let val = e.target.value.replace(/\D/g, '').substring(0, 10);
        
        let formattedValue = "";
        if (val.length > 0) {
            if (val.length <= 3) {
                formattedValue = val;
            } else if (val.length <= 6) {
                formattedValue = `${val.slice(0, 3)}-${val.slice(3)}`;
            } else {
                formattedValue = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`;
            }
        }
        
        // Update the visible value
        e.target.value = formattedValue;
    });

    // Keyboard Guard: Alphabets block karo aur notification do
    mobileInput.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
            if (typeof showIsland === 'function') {
                showIsland("Only numbers allowed", "error");
            }
        }
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
 * Rule: Debounce (600ms) taaki typing ke sath search smooth chale.
 */
let lookupTimer;

if (emailInput) {
    emailInput.addEventListener('input', (e) => {
        const email = e.target.value.trim().toLowerCase();
        
        // Slot saaf karo aur timer reset karo
        if (previewPortal) previewPortal.innerHTML = "";
        clearTimeout(lookupTimer);

        // Sirf tab scan karo jab user @ tak pahunch jaye aur format valid lage
        if (email.includes('@') && email.length > 5) {
            lookupTimer = setTimeout(() => {
                performIdentityLookup(email);
            }, 600);
        }
    });
}

/**
 * performIdentityLookup: Supabase database aur Global status check karta hai.
 */
async function performIdentityLookup(email) {
    if (!previewPortal) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Strict Validation: Choti ya ghalat emails ko reject karo
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
        // 2. Database Lookup: Kya ye user hamare system mein hai?
        const { data: user } = await _sb
            .from('users')
            .select('personal_email')
            .eq('personal_email', email)
            .maybeSingle();

        if (user) {
            // CASE: Purana User (Asli Naam dikhao)
            const name = user.personal_email.split('@')[0];
            previewPortal.innerHTML = `
                <div class="spatial-identity-chip">
                    <span class="chip-icon"><i class="fas fa-user-check"></i></span>
                    <span class="chip-text">Welcome back, ${name.charAt(0).toUpperCase() + name.slice(1)}</span>
                </div>
            `;
        } else {
            // CASE: Naya User (Security Badge dikhao)
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
/* --- End Sub-Block 2B file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 1-login/login.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 3: Main Entry Engine & Identity Routing <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* —-- Function#1 BLOCK JS 3A: Identity Validation & iOS Tick —-- */
/* --------------------------------------------------------------------- */
/**
 * validateIdentityGate: Rasta kholne se pehle data ki sakht janch.
 * Isme Tick Mark ka logic bhi shamil hai.
 */
function updateIdentityStatus() {
    const phone = mobileInput.value.replace(/-/g, '');
    const tickSlot = document.getElementById('phone-tick-icon');
    
    // Rule: Agar 10 digits poore hain toh iOS Tick dikhao
    if (phone.length === 10) {
        if (tickSlot) {
            tickSlot.innerHTML = '<i class="fas fa-check-circle"></i>';
            tickSlot.style.opacity = '1';
            tickSlot.style.transform = 'scale(1)';
            tickSlot.style.color = 'var(--success-green, #34C759)'; // Apple Success Green
        }
    } else {
        if (tickSlot) {
            tickSlot.style.opacity = '0';
            tickSlot.style.transform = 'scale(0.5)';
        }
    }
}

// Phone input par event listener lagao taaki real-time tick dikhe
if (mobileInput) {
    mobileInput.addEventListener('input', updateIdentityStatus);
}

function validateIdentityGate(email, phone) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanPhone = phone.replace(/-/g, '');

    if (cleanPhone.length < 10) {
        if (typeof showIsland === 'function') showIsland("Enter full 10-digit number", "error");
        return false;
    }

    if (!emailRegex.test(email) || email.split('@')[0].length < 3) {
        if (typeof showIsland === 'function') showIsland("Invalid Gmail Signature", "error");
        return false;
    }

    return true;
}
/* --------------------------------------------------------------------- */
/* —-- Function#1 END OF BLOCK JS 3A: file : 1-login/login.js —-- */
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* —-- Function#2 BLOCK JS 3B: Entry Execution & Spinner Logic —-- */
/* --------------------------------------------------------------------- */
/**
 * executeContinueAction: Button click par Spinner trigger aur Database sync.
 */
if (continueBtn) {
    continueBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim().toLowerCase();
        const phone = mobileInput.value.trim();

        // 1. Final Gate Check
        if (!validateIdentityGate(email, phone)) return;

        // 2. UI REACTION: Haptic + Loader (THE FIX)
        if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();
        
        // Button State Change
        continueBtn.disabled = true;
        const btnText = continueBtn.querySelector('.btn-text');
        const btnLoader = continueBtn.querySelector('.btn-loader');
        
        // Text ko gayab karo aur Loader ko dikhao
        if (btnText) btnText.style.opacity = '0';
        if (btnLoader) {
            btnLoader.style.display = 'block';
            btnLoader.style.opacity = '1';
        }

        try {
            // 3. Database Sync: Identitfying User Status
            const { data: user, error } = await _sb
                .from('users')
                .select('id, is_blocked')
                .eq('personal_email', email)
                .maybeSingle();

            if (error) throw error;

            // 4. Memory Bridge: Session Data Save
            sessionStorage.setItem('RP_Temp_Email', email);
            sessionStorage.setItem('RP_Temp_Phone', phone.replace(/-/g, ''));
            sessionStorage.setItem('RP_User_Type', user ? 'OLD' : 'NEW');

            if (user && user.is_blocked) {
                if (typeof showIsland === 'function') showIsland("Identity Suspended", "error");
                resetEntryState();
                return;
            }

            // 5. Elite Transition: 1.2s ka delay taaki Spinner feel ho
            if (typeof showIsland === 'function') {
                showIsland(user ? "Syncing Identity..." : "Identity Creating...", "success");
            }

            setTimeout(() => {
                window.location.href = '../2-Verification/Verification.html';
            }, 1200);

        } catch (err) {
            console.error("Entry Engine Interrupted:", err);
            if (typeof showIsland === 'function') showIsland("Network Link Failed", "error");
            resetEntryState();
        }
    });
}

function resetEntryState() {
    continueBtn.disabled = false;
    const btnText = continueBtn.querySelector('.btn-text');
    const btnLoader = continueBtn.querySelector('.btn-loader');
    if (btnText) btnText.style.opacity = '1';
    if (btnLoader) btnLoader.style.display = 'none';
}
/* --------------------------------------------------------------------- */
/* —-- Function#2 END OF BLOCK JS 3B: file : 1-login/login.js —-- */
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : 1-login/login.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 4: Global Country Picker Logic Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A : Region Dataset & DOM Linkage --- */
/* --------------------------------------------------------------------- */
/**
 * Global Region Registry: 
 * Duniya ki main countries ki list identity engine ke liye.
 */
const regionRegistry = [
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

// Modal & Trigger Elements
const pickerTrigger  = document.getElementById('country-dropdown-trigger');
const pickerOverlay  = document.getElementById('country-picker-overlay');
const closePickerBtn = document.getElementById('close-picker-btn');
const searchBox      = document.getElementById('country-search-input');
const listContainer  = document.getElementById('country-list-scroll');

// Display Elements
const currentFlag    = document.getElementById('selected-flag');
const currentCode    = document.getElementById('selected-code');
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4A file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : Rendering & Search Filter Logic --- */
/* --------------------------------------------------------------------- */
/**
 * renderPickerContent: List ko filter karke screen par dikhata hai.
 */
function renderPickerContent(filterText = "") {
    if (!listContainer) return;
    listContainer.innerHTML = "";

    const filteredRegions = regionRegistry.filter(r => 
        r.name.toLowerCase().includes(filterText.toLowerCase()) || 
        r.code.includes(filterText)
    );

    filteredRegions.forEach(region => {
        const item = document.createElement('div');
        item.className = "country-item haptic-touch";
        item.innerHTML = `
            <span class="flag">${region.flag}</span>
            <span class="name">${region.name}</span>
            <span class="code">${region.code}</span>
        `;
        
        item.onclick = () => finalizeSelection(region);
        listContainer.appendChild(item);
    });
}

/**
 * finalizeSelection: Region chunne par UI aur memory update karta hai.
 */
function finalizeSelection(region) {
    if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();
    
    // Update Display
    if (currentFlag) currentFlag.textContent = region.flag;
    if (currentCode) currentCode.textContent = region.code;
    
    // Save to session for cross-page sync
    sessionStorage.setItem('RP_Country_Code', region.code);
    
    closePickerModal();
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4B file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4C : Modal Controls & Initialization --- */
/* --------------------------------------------------------------------- */
/**
 * Modal Event Listeners:
 * Open, Close aur Real-time search handling.
 */
if (pickerTrigger) {
    pickerTrigger.onclick = () => {
        if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();
        pickerOverlay.classList.add('active');
        renderPickerContent(); // Load fresh list
        if (searchBox) setTimeout(() => searchBox.focus(), 200);
    };
}

function closePickerModal() {
    if (pickerOverlay) pickerOverlay.classList.remove('active');
    if (searchBox) searchBox.value = "";
}

if (closePickerBtn) closePickerBtn.onclick = closePickerModal;

// Search Input Listener
if (searchBox) {
    searchBox.oninput = (e) => renderPickerContent(e.target.value);
}

// Initial Data Load
renderPickerContent();

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4C file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : 1-login/login.js <<=== */
/* ===================================================================== */