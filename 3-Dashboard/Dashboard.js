/* ===================================================================== */
/* ===>> BLOCK JS 1: Module Initialization & System Engine <<=== */
/* ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------- */
    /* --- Block 1A : DOM Element Selection (Spatial Elements) --- */
    /* --------------------------------------------------------------------- */
    // Dashboard Layout Containers
    const contentArea         = document.getElementById('contentArea');
    const fullscreenLoader    = document.getElementById('fullscreen-loader');
    
    // Navigation & Global UI
    const sidebar             = document.getElementById('sidebar');
    const pageTitle           = document.getElementById('current-page-title');
    const themeToggleBtn      = document.getElementById('dash-theme-toggle');
    const clockDisplay        = document.getElementById('dash-clock');
    
    // Identity & Greeting Elements
    const userAvatar          = document.getElementById('user-avatar-initial');
    const userDisplayName     = document.getElementById('user-display-name');
    const greetingTimeLabel   = document.getElementById('greeting-time');
    const currentFullDate     = document.getElementById('current-full-date');
    
    // System Overlays (Action Sheet & Island)
    const dynamicIsland       = document.getElementById('showIsland');
    const islandMsg           = document.getElementById('island-message');
    const islandIcon          = document.getElementById('island-icon');
    const logoutActionSheet   = document.getElementById('logout-action-sheet');
    
    // State Tracking
    let currentUserData = null;

    /* --------------------------------------------------------------------- */
    /* --- Block 1B : Universal UI Helpers (Island & Haptics) --- */
    /* --------------------------------------------------------------------- */
    /**
     * showIsland: Rule-based visual feedback (Success, Error, Info)
     */
    function showIsland(msg, type = 'info') {
        if (!dynamicIsland) return;
        
        islandMsg.textContent = msg;
        dynamicIsland.className = `dynamic-island-container active ${type}`;
        
        const icons = {
            success: '<i class="fa-solid fa-circle-check" style="color:#34C759"></i>',
            error: '<i class="fa-solid fa-circle-xmark" style="color:#FF3B30"></i>',
            info: '<i class="fa-solid fa-circle-info" style="color:#007AFF"></i>'
        };
        
        islandIcon.innerHTML = icons[type] || icons.info;

        clearTimeout(window.islandTimer);
        window.islandTimer = setTimeout(() => {
            dynamicIsland.classList.remove('active');
        }, 3500);
    }

    /**
     * triggerHaptic: Physical touch simulation (Scale down)
     */
    function triggerHaptic() {
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(10);
        console.log("Haptic Visual: Triggered");
    }

    // Expose helpers globally for other modules (identity.js/card.js)
    window.showIsland = showIsland;
    window.triggerHaptic = triggerHaptic;

    /* --------------------------------------------------------------------- */
    /* --- Block 1C : Theme & Clock Engine (Spatial Style) --- */
    /* --------------------------------------------------------------------- */
    function initTheme() {
        const savedTheme = localStorage.getItem('dash_theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fa-light fa-sun"></i>';
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        triggerHaptic();
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('dash_theme', isDark ? 'dark' : 'light');
        themeToggleBtn.innerHTML = isDark ? '<i class="fa-light fa-sun"></i>' : '<i class="fa-light fa-moon"></i>';
        showIsland(isDark ? 'Dark Mode On' : 'Light Mode On', 'info');
    });

    function updateClock() {
        const now = new Date();
        clockDisplay.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });

        // Dynamic Greeting Logic
        const hour = now.getHours();
        if (hour < 12) greetingTimeLabel.textContent = 'Morning';
        else if (hour < 17) greetingTimeLabel.textContent = 'Afternoon';
        else greetingTimeLabel.textContent = 'Evening';

        // Full Date (iPadOS Style)
        currentFullDate.textContent = now.toLocaleDateString('en-US', { 
            weekday: 'long', day: 'numeric', month: 'long' 
        }).toUpperCase();
    }

    initTheme();
    setInterval(updateClock, 1000);
    updateClock();

    /* --------------------------------------------------------------------- */
    /* --- Block 1D : Loader Controllers --- */
    /* --------------------------------------------------------------------- */
    function showLoader(text) {
        if (!fullscreenLoader) return;
        document.getElementById('loader-text').textContent = text || 'Securing...';
        fullscreenLoader.style.display = 'flex';
        setTimeout(() => fullscreenLoader.classList.add('active'), 10);
    }

    function hideLoader() {
        if (!fullscreenLoader) return;
        fullscreenLoader.classList.remove('active');
        setTimeout(() => { fullscreenLoader.style.display = 'none'; }, 500);
    }

    window.showLoader = showLoader;
    window.hideLoader = hideLoader;

    /* --------------------------------------------------------------------- */
    /* --- End Block 1D file : dashboard.js --- */
    /* --------------------------------------------------------------------- */

}); // DOMContentLoaded End

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : dashboard.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 2: Supabase Auth Guard & Profile Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Block 2A : Session Gatekeeper (Supabase Auth) --- */
/* --------------------------------------------------------------------- */
/**
 * checkUserSession: Ensure karta hai ki user login hai, 
 * varna wapis login page par bhej deta hai.
 */
