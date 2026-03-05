/* ===================================================================== */
/* ===>> BLOCK JS 1: Spatial OS Initialization & Theme Sync Fix <<=== */
/* ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1A : OS Element Selection (Local Scope Sync) --- */
    /* --------------------------------------------------------------------- */
    /**
     * dashElements: 
     * Dashboard ke main containers aur controls ki mapping.
     */
    const dashElements = {
        mainContent:      document.getElementById('main-content'),
        fullscreenLoader: document.getElementById('fullscreen-loader'),
        sidebar:          document.getElementById('sidebar'),
        pageTitle:        document.getElementById('current-page-title'),
        clockDisplay:     document.getElementById('dash-clock'),
        themeToggle:      document.getElementById('global-theme-toggle')
    };
    
    // Sidebar Tools & Actions
    const toolCalc      = document.getElementById('tool-calc');
    const toolNotes     = document.getElementById('tool-notes');
    const masterAvatar  = document.getElementById('master-avatar-trigger');
    const logoutBtn     = document.getElementById('logout-btn-trigger');

    /* --------------------------------------------------------------------- */
    /* --- End Sub-Block 1A file : 3-Dashboard/Dashboard.js --- */ 
    /* --------------------------------------------------------------------- */

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1B : OS UI Feedback Helpers (Haptics) --- */
    /* --------------------------------------------------------------------- */
    /**
     * triggerHaptic: Active Touch Reality rule.
     */
    function triggerHaptic() {
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(10);
    }
    window.triggerHaptic = triggerHaptic;

    /* --------------------------------------------------------------------- */
    /* --- End Sub-Block 1B file : 3-Dashboard/Dashboard.js --- */ 
    /* --------------------------------------------------------------------- */

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1C : OS Loader Controls (Zero-Jerk Arrival) --- */
    /* --------------------------------------------------------------------- */
    /**
     * showLoader / hideLoader: 
     * Spatial entrance animations ko manage karta hai.
     */
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
    /* --- Sub-Block 1D : OS Theme Engine (Icon Persistence Fix) --- */
    /* --------------------------------------------------------------------- */
    /**
     * syncDashboardTheme: 
     * Page load hote hi turant sahi icon (Sun/Moon) set karta hai.
     * Rule: White means White, Black means Black.
     */
    function syncDashboardTheme() {
        const savedTheme = localStorage.getItem('RP_System_Theme') || 'light';
        const themeIcon = document.getElementById('theme-icon');
        
        // 1. Initial State Sync
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun'; // Solid for visibility
        } else {
            document.body.classList.remove('dark-mode');
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon'; // Solid for visibility
        }
    }

    // Theme recovery trigger
    syncDashboardTheme();

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
/* ===>> BLOCK JS 4: Layered Routing Engine (Production Ready) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A : Core View & Element References --- */
/* --------------------------------------------------------------------- */
const homeView        = document.getElementById('home-dashboard-view');
const homeAppStage    = document.getElementById('home-app-stage');
const pageHeader      = document.getElementById('current-page-title');
const navHomeBtn      = document.getElementById('nav-home');
const modulePortal    = document.getElementById('universal-module-portal');
const toolCalcBtn     = document.getElementById('tool-calc');
const toolNotesBtn    = document.getElementById('tool-notes');
const avatarTrigger   = document.getElementById('master-avatar-trigger');

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : View Switch Engine (Home Replace Mode) --- */
/* --------------------------------------------------------------------- */
/**
 * launchHomeReplaceApp:
 * Grid apps ko home ki jagah replace karta hai.
 */
function launchHomeReplaceApp(app) {
    if (!homeView || !homeAppStage) return;

    // 1. Hide Home View
    homeView.classList.remove('active');

    // 2. Inject App Content into Stage
    homeAppStage.innerHTML = `
        <div style="padding:3rem; color: var(--p-text);">
            <h2 style="font-size:2.2rem; font-weight:800;">${app.name}</h2>
            <p style="margin-top:1rem; opacity:0.7;">This app is running in 'Home Replace Mode'.</p>
            <button class="haptic-touch" onclick="returnToHomeLayer()"
                    style="margin-top:2rem; padding: 12px 24px; border-radius: 12px; border: none; background: var(--blue-accent); color: white; font-weight: 600;">
                Back to Home
            </button>
        </div>
    `;

    // 3. Activate App Stage & Update Header
    homeAppStage.classList.add('active');
    if (pageHeader) pageHeader.textContent = app.name;
}

