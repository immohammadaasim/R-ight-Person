/* ===================================================================== */
/* ===>> BLOCK JS 1: System Initialization & Security Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1A : Supabase & Project Credentials --- */
/* --------------------------------------------------------------------- */
/**
 * Supabase Engine Initialization:
 * Google, Apple, Microsoft aur Yahoo Auth ko handle karne ke liye.
 */
const SB_URL = "https://xtzdlepgpqvllwzjfrsh.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0emRsZXBncHF2bGx3empmcnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTI2MzcsImV4cCI6MjA4NzU2ODYzN30.NxX8BPCK_HNQYmn0-7YkdPv12gO8wKgOS5oP2R0OYZc";

// Initialize Global Supabase Client
const _sb = supabase.createClient(SB_URL, SB_KEY);
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1A file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1B : DOM Elements Selection (Smart Entry) --- */
/* --------------------------------------------------------------------- */
// Input Fields & Wrappers
const mobileInput = document.getElementById('user-mobile');
const emailInput  = document.getElementById('user-email');
const emailWrapper = document.getElementById('email-wrapper');
const emailLockIcon = document.getElementById('email-lock-icon');

// UI Portals & Buttons
const previewPortal = document.getElementById('identity-preview-portal');
const continueBtn = document.getElementById('entry-continue-btn');

// Smart Mail Providers Buttons
const providerBtns = document.querySelectorAll('.provider-btn');

// Initial Registry Length (Default India)
let currentSelectedLength = 10; 
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1B file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1C : Device Fingerprinting & Haptic Logic --- */
/* --------------------------------------------------------------------- */
/**
 * generateDeviceFingerprint: 
 * User ke hardware se unique security DNA banata hai.
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

// Global Device ID Sync
const currentDID = localStorage.getItem('RP_DeviceID') || generateDeviceFingerprint();

/**
 * triggerHapticFeedback: iPadOS style visual touch sensation.
 */