async function checkUserSession() {
    window.showLoader('Verifying Identity...');

    // Session check from session storage or supabase client
    const tempEmail = sessionStorage.getItem('RP_Temp_Email');
    
    // Agar humein login se aate waqt email nahi mila, to login par bhej do
    if (!tempEmail) {
        window.location.href = '../1-login/login.html';
        return;
    }

    try {
        // Database se user profile fetch karo
        await fetchUserProfile(tempEmail);
    } catch (err) {
        console.error("Session Error:", err);
        window.showIsland("Session expired or invalid.", "error");
        setTimeout(() => { window.location.href = '../1-login/login.html'; }, 2000);
    }
}

// Dom load hone ke turant baad session check karo
document.addEventListener('DOMContentLoaded', checkUserSession);

/* --------------------------------------------------------------------- */
/* --- End Block 2A file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Block 2B : Database Profile Fetcher --- */
/* --------------------------------------------------------------------- */
/**
 * fetchUserProfile: Supabase 'users' table se data nikalta hai.
 */
async function fetchUserProfile(email) {
    const { data: user, error } = await _sb
        .from('users')
        .select('*')
        .eq('personal_email', email)
        .single();

    if (error || !user) {
        throw new Error("Profile not found in system.");
    }

    // Global data store mein save karo
    window.currentUserData = user;
    
    // UI Update karo
    populateDashboardUI(user);
    
    // Loader hatao (Zero-Jerk Transition)
    window.hideLoader();
    window.showIsland(`Secure Session Active`, `success`);
}

/* --------------------------------------------------------------------- */
/* --- End Block 2B file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Block 2C : UI Population Logic --- */
/* --------------------------------------------------------------------- */
function populateDashboardUI(data) {
    const userDisplayName = document.getElementById('user-display-name');
    const userAvatar      = document.getElementById('user-avatar-initial');
    
    // Agar user ka naam nahi hai (sirf registration hui hai), to email ka use karein
    const nameToDisplay = data.personal_email.split('@')[0];
    const initial       = nameToDisplay.charAt(0).toUpperCase();

    if (userDisplayName) {
        userDisplayName.textContent = nameToDisplay;
        userDisplayName.style.textTransform = 'capitalize';
    }
    
    if (userAvatar) {
        userAvatar.textContent = initial;
    }

    // Future use: Card logic ya settings ke liye data ready hai
    console.log("Dashboard UI Ready for:", nameToDisplay);
}

/* --------------------------------------------------------------------- */
/* --- End Block 2C file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : dashboard.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 3: Application Grid, Weather & Logout System <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Block 3A : App Registry & Grid Engine --- */
/* --------------------------------------------------------------------- */
const appRegistry = [
    { name: "Messages",  icon: "chatbubbles",        color: "icon-green",  id: "messages"  },
    { name: "Photos",    icon: "images",              color: "icon-indigo", id: "photos"    },
    { name: "Maps",      icon: "map",                 color: "icon-blue",   id: "maps"      },
    { name: "Weather",   icon: "cloudy",              color: "icon-blue",   id: "weather"   },
    { name: "Wallet",    icon: "wallet",              color: "icon-orange", id: "wallet"    },
    { name: "Notes",     icon: "document-text",       color: "icon-orange", id: "notes"     },
    { name: "Settings",  icon: "settings",            color: "icon-gray",   id: "settings"  },
    { name: "App Store", icon: "logo-apple-appstore", color: "icon-blue",   id: "appstore"  }
];

