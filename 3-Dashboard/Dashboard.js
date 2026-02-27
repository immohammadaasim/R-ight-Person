/* ===================================================================== */
/* ===>> BLOCK JS 1: System Engine & UI Initialization <<=== */
/* ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1A : DOM Element Selection (Spatial System) --- */
    /* --------------------------------------------------------------------- */
    // Layout Containers
    const contentArea         = document.getElementById('contentArea');
    const fullscreenLoader    = document.getElementById('fullscreen-loader');
    const sidebar             = document.getElementById('sidebar');
    
    // Top Navbar Components
    const pageTitle           = document.getElementById('current-page-title');
    const themeToggleBtn      = document.getElementById('dash-theme-toggle');
    const clockDisplay        = document.getElementById('dash-clock');
    
    // Profile & Greetings
    const userAvatar          = document.getElementById('user-avatar-initial');
    const userDisplayName     = document.getElementById('user-display-name');
    const greetingTimeLabel   = document.getElementById('greeting-time');
    const currentFullDate     = document.getElementById('current-full-date');
    
    // System Overlays
    const dynamicIsland       = document.getElementById('showIsland');
    const islandMsg           = document.getElementById('island-message');
    const islandIcon          = document.getElementById('island-icon');

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1B : Universal UI Feedback (The Island) --- */
    /* --------------------------------------------------------------------- */
    /**
     * showIsland: Rule-based Universal Notification Protocol.
     * iOS 18 Notch pop-out animation.
     */
    function showIsland(msg, type = 'info') {
        if (!dynamicIsland) return;
        
        islandMsg.textContent = msg;
        dynamicIsland.className = `dynamic-island-container active ${type}`;
        
        // Premium SF Symbol vibe icons
        const icons = {
            success: '<i class="fa-solid fa-circle-check" style="color:#34C759"></i>',
            error: '<i class="fa-solid fa-circle-xmark" style="color:#FF3B30"></i>',
            info: '<i class="fa-solid fa-circle-info" style="color:#007AFF"></i>'
        };
        
        islandIcon.innerHTML = icons[type] || icons.info;

        // Auto-contract logic
        clearTimeout(window.islandTimer);
        window.islandTimer = setTimeout(() => {
            dynamicIsland.classList.remove('active');
        }, 3500);
    }

    /**
     * triggerHaptic: Active Touch Reality Rule.
     */
    function triggerHaptic() {
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(10);
        console.log("Haptic Visual: Physical feedback simulated.");
    }

    // Export to Global Window for other modules
    window.showIsland = showIsland;
    window.triggerHaptic = triggerHaptic;

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1C : Theme Engine (Persistent Spatial Theme) --- */
    /* --------------------------------------------------------------------- */
    function initTheme() {
        const savedTheme = localStorage.getItem('RP_Dash_Theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fa-light fa-sun"></i>';
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        triggerHaptic();
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('RP_Dash_Theme', isDark ? 'dark' : 'light');
        themeToggleBtn.innerHTML = isDark ? '<i class="fa-light fa-sun"></i>' : '<i class="fa-light fa-moon"></i>';
        showIsland(isDark ? 'Dark Mode On' : 'Light Mode On', 'info');
    });

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1D : Real-time Clock & Dynamic Greeting --- */
    /* --------------------------------------------------------------------- */
    function updateClock() {
        if (!clockDisplay) return;
        const now = new Date();
        
        // iOS Style Time
        clockDisplay.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });

        // Greeting Logic based on Time of Day
        const hour = now.getHours();
        if (hour < 12) greetingTimeLabel.textContent = 'Morning';
        else if (hour < 17) greetingTimeLabel.textContent = 'Afternoon';
        else greetingTimeLabel.textContent = 'Evening';

        // Full Date Update
        currentFullDate.textContent = now.toLocaleDateString('en-US', { 
            weekday: 'long', day: 'numeric', month: 'long' 
        }).toUpperCase();
    }

    initTheme();
    setInterval(updateClock, 1000);
    updateClock();

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1E : Loader Controls (Zero-Jerk Flow) --- */
    /* --------------------------------------------------------------------- */
    window.showLoader = (text) => {
        if (!fullscreenLoader) return;
        document.getElementById('loader-text').textContent = text || 'Securing...';
        fullscreenLoader.style.display = 'flex';
        setTimeout(() => fullscreenLoader.classList.add('active'), 10);
    };

    window.hideLoader = () => {
        if (!fullscreenLoader) return;
        fullscreenLoader.classList.remove('active');
        setTimeout(() => { fullscreenLoader.style.display = 'none'; }, 500);
    };

});
/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : dashboard.js <<=== */
/* ===================================================================== */