function triggerHapticFeedback() {
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(10);
}
window.triggerHapticFeedback = triggerHapticFeedback;

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1C file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 1-login/login.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 2: Global Identity & Smart Auth Logic <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2A : Smart Phone Formatting Engine (Dynamic) --- */
/* --------------------------------------------------------------------- */
if (mobileInput) {
    mobileInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, currentSelectedLength);
        let formattedValue = "";
        if (val.length > 0) {
            if (val.length <= 3) formattedValue = val;
            else if (val.length <= 6) formattedValue = `${val.slice(0, 3)}-${val.slice(3)}`;
            else formattedValue = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`;
        }
        e.target.value = formattedValue;
    });

    mobileInput.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
            if (typeof showIsland === 'function') showIsland("Only numbers allowed", "error");
        }
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2A file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* —-- Sub-Block 2B : Mail Provider Auth Engine (One-Tap Sync) —-- */
/* --------------------------------------------------------------------- */
/**
 * triggerProviderAuth: 
 * Google, Apple, Yahoo ya Microsoft ka login popup kholta hai.
 * 
 * NOTE: Filhal sirf 'Google' active hai. 
 * Apple, Microsoft aur Yahoo providers "Coming Soon" status par hain.
 */
async function triggerProviderAuth(provider) {
    if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();
    
    // Check if provider is ready or coming soon
    if (provider !== 'google') {
        if (typeof showIsland === 'function') {
            showIsland(`${provider.charAt(0).toUpperCase() + provider.slice(1)} Sync coming soon`, "info");
        }
        return; // Aage ka process rok do
    }

    if (typeof showIsland === 'function') {
        showIsland(`Connecting to Google...`, "info");
    }

    const { data, error } = await _sb.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.href 
        }
    });

    if (error) {
        if (typeof showIsland === 'function') showIsland(`Google link failed`, "error");
        console.error("Auth Error:", error.message);
    }
}

// Provider buttons par click listener lagao
if (providerBtns) {
    providerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.getAttribute('data-provider');
            triggerProviderAuth(provider);
        });
    });
}
/* --------------------------------------------------------------------- */
/* —-- Function#1 END OF BLOCK JS 2B: file : 1-login/login.js —-- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2C : OAuth Session Recovery & UI Fill --- */
/* --------------------------------------------------------------------- */
/**
 * handleAuthCallback: 
 * Login ke baad wapas aane par Verified Data nikalta hai aur UI lock karta hai.
 */
async function handleAuthCallback() {
    const { data: { session }, error } = await _sb.auth.getSession();

    if (session && session.user) {
        const user = session.user;
        const verifiedEmail = user.email;
        const verifiedName = user.user_metadata.full_name || user.email.split('@')[0];
        const providerUID = user.id;

        // 1. UI Sync: Email bharo aur Lock kar do
        if (emailInput) {
            emailInput.value = verifiedEmail;
            emailInput.readOnly = true; // Manual typing band
            if (emailWrapper) emailWrapper.classList.add('verified');
            if (emailLockIcon) emailLockIcon.classList.add('active');
        }

        // 2. Identity Chip update (Asli Naam dikhao)
        if (previewPortal) {
            previewPortal.innerHTML = `
                <div class="spatial-identity-chip">
                    <span class="chip-icon"><i class="fas fa-user-check"></i></span>
                    <span class="chip-text">Identity Verified: ${verifiedName}</span>
                </div>
            `;
        }

        // 3. Hidden Data Save (Session memory for JS 3B)
        sessionStorage.setItem('RP_Verified_Name', verifiedName);
        sessionStorage.setItem('RP_Provider_UID', providerUID);
        sessionStorage.setItem('RP_Auth_Provider', user.app_metadata.provider);

        if (typeof showIsland === 'function') {
            showIsland(`Verified as ${verifiedName}`, "success");
        }
    }
}

// Page load hote hi check karo ki kya user login karke wapas aaya hai
document.addEventListener('DOMContentLoaded', handleAuthCallback);
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2C file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 1-login/login.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 3: Main Entry Engine & Identity Routing <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* —-- Function#1 BLOCK JS 3A: Identity Validation & iOS Slide-Tick —-- */
/* --------------------------------------------------------------------- */
/**
 * updateIdentityStatus: 
 * Selected country ki 'length' property ke hisab se Tick ko active karta hai.
 */
function updateIdentityStatus() {
    const phone = mobileInput.value.replace(/-/g, '');
    const tickSlot = document.getElementById('phone-tick-icon');
    
    if (!tickSlot) return;

    if (phone.length === currentSelectedLength) {
        tickSlot.innerHTML = '<i class="fas fa-check-circle"></i>';
        setTimeout(() => {
            tickSlot.classList.add('active');
        }, 10);
    } else {
        tickSlot.classList.remove('active');
        setTimeout(() => {
            if (!tickSlot.classList.contains('active')) {
                tickSlot.innerHTML = '';
            }
        }, 400); 
    }
}

if (mobileInput) {
    mobileInput.addEventListener('input', updateIdentityStatus);
}

function validateIdentityGate(email, phone) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanPhone = phone.replace(/-/g, '');

    if (cleanPhone.length !== currentSelectedLength) {
        if (typeof showIsland === 'function') {
            showIsland(`Enter full ${currentSelectedLength}-digit number`, "error");
        }
        return false;
    }

    if (!emailRegex.test(email) || email.split('@')[0].length < 3) {
        if (typeof showIsland === 'function') {
            showIsland("Invalid Gmail Signature", "error");
        }
        return false;
    }

    return true;
}
/* --------------------------------------------------------------------- */
/* —-- Function#1 END OF BLOCK JS 3A: file : 1-login/login.js —-- */
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* —-- Function#2 BLOCK JS 3B: Entry Execution & Hidden Data Sync —-- */
/* --------------------------------------------------------------------- */
/**
 * executeContinueAction: 
 * Database check ke liye ab 'login_email' ka use hoga (Old: personal_email).
 */
if (continueBtn) {
    continueBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim().toLowerCase();
        const phone = mobileInput.value.trim();

        if (!validateIdentityGate(email, phone)) return;

        if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();
        
        continueBtn.disabled = true;
        const btnText = continueBtn.querySelector('.btn-text');
        const btnLoader = continueBtn.querySelector('.btn-loader');
        
        if (btnText) btnText.style.opacity = '0';
        if (btnLoader) {
            btnLoader.style.display = 'block';
            btnLoader.style.opacity = '1';
        }

        try {
            const verifiedName = sessionStorage.getItem('RP_Verified_Name') || "";
            const providerUID  = sessionStorage.getItem('RP_Provider_UID') || "";
            const authProvider = sessionStorage.getItem('RP_Auth_Provider') || "manual";
            const deviceID     = localStorage.getItem('RP_DeviceID');

            /**
             * UPDATE: 'login_email' column ka use (New Naming Convention)
             */
            const { data: user, error } = await _sb
                .from('users')
                .select('id, is_blocked')
                .eq('login_email', email) 
                .maybeSingle();

            if (error) throw error;

            if (user && user.is_blocked) {
                if (typeof showIsland === 'function') showIsland("Identity Suspended", "error");
                resetEntryState();
                return;
            }

            sessionStorage.setItem('RP_Temp_Email', email);
            sessionStorage.setItem('RP_Temp_Phone', phone.replace(/-/g, ''));
            sessionStorage.setItem('RP_User_Type', user ? 'OLD' : 'NEW');
            
            const countryCode = document.getElementById('selected-code')?.textContent || '+91';
            sessionStorage.setItem('RP_Country_Code', countryCode);

            if (typeof showIsland === 'function') {
                showIsland(user ? "Identity Identified. Syncing..." : "Securing New Identity...", "success");
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
    if (continueBtn) {
        continueBtn.disabled = false;
        const btnText = continueBtn.querySelector('.btn-text');
        const btnLoader = continueBtn.querySelector('.btn-loader');
        if (btnText) btnText.style.opacity = '1';
        if (btnLoader) btnLoader.style.display = 'none';
    }
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

/* ===================================================================== */
/* ===>> BLOCK JS 4: Global Country Picker Logic Engine <<=== */
/* ===================================================================== */

/* ===================================================================== */
/* ===>> BLOCK JS 4: Global Country Picker Logic Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A-1 : Global Region Registry (A to I) --- */
/* --------------------------------------------------------------------- */
/**
 * regionRegistry: 
 * Duniya bhar ki countries ka database.
 * 'length' property validation engine ke liye use hogi.
 */
const regionRegistry = [
    { name: "Afghanistan", code: "+93", flag: "🇦🇫", length: 9 },
    { name: "Albania", code: "+355", flag: "🇦🇱", length: 9 },
    { name: "Algeria", code: "+213", flag: "🇩🇿", length: 9 },
    { name: "Andorra", code: "+376", flag: "🇦🇩", length: 6 },
    { name: "Angola", code: "+244", flag: "🇦🇴", length: 9 },
    { name: "Argentina", code: "+54", flag: "🇦🇷", length: 10 },
    { name: "Armenia", code: "+374", flag: "🇦🇲", length: 8 },
    { name: "Australia", code: "+61", flag: "🇦🇺", length: 9 },
    { name: "Austria", code: "+43", flag: "🇦🇹", length: 10 },
    { name: "Azerbaijan", code: "+994", flag: "🇦🇿", length: 9 },
    { name: "Bahrain", code: "+973", flag: "🇧🇭", length: 8 },
    { name: "Bangladesh", code: "+880", flag: "🇧🇩", length: 10 },
    { name: "Belarus", code: "+375", flag: "🇧🇾", length: 9 },
    { name: "Belgium", code: "+32", flag: "🇧🇪", length: 9 },
    { name: "Bhutan", code: "+975", flag: "🇧🇹", length: 8 },
    { name: "Bolivia", code: "+591", flag: "🇧🇴", length: 8 },
    { name: "Brazil", code: "+55", flag: "🇧🇷", length: 11 },
    { name: "Bulgaria", code: "+359", flag: "🇧🇬", length: 9 },
    { name: "Cambodia", code: "+855", flag: "🇰🇭", length: 9 },
    { name: "Canada", code: "+1", flag: "🇨🇦", length: 10 },
    { name: "Chile", code: "+56", flag: "🇨🇱", length: 9 },
    { name: "China", code: "+86", flag: "🇨🇳", length: 11 },
    { name: "Colombia", code: "+57", flag: "🇨🇴", length: 10 },
    { name: "Costa Rica", code: "+506", flag: "🇨🇷", length: 8 },
    { name: "Croatia", code: "+385", flag: "🇭🇷", length: 9 },
    { name: "Cuba", code: "+53", flag: "🇨🇺", length: 8 },
    { name: "Cyprus", code: "+357", flag: "🇨🇾", length: 8 },
    { name: "Czech Republic", code: "+420", flag: "🇨🇿", length: 9 },
    { name: "Denmark", code: "+45", flag: "🇩🇰", length: 8 },
    { name: "Egypt", code: "+20", flag: "🇪🇬", length: 10 },
    { name: "Estonia", code: "+372", flag: "🇪🇪", length: 8 },
    { name: "Ethiopia", code: "+251", flag: "🇪🇹", length: 9 },
    { name: "Finland", code: "+358", flag: "🇫🇮", length: 9 },
    { name: "France", code: "+33", flag: "🇫🇷", length: 9 },
    { name: "Georgia", code: "+995", flag: "🇬🇪", length: 9 },
    { name: "Germany", code: "+49", flag: "🇩🇪", length: 10 },
    { name: "Ghana", code: "+233", flag: "🇬🇭", length: 9 },
    { name: "Greece", code: "+30", flag: "🇬🇷", length: 10 },
    { name: "Hong Kong", code: "+852", flag: "🇭🇰", length: 8 },
    { name: "Hungary", code: "+36", flag: "🇭🇺", length: 9 },
    { name: "Iceland", code: "+354", flag: "🇮🇸", length: 7 },
    { name: "India", code: "+91", flag: "🇮🇳", length: 10 },
    { name: "Indonesia", code: "+62", flag: "🇮🇩", length: 10 },
    { name: "Iran", code: "+98", flag: "🇮🇷", length: 10 },
    { name: "Iraq", code: "+964", flag: "🇮🇶", length: 10 },
    { name: "Ireland", code: "+353", flag: "🇮🇪", length: 9 },
    { name: "Israel", code: "+972", flag: "🇮🇱", length: 9 },
    { name: "Italy", code: "+39", flag: "🇮🇹", length: 10 }
];

/**
 * NOTE: currentSelectedLength variable BLOCK JS 1B mein declare ho chuka hai.
 * Hum yahan sirf usko update karenge selection ke waqt.
 */

// Modal & Trigger Elements Mapping (Must match BLOCK HTML 2)
const pickerTrigger  = document.getElementById('country-dropdown-trigger');
const pickerOverlay  = document.getElementById('country-picker-overlay');
const closePickerBtn = document.getElementById('close-picker-btn');
const searchBox      = document.getElementById('country-search-input');
const listContainer  = document.getElementById('country-list-scroll');
const currentFlag    = document.getElementById('selected-flag');
const currentCode    = document.getElementById('selected-code');

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4A-1 file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A-2 : Global Region Registry (J to R) --- */
/* --------------------------------------------------------------------- */
/**
 * regionRegistry Expansion:
 * J se R tak ki countries ko existing list mein add kiya ja raha hai.
 */
regionRegistry.push(
    { name: "Jamaica", code: "+1", flag: "🇯🇲", length: 10 },
    { name: "Japan", code: "+81", flag: "🇯🇵", length: 10 },
    { name: "Jordan", code: "+962", flag: "🇯🇴", length: 9 },
    { name: "Kazakhstan", code: "+7", flag: "🇰🇿", length: 10 },
    { name: "Kenya", code: "+254", flag: "🇰🇪", length: 9 },
    { name: "Kuwait", code: "+965", flag: "🇰🇼", length: 8 },
    { name: "Kyrgyzstan", code: "+996", flag: "🇰🇬", length: 9 },
    { name: "Laos", code: "+856", flag: "🇱🇦", length: 8 },
    { name: "Latvia", code: "+371", flag: "🇱🇻", length: 8 },
    { name: "Lebanon", code: "+961", flag: "🇱🇧", length: 8 },
    { name: "Libya", code: "+218", flag: "🇱🇾", length: 9 },
    { name: "Lithuania", code: "+370", flag: "🇱🇹", length: 8 },
    { name: "Luxembourg", code: "+352", flag: "🇱🇺", length: 9 },
    { name: "Macau", code: "+853", flag: "🇲🇴", length: 8 },
    { name: "Malaysia", code: "+60", flag: "🇲🇾", length: 9 },
    { name: "Maldives", code: "+960", flag: "🇲🇻", length: 7 },
    { name: "Malta", code: "+356", flag: "🇲🇹", length: 8 },
    { name: "Mauritius", code: "+230", flag: "🇲🇺", length: 7 },
    { name: "Mexico", code: "+52", flag: "🇲🇽", length: 10 },
    { name: "Moldova", code: "+373", flag: "🇲🇩", length: 8 },
    { name: "Monaco", code: "+377", flag: "🇲🇨", length: 8 },
    { name: "Mongolia", code: "+976", flag: "🇲🇳", length: 8 },
    { name: "Montenegro", code: "+382", flag: "🇲🇪", length: 8 },
    { name: "Morocco", code: "+212", flag: "🇲🇦", length: 9 },
    { name: "Myanmar", code: "+95", flag: "🇲🇲", length: 9 },
    { name: "Nepal", code: "+977", flag: "🇳🇵", length: 10 },
    { name: "Netherlands", code: "+31", flag: "🇳🇱", length: 9 },
    { name: "New Zealand", code: "+64", flag: "🇳🇿", length: 9 },
    { name: "Nigeria", code: "+234", flag: "🇳🇬", length: 10 },
    { name: "North Korea", code: "+850", flag: "🇰🇵", length: 10 },
    { name: "Norway", code: "+47", flag: "🇳🇴", length: 8 },
    { name: "Oman", code: "+968", flag: "🇴🇲", length: 8 },
    { name: "Pakistan", code: "+92", flag: "🇵🇰", length: 10 },
    { name: "Palestine", code: "+970", flag: "🇵🇸", length: 9 },
    { name: "Panama", code: "+507", flag: "🇵🇦", length: 8 },
    { name: "Paraguay", code: "+595", flag: "🇵🇾", length: 9 },
    { name: "Peru", code: "+51", flag: "🇵🇪", length: 9 },
    { name: "Philippines", code: "+63", flag: "🇵🇭", length: 10 },
    { name: "Poland", code: "+48", flag: "🇵🇱", length: 9 },
    { name: "Portugal", code: "+351", flag: "🇵🇹", length: 9 },
    { name: "Qatar", code: "+974", flag: "🇶🇦", length: 8 },
    { name: "Romania", code: "+40", flag: "🇷🇴", length: 9 },
    { name: "Russia", code: "+7", flag: "🇷🇺", length: 10 },
    { name: "Rwanda", code: "+250", flag: "🇷🇼", length: 9 }
);
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4A-2 file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */


/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A-3 : Global Region Registry (S to Z) --- */
/* --------------------------------------------------------------------- */
/**
 * regionRegistry Final Expansion:
 * S se Z tak ki baki countries ko list mein shamil kiya ja raha hai.
 */
regionRegistry.push(
    { name: "Saudi Arabia", code: "+966", flag: "🇸🇦", length: 9 },
    { name: "Senegal", code: "+221", flag: "🇸🇳", length: 9 },
    { name: "Serbia", code: "+381", flag: "🇷🇸", length: 9 },
    { name: "Seychelles", code: "+248", flag: "🇸🇨", length: 7 },
    { name: "Singapore", code: "+65", flag: "🇸🇬", length: 8 },
    { name: "Slovakia", code: "+421", flag: "🇸🇰", length: 9 },
    { name: "Slovenia", code: "+386", flag: "🇸🇮", length: 8 },
    { name: "South Africa", code: "+27", flag: "🇿🇦", length: 9 },
    { name: "South Korea", code: "+82", flag: "🇰🇷", length: 10 },
    { name: "Spain", code: "+34", flag: "🇪🇸", length: 9 },
    { name: "Sri Lanka", code: "+94", flag: "🇱🇰", length: 9 },
    { name: "Sudan", code: "+249", flag: "🇸🇩", length: 9 },
    { name: "Sweden", code: "+46", flag: "🇸🇪", length: 9 },
    { name: "Switzerland", code: "+41", flag: "🇨🇭", length: 9 },
    { name: "Syria", code: "+963", flag: "🇸🇾", length: 9 },
    { name: "Taiwan", code: "+886", flag: "🇹🇼", length: 9 },
    { name: "Tajikistan", code: "+992", flag: "🇹🇯", length: 9 },
    { name: "Tanzania", code: "+255", flag: "🇹🇿", length: 9 },
    { name: "Thailand", code: "+66", flag: "🇹🇭", length: 9 },
    { name: "Tunisia", code: "+216", flag: "🇹🇳", length: 8 },
    { name: "Turkey", code: "+90", flag: "🇹🇷", length: 10 },
    { name: "Turkmenistan", code: "+993", flag: "🇹🇲", length: 8 },
    { name: "Uganda", code: "+256", flag: "🇺🇬", length: 9 },
    { name: "Ukraine", code: "+380", flag: "🇺🇦", length: 9 },
    { name: "United Arab Emirates", code: "+971", flag: "🇦🇪", length: 9 },
    { name: "United Kingdom", code: "+44", flag: "🇬🇧", length: 10 },
    { name: "United States", code: "+1", flag: "🇺🇸", length: 10 },
    { name: "Uruguay", code: "+598", flag: "🇺🇾", length: 8 },
    { name: "Uzbekistan", code: "+998", flag: "🇺🇿", length: 9 },
    { name: "Venezuela", code: "+58", flag: "🇻🇪", length: 10 },
    { name: "Vietnam", code: "+84", flag: "🇻🇳", length: 9 },
    { name: "Yemen", code: "+967", flag: "🇾🇪", length: 9 },
    { name: "Zambia", code: "+260", flag: "🇿🇲", length: 9 },
    { name: "Zimbabwe", code: "+263", flag: "🇿🇼", length: 9 }
);

// Registry ko Alphabetical order me sort karo taaki picker me asani ho
regionRegistry.sort((a, b) => a.name.localeCompare(b.name));
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4A-3 file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */



/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : Rendering & Dynamic Selection Logic --- */
/* --------------------------------------------------------------------- */
/**
 * renderPickerContent: 
 * List ko modal ke andar dikhata hai aur search filter apply karta hai.
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
        
        // Click karne par selection finalize karo
        item.onclick = () => finalizeSelection(region);
        listContainer.appendChild(item);
    });
}

/**
 * finalizeSelection: 
 * Region chunne par UI badalta hai aur validation length set karta hai.
 */
function finalizeSelection(region) {
    // 1. Haptic Feedback
    if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();
    
    // 2. Update Global Validation Length
    currentSelectedLength = region.length;
    console.log(`System: Validation target updated to ${currentSelectedLength} digits for ${region.name}`);

    // 3. Update UI Display
    if (currentFlag) currentFlag.textContent = region.flag;
    if (currentCode) currentCode.textContent = region.code;
    
    // 4. Reset Mobile Input (Nayi country ke sath purana number reset karna behtar hai)
    if (mobileInput) {
        mobileInput.value = "";
        // Tick mark gayab karo agar active tha
        const tickSlot = document.getElementById('phone-tick-icon');
        if (tickSlot) tickSlot.classList.remove('active');
    }

    // 5. Memory Sync for next pages
    sessionStorage.setItem('RP_Country_Code', region.code);
    sessionStorage.setItem('RP_Expected_Length', region.length);
    
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
        // Physical feedback on click
        if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();
        
        // Show Spatial Modal with scale animation (CSS managed)
        pickerOverlay.classList.add('active');
        
        // Load fresh list and focus search box for speed
        renderPickerContent(); 
        if (searchBox) setTimeout(() => searchBox.focus(), 200);
    };
}

/**
 * closePickerModal: Modal ko band karta hai aur search saaf karta hai.
 */
function closePickerModal() {
    if (pickerOverlay) pickerOverlay.classList.remove('active');
    if (searchBox) searchBox.value = "";
}

// Close button listener
if (closePickerBtn) closePickerBtn.onclick = closePickerModal;

// Search Input Listener: Filter as user types
if (searchBox) {
    searchBox.oninput = (e) => renderPickerContent(e.target.value);
}

// Initial Data Load: Page load par list taiyar rakho
renderPickerContent();

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4C file : 1-login/login.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : 1-login/login.js <<=== */
/* ===================================================================== */