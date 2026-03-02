/* ===================================================================== */
/* ===>> BLOCK JS 1: Spatial OS Initialization & Conflict Fix <<=== */
/* ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1A : OS Element Selection (Local Scope Sync) --- */
    /* --------------------------------------------------------------------- */
    /**
     * Elements Mapping:
     * Variables ko local scope mein rakha gaya hai taaki global modules
     * (Theme.js/Notification.js) ke sath 'Already Declared' error na aaye.
     */
    const dashElements = {
        mainContent:      document.getElementById('main-content'),
        fullscreenLoader: document.getElementById('fullscreen-loader'),
        sidebar:          document.getElementById('sidebar'),
        pageTitle:        document.getElementById('current-page-title'),
        clockDisplay:     document.getElementById('dash-clock'),
        themeToggle:      document.getElementById('global-theme-toggle')
    };
    
    // Sidebar Primary Tools
    const toolCalc      = document.getElementById('tool-calc');
    const toolNotes     = document.getElementById('tool-notes');
    const masterAvatar  = document.getElementById('master-avatar-trigger');
    const logoutBtn     = document.getElementById('logout-btn-trigger');

    /* --------------------------------------------------------------------- */
    /* --- End Sub-Block 1A file : 3-Dashboard/Dashboard.js --- */ 
    /* --------------------------------------------------------------------- */

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1B : OS UI Feedback Helpers (No Collisions) --- */
    /* --------------------------------------------------------------------- */
    /**
     * triggerHaptic: Active Touch Reality Rule.
     */
    function triggerHaptic() {
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(10);
    }
    window.triggerHaptic = triggerHaptic;

    /**
     * NOTE: 'showIsland' aur 'islandContainer' variables ab global hain.
     * Hum yahan unhe dobara declare nahi karenge taaki error na aaye.
     */

    /* --------------------------------------------------------------------- */
    /* --- End Sub-Block 1B file : 3-Dashboard/Dashboard.js --- */ 
    /* --------------------------------------------------------------------- */

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1C : OS Loader Controls (Zero-Jerk Arrival) --- */
    /* --------------------------------------------------------------------- */
    window.showLoader = (text = 'Securing Identity...') => {
        if (!dashElements.fullscreenLoader) return;
        const loaderText = document.getElementById('loader-text');
        if (loaderText) loaderText.textContent = text;
        dashElements.fullscreenLoader.style.display = 'flex';
        setTimeout(() => dashElements.fullscreenLoader.classList.add('active'), 50);
    };

    window.hideLoader = () => {
        if (!dashElements.fullscreenLoader) return;
        dashElements.fullscreenLoader.classList.remove('active');
        setTimeout(() => { 
            dashElements.fullscreenLoader.style.display = 'none'; 
        }, 600);
    };

    /* --------------------------------------------------------------------- */
    /* --- End Sub-Block 1C file : 3-Dashboard/Dashboard.js --- */ 
    /* --------------------------------------------------------------------- */

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1D : OS Theme Sync (Safe Recovery) --- */
    /* --------------------------------------------------------------------- */
    /**
     * syncDashboardState: 
     * Theme icons ko initial load par sahi state mein rakhta hai.
     */
    function syncDashboardState() {
        const savedTheme = localStorage.getItem('RP_System_Theme') || 'light';
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.className = (savedTheme === 'dark') ? 'fa-light fa-sun' : 'fa-light fa-moon';
        }
    }
    syncDashboardState();

    /* --------------------------------------------------------------------- */
    /* --- End Sub-Block 1D file : 3-Dashboard/Dashboard.js --- */ 
    /* --------------------------------------------------------------------- */

});

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 3-Dashboard/Dashboard.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 2: Identity Session & Profile Engine (Supabase) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2A : Session Gatekeeper (Entrance Security) --- */
/* --------------------------------------------------------------------- */
/**
 * checkUserSession: 
 * Dashboard khulne se pehle memory bridge check karta hai.
 * Rule: No access without valid session data (RP_Temp_Email).
 */