/**
 * returnToHomeLayer:
 * App stage se wapas home par aata hai.
 */
function returnToHomeLayer() {
    if (!homeView || !homeAppStage) return;

    // 1. Hide App Stage
    homeAppStage.classList.remove('active');
    homeAppStage.innerHTML = '';

    // 2. Restore Home View & Header
    homeView.classList.add('active');
    if (pageHeader) pageHeader.textContent = "Home";
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4C : Global Floating Panel Launcher (Sidebar Tools) --- */
/* --------------------------------------------------------------------- */
/**
 * launchSpatialTool: 
 * Ye function ab sirf Sidebar tools aur system popups ke liye hai.
 * Grid apps ise use nahi karti.
 */
async function launchSpatialTool(toolID, displayName) {
    if (typeof window.triggerHaptic === 'function') window.triggerHaptic();
    if (!modulePortal) return;

    const windowID = `spatial-window-${toolID}`;
    if (document.getElementById(windowID)) return; // Prevent duplicates

    if (typeof showIsland === 'function') showIsland(`Launching ${displayName}...`, "info");

    const toolHTML = `
        <div id="${windowID}" class="spatial-overlay active">
            <div class="app-view-topbar spatial-glass haptic-touch" style="cursor: move;">
                <div class="window-controls"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div>
                <span class="page-indicator blue-accent" style="font-size:0.8rem;">${displayName.toUpperCase()}</span>
                <button class="nav-util-btn haptic-touch" onclick="this.closest('.spatial-overlay').remove()" style="width:24px; height:24px;">
                    <i class="fa-solid fa-xmark" style="font-size:0.7rem;"></i>
                </button>
            </div>
            <div class="app-view-content" id="content-${toolID}">
                <div style="padding:4rem; text-align:center; color: var(--p-text);">
                    <i class="fa-solid fa-circle-notch fa-spin" style="font-size:3rem; color:var(--blue-accent);"></i>
                    <p class="secondary-label" style="margin-top:1.5rem; font-weight:600;">${displayName} Module is loading...</p>
                </div>
            </div>
        </div>
    `;
    modulePortal.insertAdjacentHTML('beforeend', toolHTML);
}

// Sidebar Tool bindings remain UNCHANGED
if (toolCalcBtn)   toolCalcBtn.onclick   = () => launchSpatialTool('calculator', 'Calculator');
if (toolNotesBtn)  toolNotesBtn.onclick  = () => launchSpatialTool('notes', 'Notes');
if (avatarTrigger) avatarTrigger.onclick = () => launchSpatialTool('identity-card', 'Identity Card');

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4D : Identity Window Bridge & Auto-Launcher --- */
/* --------------------------------------------------------------------- */
// Ye poora block bilkul waise hi rahega, untouched
window.addEventListener('message', (event) => {
    const { type, message, msgType } = event.data;
    if (type === 'NOTIFY_USER' && typeof showIsland === 'function') {
        showIsland(message, msgType || 'info');
    }
});

function launchIdentityOverlay() {
    const iframeHTML = `<iframe src="../4-identity/identity.html" id="identity-iframe" style="width:100%; height:100%; border:none;"></iframe>`;
    // launchSpatialTool ab isko handle karega
    launchSpatialTool('identity-setup', 'Identity Setup', iframeHTML);
}

setTimeout(() => {
    const user = window.currentUserData;
    if (user && (!user.identity_step || user.identity_step < 7)) {
        launchIdentityOverlay();
    }
}, 3000);

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4E : Ecosystem Registry & Grid Launcher (Updated Logic) --- */
/* --------------------------------------------------------------------- */
const appRegistry = [
    { id: "thought", name: "True Thought",   icon: "fa-brain",         color: "icon-indigo" },
    { id: "text",    name: "True Tell Text", icon: "fa-comment-dots",  color: "icon-green"  },
    { id: "call",    name: "Right-Call",     icon: "fa-phone-volume",  color: "icon-blue"   },
    { id: "moments", name: "Real Moments",   icon: "fa-camera-retro",  color: "icon-red"    },
    { id: "storage", name: "Safe Storage",   icon: "fa-vault",         color: "icon-gray"   },
    { id: "pay",     name: "PayTime",        icon: "fa-wallet",        color: "icon-orange" },
    { id: "news",    name: "Verify News",    icon: "fa-newspaper",     color: "icon-indigo" },
    { id: "jobs",    name: "Correct Jobs",   icon: "fa-briefcase",     color: "icon-blue"   }
];

function loadEcosystemGrid() {
    const appGrid = document.getElementById('main-app-grid');
    if (!appGrid) return;
    appGrid.innerHTML = '';
    
    appRegistry.forEach(app => {
        const appItem = document.createElement('div');
        appItem.className = 'app-grid-item haptic-touch';
        appItem.innerHTML = `<div class="app-icon-box ${app.color}"><i class="fa-solid ${app.icon}"></i></div><span class="app-name">${app.name}</span>`;
        
        // *** THE MAIN LOGIC CHANGE IS HERE ***
        // Grid apps ab "Home Replace" use karengi
        appItem.onclick = () => launchHomeReplaceApp(app);
        
        appGrid.appendChild(appItem);
    });
}

// OS Start: Load apps into the grid
setTimeout(loadEcosystemGrid, 500);

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4F : Home Button Navigation (Safe Reset) --- */
/* --------------------------------------------------------------------- */
if (navHomeBtn) {
    navHomeBtn.onclick = (e) => {
        e.preventDefault();
        returnToHomeLayer(); // Ab ye safe reset use karega
    };
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4F file : 3-Dashboard/Dashboard.js --- */
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
 * Floating circle menu ko toggle karta hai aur navigation shortcuts handle karta hai.
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

// AT Menu: Manual Lock Trigger
if (atLockAction) {
    atLockAction.onclick = () => {
        if (typeof window.triggerHaptic === 'function') window.triggerHaptic();
        if (typeof showIsland === 'function') showIsland("Identity Locked Manually", "info");
        if (atMenuGrid) atMenuGrid.classList.remove('active');
    };
}

// Global Click listener: Menu bahar click karne par band ho jaye
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
 * Confirmation drawer dikhata hai aur session clear karta hai.
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
        if (logoutSheet) logoutSheet.classList.remove('active');
    };
}