/* ===================================================================== */
/* ===>> BLOCK JS 2: Supabase Session & Profile Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2A : Session Gatekeeper (Auth Check) --- */
/* --------------------------------------------------------------------- */
/**
 * checkUserSession: Ensure karta hai ki valid user hi dashboard par hai.
 * Rule: No access without RP_Temp_Email.
 */
async function checkUserSession() {
    window.showLoader('Verifying Identity...');

    // Session storage se email uthao (Jo verification.js ne set kiya tha)
    const activeEmail = sessionStorage.getItem('RP_Temp_Email');

    if (!activeEmail) {
        // Bina email ke entry mana hai
        window.location.href = '../1-login/login.html';
        return;
    }

    try {
        // Database se asli user profile fetch karo
        await fetchUserProfile(activeEmail);
    } catch (err) {
        console.error("Session Security Error:", err);
        window.showIsland("Identity verification failed.", "error");
        setTimeout(() => { window.location.href = '../1-login/login.html'; }, 2000);
    }
}

// System start immediately on load
document.addEventListener('DOMContentLoaded', () => {
    // Thoda sa delay taaki Block 1 ke helpers ready ho jayein
    setTimeout(checkUserSession, 100);
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2B : Database Profile Fetcher --- */
/* --------------------------------------------------------------------- */
/**
 * fetchUserProfile: Supabase 'users' table se user ka sara data nikalta hai.
 */
async function fetchUserProfile(email) {
    // Note: Humne column name 'personal_email' rakha hai
    const { data: user, error } = await _sb
        .from('users')
        .select('*')
        .eq('personal_email', email)
        .single();

    if (error || !user) {
        throw new Error("User record not found in system.");
    }

    // Global variable mein save karo taaki baki modules (card.js) use kar sakein
    window.currentUserData = user;

    // UI ko data se bharo
    populateDashboardUI(user);

    // Loader hatado aur success msg dikhao
    window.hideLoader();
    window.showIsland(`Secure Session Active`, `success`);
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2C : UI Sync & Population --- */
/* --------------------------------------------------------------------- */
/**
 * populateDashboardUI: Database se mile data ko screen par sahi jagah dikhata hai.
 */
function populateDashboardUI(data) {
    const userDisplayName = document.getElementById('user-display-name');
    const userAvatar      = document.getElementById('user-avatar-initial');
    
    // Naam ke liye email ka pehla hissa use karein agar profile name khali hai
    const nameToDisplay = data.personal_email.split('@')[0];
    const initial       = nameToDisplay.charAt(0).toUpperCase();

    if (userDisplayName) {
        userDisplayName.textContent = nameToDisplay;
        userDisplayName.style.textTransform = 'capitalize';
    }
    
    if (userAvatar) {
        userAvatar.textContent = initial;
    }

    console.log("Spatial Dashboard: UI Synchronized for", nameToDisplay);
}

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2C file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : dashboard.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 3: App Library, Weather Engine & System Controls <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Block 3A : App Library Registry & Grid Engine --- */
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

/**
 * loadAppGrid: App icons ko library section mein inject karta hai.
 */
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
            window.showIsland(`${app.name} module coming soon`, 'info');
        };
        
        appGrid.appendChild(appItem);
    });
}