async function checkUserSession() {
    if (typeof window.showLoader === 'function') window.showLoader('Verifying Identity...');

    // Memory Bridge se email nikaalo (Set by Verification Module)
    const activeEmail = sessionStorage.getItem('RP_Temp_Email');

    if (!activeEmail) {
        console.error("OS Security: No session found. Redirecting to Entry.");
        window.location.href = '../1-login/login.html';
        return;
    }

    try {
        // Database lookup trigger
        await fetchUserProfile(activeEmail);
    } catch (err) {
        console.error("OS Security: Session verification failed ->", err);
        if (typeof showIsland === 'function') showIsland("Identity validation failed.", "error");
        setTimeout(() => { window.location.href = '../1-login/login.html'; }, 2000);
    }
}

// OS activation check engine
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure core modules are initialized
    setTimeout(checkUserSession, 150);
});
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2A file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2B : Database Profile Fetcher (Naming Sync) --- */
/* --------------------------------------------------------------------- */
/**
 * fetchUserProfile: 
 * Global '_sb' instance ka use karke profile fetch karta hai.
 */
async function fetchUserProfile(email) {
    // Safety: Check if global client is ready
    const db = window._sb || (typeof _sb !== 'undefined' ? _sb : null);
    
    if (!db) {
        throw new Error("Supabase Engine not initialized.");
    }

    const { data: user, error } = await db
        .from('users')
        .select('*')
        .eq('login_email', email) 
        .maybeSingle();

    if (error || !user) {
        throw new Error("Identity record not found in system.");
    }

    window.currentUserData = user;
    populateDashboardUI(user);

    if (typeof window.hideLoader === 'function') window.hideLoader();
    if (typeof showIsland === 'function') showIsland(`Identity Secured: ${email}`, `success`);
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2B file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2C : Spatial UI Population (Identity Sync) --- */
/* --------------------------------------------------------------------- */
/**
 * populateDashboardUI: 
 * Database se mile data ko Greeting aur Profile sections mein makkhan
 * ki tarah set karta hai.
 */
function populateDashboardUI(data) {
    const userDisplayName = document.getElementById('user-display-name');
    const userAvatar      = document.getElementById('user-avatar-initial');
    
    /**
     * Identity Logic Hierarchy (Rules based selection):
     * 1. verified_name (Asli official naam)
     * 2. provider_name (Google/Yahoo se sync hua naam)
     * 3. telegram_name (Bot se capture kiya naam)
     * 4. login_email prefix (Last fallback)
     */
    const nameToDisplay = data.verified_name || data.provider_name || data.telegram_name || data.login_email.split('@')[0];
    const initial       = nameToDisplay.charAt(0).toUpperCase();

    // 1. Dashboard Greeting Widget update
    if (userDisplayName) {
        userDisplayName.textContent = nameToDisplay;
        userDisplayName.style.textTransform = 'capitalize';
    }
    
    // 2. Sidebar Profile Pill Identity update
    if (userAvatar) {
        userAvatar.textContent = initial;
    }

    console.log("Spatial OS: Dashboard identity synced for", nameToDisplay);
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2C file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 3-Dashboard/Dashboard.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 3: Real-time UI Controls & Dynamic Environment <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3A : Real-time Clock Engine (Sidebar Sync) --- */
/* --------------------------------------------------------------------- */
/**
 * startClockEngine: 
 * Sidebar mein vertical time aur Greeting Widget mein date update karta hai.
 * Rule: 1-second precision updates.
 */
function startClockEngine() {
    const clockDisplay    = document.getElementById('dash-clock');
    const greetingTime    = document.getElementById('greeting-time');
    const currentFullDate = document.getElementById('current-full-date');

    function updateOSStatus() {
        const now = new Date();
        
        // 1. Sidebar Vertical Time (12-hour format with AM/PM)
        if (clockDisplay) {
            clockDisplay.textContent = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            });
        }

        // 2. Greeting Widget: Morning/Afternoon/Evening Logic
        const hour = now.getHours();
        let period = "Morning";
        if (hour >= 12 && hour < 17) period = "Afternoon";
        else if (hour >= 17) period = "Evening";

        if (greetingTime) greetingTime.textContent = period;

        // 3. Greeting Widget: Official Full Date Display
        if (currentFullDate) {
            currentFullDate.textContent = now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
            }).toUpperCase();
        }
    }

    // Har ek second mein clock aur greeting refresh karo
    setInterval(updateOSStatus, 1000);
    updateOSStatus();
}

