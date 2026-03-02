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
 * Ensure karta hai ki valid user hi dashboard par hai.
 * Rule: Agar RP_Temp_Email memory mein nahi hai, toh access blocked.
 */
async function checkUserSession() {
    if (typeof window.showLoader === 'function') window.showLoader('Verifying Identity...');

    // Memory Bridge se email nikaalo (Set by Verification Module)
    const activeEmail = sessionStorage.getItem('RP_Temp_Email');

    if (!activeEmail) {
        // Bina session data ke dashboard access mana hai
        window.location.href = '../1-login/login.html';
        return;
    }

    try {
        // Database se profile fetch engine trigger karo
        await fetchUserProfile(activeEmail);
    } catch (err) {
        console.error("Session Error:", err);
        if (typeof showIsland === 'function') showIsland("Identity verification failed.", "error");
        setTimeout(() => { window.location.href = '../1-login/login.html'; }, 2000);
    }
}

// OS activation check
document.addEventListener('DOMContentLoaded', () => {
    // Thoda sa delay taaki Block 1 ke modules initialize ho jayein
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
 * Supabase 'users' table se user ka verified record nikalta hai.
 * UPDATE: Ab 'login_email' column ka use ho raha hai.
 */
async function fetchUserProfile(email) {
    const { data: user, error } = await _sb
        .from('users')
        .select('*')
        .eq('login_email', email) 
        .maybeSingle();

    if (error || !user) {
        throw new Error("Identity record not found.");
    }

    // Global variable mein save karo taaki baki apps (Identity Card) use kar sakein
    window.currentUserData = user;

    // Dashboard UI ko data se bharo
    populateDashboardUI(user);

    if (typeof window.hideLoader === 'function') window.hideLoader();
    if (typeof showIsland === 'function') showIsland(`Secure Session Active`, `success`);
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2B file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2C : Spatial UI Population (Identity Sync) --- */
/* --------------------------------------------------------------------- */
/**
 * populateDashboardUI: 
 * Database se mile data ko Greeting aur Profile sections mein set karta hai.
 */
function populateDashboardUI(data) {
    const userDisplayName = document.getElementById('user-display-name');
    const userAvatar      = document.getElementById('user-avatar-initial');
    const lockDisplayName = document.getElementById('lock-display-name'); // For Security Module
    
    /**
     * Identity Logic Hierarchy:
     * 1. Official Verified Name (From Dashboard Form)
     * 2. Provider Name (From Google/Yahoo Sync)
     * 3. Telegram Name (From Bot Capture)
     * 4. Email Prefix (Fallback)
     */
    const nameToDisplay = data.verified_name || data.provider_name || data.telegram_name || data.login_email.split('@')[0];
    const initial       = nameToDisplay.charAt(0).toUpperCase();

    // Greeting Update
    if (userDisplayName) {
        userDisplayName.textContent = nameToDisplay;
        userDisplayName.style.textTransform = 'capitalize';
    }
    
    // Avatar Identity Update
    if (userAvatar) {
        userAvatar.textContent = initial;
    }

    // Security Lock Name Update
    if (lockDisplayName) {
        lockDisplayName.textContent = nameToDisplay;
    }

    console.log("Spatial OS: Identity Sync Complete for", nameToDisplay);
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
 * Sidebar mein vertical time aur status indicators ko update karta hai.
 */
function startClockEngine() {
    const clockDisplay    = document.getElementById('dash-clock');
    const greetingTime    = document.getElementById('greeting-time');
    const currentFullDate = document.getElementById('current-full-date');

    function updateOSStatus() {
        const now = new Date();
        
        // 1. Vertical Time Update (Sidebar)
        if (clockDisplay) {
            clockDisplay.textContent = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            });
        }

        // 2. Dynamic Greeting Logic
        const hour = now.getHours();
        let period = "Morning";
        if (hour >= 12 && hour < 17) period = "Afternoon";
        else if (hour >= 17) period = "Evening";

        if (greetingTime) greetingTime.textContent = period;

        // 3. Full Date Update (Greeting Widget)
        if (currentFullDate) {
            currentFullDate.textContent = now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
            }).toUpperCase();
        }
    }

    // Interval: Har 1 second mein update karo
    setInterval(updateOSStatus, 1000);
    updateOSStatus();
}

// OS Status initialization
document.addEventListener('DOMContentLoaded', startClockEngine);
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 3A file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3B : Battery & Connectivity Monitor (iOS Vibe) --- */
/* --------------------------------------------------------------------- */
/**
 * monitorSystemHealth: 
 * Device ki battery aur Wi-Fi status ko sidebar mein reflect karta hai.
 */