if (confirmLogoutBtn) {
    confirmLogoutBtn.onclick = () => {
        if (typeof window.triggerHaptic === 'function') window.triggerHaptic();
        if (typeof window.showLoader === 'function') window.showLoader('Ending Identity Session...');
        
        sessionStorage.clear(); // Clear all temp data
        
        setTimeout(() => {
            window.location.href = '../1-login/login.html';
        }, 1500);
    };
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5B file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5C : OS Entrance Reveal (The Force Unlock) --- */
/* --------------------------------------------------------------------- */
/**
 * revealDashboardOS: 
 * Ye hamara main engine hai jo load hone par system ko zinda karta hai.
 * Force Reveal Logic: Home View ko forcefully activate karega.
 */
function revealDashboardOS() {
    console.log("Spatial OS: Final Entrance Signal Triggered.");

    const homeView    = document.getElementById('home-dashboard-view');
    const navHome     = document.getElementById('nav-home');
    const contentArea = document.getElementById('contentArea');

    // 1. Home View Reveal (Forcefully)
    if (homeView) {
        homeView.style.display = 'block'; // Direct display
        
        // Small delay for entrance scaling animation
        setTimeout(() => {
            homeView.classList.add('active');
            if (contentArea) contentArea.classList.add('active');
            console.log("Spatial OS: Home View Successfully Revealed.");
        }, 200);
    }

    // 2. Sidebar Link Sync
    if (navHome) {
        navHome.classList.add('active');
    }

    // 3. Clear Entrance Loader
    setTimeout(() => {
        if (typeof window.hideLoader === 'function') window.hideLoader();
        document.body.classList.add('loaded'); // Full opacity trigger
    }, 1800);
}

// Window load hote hi reveal engine chalu karo
window.addEventListener('load', revealDashboardOS);

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5C file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 5 file : 3-Dashboard/Dashboard.js <<=== */
/* ===================================================================== */