// OS Environment trigger on load
document.addEventListener('DOMContentLoaded', startClockEngine);
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 3A file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3B : Battery & Connectivity Monitor (iOS Vibe) --- */
/* --------------------------------------------------------------------- */
/**
 * monitorSystemHealth: 
 * Device ki asli battery level aur internet connection ko sidebar mein dikhata hai.
 */
function monitorSystemHealth() {
    const batteryPill = document.querySelector('.ios-battery-pill');

    // 1. Battery Status Logic (Using Browser API)
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            function updateBatteryUI() {
                const level = battery.level * 100;
                if (batteryPill) {
                    // CSS variable update for dynamic fill
                    batteryPill.style.width = '18px'; // Base width
                    batteryPill.style.setProperty('--battery-level', `${level}%`);
                    
                    // Low Power Mode Visual (Red color if < 20%)
                    if (level <= 20) batteryPill.style.borderColor = '#FF3B30';
                    else batteryPill.style.borderColor = 'var(--p-text)';
                }
            }
            updateBatteryUI();
            battery.addEventListener('levelchange', updateBatteryUI);
        });
    }

    // 2. Online/Offline Notifications (Universal Island Sync)
    window.addEventListener('online', () => {
        if (typeof showIsland === 'function') showIsland("System Online", "success");
    });
    window.addEventListener('offline', () => {
        if (typeof showIsland === 'function') showIsland("Connection Lost", "error");
    });
}

monitorSystemHealth();
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 3B file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3C : Weather Widget (Placeholder Logic) --- */
/* --------------------------------------------------------------------- */
/**
 * updateWeatherWidget: 
 * Dashboard widget par temperature aur status update karta hai.
 */
function updateWeatherWidget() {
    const tempDisplay = document.getElementById('weather-temp');
    const descDisplay = document.getElementById('weather-desc');

    if (tempDisplay) tempDisplay.textContent = "24°";
    if (descDisplay) descDisplay.textContent = "Partly Cloudy";
}

updateWeatherWidget();
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 3C file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : 3-Dashboard/Dashboard.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 4: Sidebar Navigation & Multitasking Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A : Sidebar Navigation Engine (View Switcher) --- */
/* --------------------------------------------------------------------- */
/**
 * handleNavigation: 
 * Sidebar ke main navigation icons (Home) ko control karta hai.
 * Rule: 0.6s smooth transition between views.
 */
const navHomeBtn = document.getElementById('nav-home');
const homeView   = document.getElementById('home-dashboard-view');
const pageHeader = document.getElementById('current-page-title');

if (navHomeBtn) {
    navHomeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof window.triggerHaptic === 'function') window.triggerHaptic();

        // 1. Navigation State Update
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        navHomeBtn.classList.add('active');

        // 2. View Restoration
        if (homeView) {
            homeView.style.display = 'block';
            setTimeout(() => homeView.classList.add('active'), 50);
        }
        
        if (pageHeader) pageHeader.textContent = 'Home';
        
        if (typeof showIsland === 'function') showIsland("Navigated to Home", "info");
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4A file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : OS Multitasking Engine (Tool Launcher) --- */
/* --------------------------------------------------------------------- */
/**
 * launchSpatialTool: 
 * Calculator, Notes aur Identity modules ko bina dashboard bnd kiye 
 * 'universal-module-portal' mein inject karke "Float" karwata hai.
 */