function monitorSystemHealth() {
    const batteryPill = document.querySelector('.ios-battery-pill');

    // Battery Logic (If API supported)
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            function updateBatteryUI() {
                const level = battery.level * 100;
                if (batteryPill) {
                    // CSS custom property update for battery percentage
                    batteryPill.style.setProperty('--battery-level', `${level}%`);
                    
                    // Battery color rule
                    if (level <= 20) batteryPill.classList.add('low-power');
                    else batteryPill.classList.remove('low-power');
                }
            }
            updateBatteryUI();
            battery.addEventListener('levelchange', updateBatteryUI);
        });
    }

    // Connectivity Logic
    window.addEventListener('online', () => {
        if (typeof showIsland === 'function') showIsland("Back Online", "success");
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
/* --- Sub-Block 3C : Weather Intelligence (Placeholder) --- */
/* --------------------------------------------------------------------- */
/**
 * updateWeatherUI: 
 * Dummy weather data trigger karta hai (Actual API integration logic here).
 */
function updateWeatherUI() {
    const tempDisplay = document.getElementById('weather-temp');
    const descDisplay = document.getElementById('weather-desc');
    const cityDisplay = document.getElementById('weather-city');

    if (tempDisplay) tempDisplay.textContent = "24°";
    if (descDisplay) descDisplay.textContent = "Partly Cloudy";
    if (cityDisplay) cityDisplay.textContent = "My Location";
}

updateWeatherUI();
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
/* --- Sub-Block 4A : Sidebar Navigation Logic (View Switcher) --- */
/* --------------------------------------------------------------------- */
/**
 * handleNavigation: 
 * Sidebar ke main navigation items ko handle karta hai.
 */
const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
const homeView = document.getElementById('home-dashboard-view');
const pageIndicator = document.getElementById('current-page-title');

if (navItems) {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.triggerHaptic === 'function') window.triggerHaptic();

            const target = item.id;

            // 1. Home View Toggle
            if (target === 'nav-home') {
                // Remove active from all, add to home
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Switch Visibility
                if (homeView) {
                    homeView.style.display = 'block';
                    setTimeout(() => homeView.classList.add('active'), 50);
                }
                
                if (pageIndicator) pageIndicator.textContent = 'Home';
            }
        });
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4A file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : Smart Tool Launcher (Multitasking Engine) --- */
/* --------------------------------------------------------------------- */
/**
 * launchTool: 
 * Calculator aur Notes jaise tools ko bina background app band kiye 
 * ek floating glass card mein load karta hai.
 */
const toolCalc  = document.getElementById('tool-calc');
const toolNotes = document.getElementById('tool-notes');
const masterAvatar = document.getElementById('master-avatar-trigger');

const modulePortal = document.getElementById('universal-module-portal');

async function launchTool(toolName) {
    if (typeof window.triggerHaptic === 'function') window.triggerHaptic();
    
    if (typeof showIsland === 'function') {
        showIsland(`Opening ${toolName.charAt(0).toUpperCase() + toolName.slice(1)}...`, "info");
    }

    /**
     * Multitasking Rule: 
     * Hum naye tool ko 'universal-module-portal' mein inject karenge. 
     * Isse dashboard chalta rahega aur tool uske upar float karega.
     */
    const toolID = `tool-window-${toolName}`;
    
    // Agar tool pehle se khula hai, toh usey focus karo (Shake effect)
    if (document.getElementById(toolID)) {
        const existingTool = document.getElementById(toolID);
        existingTool.style.animation = 'none';
        void existingTool.offsetWidth; // Reflow
        existingTool.style.animation = 'spatialArrival 0.5s var(--spring-ease)';
        return;
    }

    // Yahan hum future mein 'identity.html' ya 'calc.html' fetch karenge
    // Abhi ke liye hum placeholder structure inject kar rahe hain
    const toolHTML = `
        <div id="${toolID}" class="spatial-overlay active" style="display:flex;">
            <div class="app-view-topbar">
                <span class="page-indicator blue-accent">${toolName.toUpperCase()}</span>
                <button class="nav-util-btn haptic-touch" onclick="this.closest('.spatial-overlay').remove()">
                    <i class="fa-light fa-times"></i>
                </button>
            </div>
            <div class="app-view-content" style="padding:2rem; text-align:center;">
                <p class="secondary-label">Loading ${toolName} Module...</p>
                <!-- Actual module logic will be injected here -->
            </div>
        </div>
    `;

    if (modulePortal) {
        modulePortal.insertAdjacentHTML('beforeend', toolHTML);
    }
}

// Click Listeners for Tools
if (toolCalc) toolCalc.onclick = () => launchTool('calculator');
if (toolNotes) toolNotes.onclick = () => launchTool('notes');
if (masterAvatar) masterAvatar.onclick = () => launchTool('identity card');

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4B file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4C : App Grid Launcher (The Hub) --- */
/* --------------------------------------------------------------------- */
/**
 * loadAppGrid: 
 * Grid ke icons par click karne ka logic.
 */
const appGrid = document.getElementById('main-app-grid');

if (appGrid) {
    // Ye event delegation use karta hai (Memory efficient)
    appGrid.addEventListener('click', (e) => {
        const item = e.target.closest('.app-grid-item');
        if (item) {
            const appName = item.querySelector('.app-name').textContent;
            if (typeof window.triggerHaptic === 'function') window.triggerHaptic();
            if (typeof showIsland === 'function') showIsland(`${appName} module is coming soon`, "info");
        }
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4C file : 3-Dashboard/Dashboard.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : 3-Dashboard/Dashboard.js <<=== */
/* ===================================================================== */