// Data fetch hone ke baad apps ko load karein
setTimeout(loadAppGrid, 1000);

/* --------------------------------------------------------------------- */
/* --- End Block 3A file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Block 3B : Weather API (Spatial Geolocation) --- */
/* --------------------------------------------------------------------- */
/**
 * fetchWeather: Browser ki location se asli weather data nikalta hai.
 */
async function fetchWeather() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
        });

        const { latitude: lat, longitude: lon } = position.coords;

        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await res.json();
        
        const temp = Math.round(data.current_weather.temperature);
        
        if(document.getElementById('weather-temp')) document.getElementById('weather-temp').textContent = `${temp}°`;
        if(document.getElementById('weather-city')) document.getElementById('weather-city').textContent = 'My Location';
        if(document.getElementById('weather-desc')) document.getElementById('weather-desc').textContent = 'Live Spatial Update';

    } catch (error) {
        console.warn("Weather integration failed:", error);
        if(document.getElementById('weather-city')) document.getElementById('weather-city').textContent = 'Weather';
        if(document.getElementById('weather-desc')) document.getElementById('weather-desc').textContent = 'Location Permission Off';
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
        window.triggerHaptic();
        logoutActionSheet.classList.remove('active');
    };
}

if (confirmLogoutBtn) {
    confirmLogoutBtn.onclick = () => {
        window.triggerHaptic();
        window.showLoader('Ending Secure Session...');
        
        // Clear all session data
        sessionStorage.clear();
        
        setTimeout(() => {
            window.location.href = '../1-login/login.html';
        }, 1500);
    };
}

/* --------------------------------------------------------------------- */
/* --- End Block 3C file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Block 3D : Assistive Touch (Spatial Menu Control) --- */
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

// Global helper functions for Assistive Touch
window.refreshApp = () => {
    window.showLoader('Refreshing Identity Engine...');
    setTimeout(() => location.reload(), 1200);
};

window.navigate = (view) => {
    window.triggerHaptic();
    window.showIsland(`Opening ${view}...`, 'info');
    if (atMenuOverlay) atMenuOverlay.classList.remove('active');
};

// Menu ke bahar click karne par band karo
document.addEventListener('click', (e) => {
    if (atMenuOverlay && !atMenuOverlay.contains(e.target) && e.target !== atTrigger) {
        atMenuOverlay.classList.remove('active');
    }
});

/* --------------------------------------------------------------------- */
/* --- End Block 3D file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : dashboard.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 4: Sidebar Navigation & Full-Screen Controller <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Block 4A : Sidebar Navigation Engine --- */
/* --------------------------------------------------------------------- */
/**
 * Sidebar Navigation Logic:
 * Sidebar ke items par click karne par views switch karta hai.
 */
const navItems = document.querySelectorAll('.nav-item');
const homeView = document.getElementById('home-dashboard-view');
const pageTitle = document.getElementById('current-page-title');

navItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        window.triggerHaptic();

        // 1. Agar koi fullscreen app khuli hai to pehle use band karo
        const fsView = document.getElementById('app-fullscreen-view');
        if (fsView && fsView.classList.contains('active')) {
            closeApp();
        }

        // 2. Active State Toggle
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // 3. View Routing
        if (index === 0) { // Home View
            if (homeView) {
                homeView.style.display = 'block';
                requestAnimationFrame(() => homeView.classList.add('active'));
            }
            if (pageTitle) pageTitle.textContent = 'Home';
            window.showIsland("Navigated to Home", "info");
        } 
        else if (index === 1) { // Identity Card View
            openIdentityView();
            if (pageTitle) pageTitle.textContent = 'Identity';
        } 
        else if (index === 2) { // Devices Manager
            window.showIsland("Devices Manager coming soon", "info");
            // Wapis Home par focus le jao
            if (navItems[0]) navItems[0].click();
        }
    });
});