const toolCalcBtn   = document.getElementById('tool-calc');
const toolNotesBtn  = document.getElementById('tool-notes');
const avatarTrigger = document.getElementById('master-avatar-trigger');

async function launchSpatialTool(toolID, displayName) {
    if (typeof window.triggerHaptic === 'function') window.triggerHaptic();
    
    const portal = document.getElementById('universal-module-portal');
    const windowID = `spatial-window-${toolID}`;

    // Rule: Agar tool pehle se khula hai, toh usey focus (pop) karo
    if (document.getElementById(windowID)) {
        const existingWin = document.getElementById(windowID);
        existingWin.classList.remove('active');
        void existingWin.offsetWidth; // Reflow for animation restart
        existingWin.classList.add('active');
        return;
    }

    if (typeof showIsland === 'function') {
        showIsland(`Opening ${displayName}...`, "info");
    }

    // Modular HTML Structure for Floating Tools
    const toolHTML = `
        <div id="${windowID}" class="spatial-overlay active" style="display:flex;">
            <div class="app-view-topbar spatial-glass">
                <span class="page-indicator blue-accent">${displayName.toUpperCase()}</span>
                <button class="nav-util-btn haptic-touch" onclick="this.closest('.spatial-overlay').remove()">
                    <i class="fa-light fa-times"></i>
                </button>
            </div>
            <div class="app-view-content" id="content-${toolID}">
                <div style="padding:4rem; text-align:center;">
                    <i class="fa-light fa-spinner-third fa-spin" style="font-size:3rem; color:var(--blue-accent);"></i>
                    <p class="secondary-label" style="margin-top:1.5rem;">Syncing ${displayName} Module...</p>
                </div>
            </div>
        </div>
    `;

    if (portal) {
        portal.insertAdjacentHTML('beforeend', toolHTML);
    }
}

// Sidebar Tool Listeners
if (toolCalcBtn)   toolCalcBtn.onclick   = () => launchSpatialTool('calculator', 'Calculator');
if (toolNotesBtn)  toolNotesBtn.onclick  = () => launchSpatialTool('notes', 'Notes');
if (avatarTrigger) avatarTrigger.onclick = () => launchSpatialTool('identity-card', 'Identity Card');

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4B file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4C : App Grid Launcher (The Identity Ecosystem) --- */
/* --------------------------------------------------------------------- */
/**
 * loadAppLibrary: 
 * Grid ke icons par click karne ka logic. 
 * Hum event delegation use karte hain taaki memory load kam ho.
 */
const mainAppGrid = document.getElementById('main-app-grid');