function loadAppGrid() {
    const appGrid = document.getElementById('main-app-grid');
    if (!appGrid) return;

    appGrid.innerHTML = '';
    appRegistry.forEach(app => {
        const appItem = document.createElement('div');
        appItem.className = 'app-grid-item haptic-touch';
        appItem.innerHTML = `
            <div class="app-icon-box ${app.color}">
                <ion-icon name="${app.icon}"></ion-icon>
            </div>
            <span class="app-name">${app.name}</span>
        `;
        appItem.onclick = () => {
            window.triggerHaptic();
            window.showIsland(`${app.name} coming in Phase 3`, 'info');
        };
        appGrid.appendChild(appItem);
    });
}

// Data load hone ke thodi der baad apps dikhao (Visual flow)
setTimeout(loadAppGrid, 800);

/* --------------------------------------------------------------------- */
/* --- End Block 3A file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Block 3B : Weather API (Spatial Location Engine) --- */
/* --------------------------------------------------------------------- */
async function fetchWeather() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });

        const { latitude: lat, longitude: lon } = position.coords;

        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await weatherRes.json();
        
        const temp = Math.round(data.current_weather.temperature);
        document.getElementById('weather-temp').textContent = `${temp}°`;
        document.getElementById('weather-city').textContent = 'My Location';
        document.getElementById('weather-desc').textContent = 'Spatial Update';

    } catch (error) {
        console.warn("Weather failed:", error);
        document.getElementById('weather-city').textContent = 'Weather';
        document.getElementById('weather-desc').textContent = 'Location Off';
    }
}
fetchWeather();

/* --------------------------------------------------------------------- */
/* --- End Block 3B file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Block 3C : Logout & Session Termination --- */
/* --------------------------------------------------------------------- */
const logoutTrigger     = document.getElementById('logout-btn-trigger');
const logoutActionSheet = document.getElementById('logout-action-sheet');
const confirmLogoutBtn  = document.getElementById('confirm-logout-btn');
const cancelLogoutBtn   = document.getElementById('cancel-logout-btn');

if (logoutTrigger) {
    logoutTrigger.onclick = () => {
        window.triggerHaptic();
        logoutActionSheet.classList.add('active');
    };
}

if (cancelLogoutBtn) {
    cancelLogoutBtn.onclick = () => {
        logoutActionSheet.classList.remove('active');
    };
}

if (confirmLogoutBtn) {
    confirmLogoutBtn.onclick = async () => {
        window.showLoader('Signing out...');
        
        // Clear Local Sessions
        sessionStorage.clear();
        localStorage.removeItem('dash_theme');
        
        setTimeout(() => {
            window.location.href = '../1-login/login.html';
        }, 1500);
    };
}

/* --------------------------------------------------------------------- */
/* --- End Block 3C file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Block 3D : Assistive Touch & Global Navigation --- */
/* --------------------------------------------------------------------- */
const atTrigger     = document.getElementById('at-trigger');
const atMenuOverlay = document.getElementById('at-menu-overlay');

if (atTrigger) {
    atTrigger.onclick = (e) => {
        e.stopPropagation();
        window.triggerHaptic();
        atMenuOverlay.classList.toggle('active');
    };
}

// Bahar click karne par menu band karo
document.addEventListener('click', (e) => {
    if (atMenuOverlay && !atMenuOverlay.contains(e.target) && e.target !== atTrigger) {
        atMenuOverlay.classList.remove('active');
    }
});

window.refreshApp = () => {
    window.showLoader('Refreshing Spatial Cache...');
    setTimeout(() => location.reload(), 1200);
};

window.navigate = (view) => {
    window.showIsland(`Navigation to ${view} active`, 'info');
    atMenuOverlay.classList.remove('active');
};

/* --------------------------------------------------------------------- */
/* --- End Block 3D file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : dashboard.js <<=== */
/* ===================================================================== */