/* --------------------------------------------------------------------- */
/* --- End Block 4A file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Block 4B : Full-Screen App Controller (Spatial Logic) --- */
/* --------------------------------------------------------------------- */
/**
 * Full Screen Views:
 * Apps ya Identity Card ko side se slide karke fullscreen mein dikhata hai.
 */
const appFullscreenView = document.getElementById('app-fullscreen-view');
const appViewContent    = document.getElementById('app-view-content');
const appViewTitle      = document.getElementById('app-view-title');
const appBackBtn        = document.getElementById('app-back-btn');

function openIdentityView() {
    if (!appViewTitle || !appViewContent) return;
    
    appViewTitle.textContent = 'Digital Identity';
    
    // Identity Card Portal Injection
    appViewContent.innerHTML = `
        <div id="smart-id-card-portal">
            <div class="loader-container" style="padding: 100px; text-align: center;">
                <i class="fa-light fa-spinner-third fa-spin" style="font-size: 44px; color: var(--blue-accent);"></i>
                <p class="secondary-label" style="margin-top: 20px;">Constructing Spatial ID...</p>
            </div>
        </div>
    `;

    showFullScreen();

    // Agar Identity Card module functional hai, to use initialize karein
    if (typeof initCardModule === 'function') {
        initCardModule();
    }
}

function showFullScreen() {
    if (!appFullscreenView) return;
    appFullscreenView.style.display = 'flex';
    // Small delay for CSS transition to trigger correctly
    setTimeout(() => {
        appFullscreenView.classList.add('active');
    }, 10);
}

function closeApp() {
    if (!appFullscreenView) return;
    appFullscreenView.classList.remove('active');
    setTimeout(() => {
        appFullscreenView.style.display = 'none';
        if (appViewContent) appViewContent.innerHTML = '';
    }, 450); // Animation duration match
}

if (appBackBtn) {
    appBackBtn.onclick = () => {
        window.triggerHaptic();
        closeApp();
        // UI Sync: Wapis Home Nav active karo
        if (navItems[0]) navItems[0].classList.add('active');
        if (pageTitle) pageTitle.textContent = 'Home';
    };
}

/* --------------------------------------------------------------------- */
/* --- End Block 4B file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : dashboard.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 5: Module Bridge & Entrance Logic <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Block 5A : Identity Module Bridge --- */
/* --------------------------------------------------------------------- */
/**
 * initDashboardModules: Dashboard load hone ke baad baaki features 
 * (Identity Setup Popup wagera) ko check karta hai.
 */
function initDashboardModules() {
    console.log("Spatial Dashboard: Identity Modules Connected.");
    
    // Future Logic: Agar user ka 'rmail' database mein null hai, 
    // to yahan se 'Identity Setup' popup trigger hoga.
}

/* --------------------------------------------------------------------- */
/* --- Block 5B : Spatial Entrance Reveal (The Opening) --- */
/* --------------------------------------------------------------------- */
/**
 * revealDashboard: Securing loader ke baad dashboard ko ek smooth 
 * glass fade-in animation ke saath reveal karta hai.
 */
function revealDashboard() {
    // 1. Body ko loaded class do (Pre-load CSS transition trigger)
    document.body.classList.add('loaded');
    
    // 2. Main content area ko active class do (Spatial entry animation)
    const mainContent = document.getElementById('contentArea');
    if (mainContent) {
        mainContent.classList.add('active');
    }
    
    // 3. Baaki modules ko link karo
    initDashboardModules();
    
    console.log("Spatial Dashboard: Environment Revealed.");
}

// Jab saari files (CSS, Icons) load ho jayein, tab reveal karo
window.addEventListener('load', revealDashboard);

/* --------------------------------------------------------------------- */
/* --- End Block 5B file : dashboard.js --- */
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 5 file : dashboard.js <<=== */
/* ===================================================================== */