if (mainAppGrid) {
    mainAppGrid.addEventListener('click', (e) => {
        const appItem = e.target.closest('.app-grid-item');
        if (appItem) {
            const appName = appItem.querySelector('.app-name').textContent;
            if (typeof window.triggerHaptic === 'function') window.triggerHaptic();
            if (typeof showIsland === 'function') showIsland(`${appName} coming soon to OS`, "info");
        }
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4C file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : 3-Dashboard/Dashboard.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 5: System Overlays & OS Entrance Reveal <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5A : Assistive Touch (Master Menu Logic) --- */
/* --------------------------------------------------------------------- */
/**
 * handleAssistiveTouch: 
 * Floating circle menu ko toggle karta hai aur quick shortcuts manage karta hai.
 */
const atTriggerBtn   = document.getElementById('at-trigger');
const atMenuGrid     = document.getElementById('at-menu-overlay');
const atHomeAction   = document.getElementById('at-home-trigger');
const atLockAction   = document.getElementById('at-lock-trigger');
const atLogoutAction = document.getElementById('at-logout-trigger');

if (atTriggerBtn) {
    atTriggerBtn.onclick = (e) => {
        e.stopPropagation();
        if (typeof window.triggerHaptic === 'function') window.triggerHaptic();
        if (atMenuGrid) atMenuGrid.classList.toggle('active');
    };
}

// AT Menu: Home Shortcut
if (atHomeAction) {
    atHomeAction.onclick = () => {
        const homeNav = document.getElementById('nav-home');
        if (homeNav) homeNav.click();
        if (atMenuGrid) atMenuGrid.classList.remove('active');
    };
}

// AT Menu: Manual Lock (Trigger for Identity Lock Module)
if (atLockAction) {
    atLockAction.onclick = () => {
        if (typeof window.triggerHaptic === 'function') window.triggerHaptic();
        if (typeof showIsland === 'function') showIsland("System Locked Manually", "info");
        if (atMenuGrid) atMenuGrid.classList.remove('active');
    };
}

// Global Click listener: Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (atMenuGrid && atMenuGrid.classList.contains('active')) {
        if (!atMenuGrid.contains(e.target) && e.target !== atTriggerBtn) {
            atMenuGrid.classList.remove('active');
        }
    }
});
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5A file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5B : Spatial Logout Engine (Action Sheet) --- */
/* --------------------------------------------------------------------- */
/**
 * handleLogoutFlow: 
 * Sign-out confirm karne ke liye premium drawer dikhata hai.
 */
const logoutRequestBtn  = document.getElementById('logout-btn-trigger');
const logoutSheet       = document.getElementById('logout-action-sheet');
const confirmLogoutBtn  = document.getElementById('confirm-logout-btn');
const cancelLogoutBtn   = document.getElementById('cancel-logout-btn');

function showLogoutConfirmation() {
    if (typeof window.triggerHaptic === 'function') window.triggerHaptic();
    if (logoutSheet) logoutSheet.classList.add('active');
    if (atMenuGrid) atMenuGrid.classList.remove('active');
}

if (logoutRequestBtn) logoutRequestBtn.onclick = showLogoutConfirmation;
if (atLogoutAction) atLogoutAction.onclick = showLogoutConfirmation;

if (cancelLogoutBtn) {
    cancelLogoutBtn.onclick = () => {
        if (typeof window.triggerHaptic === 'function') window.triggerHaptic();
        logoutSheet.classList.remove('active');
    };
}

if (confirmLogoutBtn) {
    confirmLogoutBtn.onclick = () => {
        if (typeof window.triggerHaptic === 'function') window.triggerHaptic();
        if (typeof window.showLoader === 'function') window.showLoader('Ending Identity Session...');
        sessionStorage.clear();
        setTimeout(() => { window.location.href = '../1-login/login.html'; }, 1500);
    };
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5B file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5C : OS Entrance Reveal (The Magic Trigger) --- */
/* --------------------------------------------------------------------- */
/**
 * revealDashboardOS: 
 * Page load par system ko detect karta hai aur views ko zinda karta hai.
 * Fix: Ensures Home View is visible immediately after identity sync.
 */
function revealDashboardOS() {
    console.log("Spatial OS: Environment Fully Connected.");
    
    // 1. Force Activate Home View on Entrance
    const homeView = document.getElementById('home-dashboard-view');
    const navHome  = document.getElementById('nav-home');
    
    if (homeView) {
        homeView.style.display = 'block';
        setTimeout(() => {
            homeView.classList.add('active');
        }, 100);
    }

    if (navHome) navHome.classList.add('active');

    // 2. Hide Loader after entrance is ready
    setTimeout(() => {
        if (typeof window.hideLoader === 'function') window.hideLoader();
    }, 2000);
}

// Main OS Entrance trigger
window.addEventListener('load', revealDashboardOS);

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5C file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 5 file : 3-Dashboard/Dashboard.js <<=== */
/* ===================================================================== */