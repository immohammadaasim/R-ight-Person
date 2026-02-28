/* ===================================================================== */
/* ===>> BLOCK JS 1: Universal Dynamic Island Logic Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1A : Elements Selection & Icon Library (SF Vibe) --- */
/* --------------------------------------------------------------------- */
/**
 * Notification UI Elements:
 * Global elements jo notch ko zinda karte hain.
 */
const islandContainer = document.getElementById('showIsland');
const islandMsg       = document.getElementById('island-message');
const islandIcon      = document.getElementById('island-icon');

/**
 * SF Symbol Vibe Icons:
 * Thin, premium aur elegant SVGs. 
 * 'stroke="currentColor"' ensures color sync with CSS status classes.
 */
const islandIcons = {
    success: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    error:   `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    info:    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
};
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1A file : 0.1-Notification/Notification.js --- */ 
/* --------------------------------------------------------------------- */



/* --------------------------------------------------------------------- */
/* --- Sub-Block 1B : showIsland Function (The Notification Hub) --- */
/* --------------------------------------------------------------------- */
/**
 * showIsland: Har page se alerts ko handle karne wala universal function.
 * @param {string} msg - User ko dikhane wala sandesh.
 * @param {string} type - Alert ka prakar ('success', 'error', 'info').
 */
function showIsland(msg, type = 'info') {
    // 1. Safety Check: Agar elements nahi milte toh function rok do
    if (!islandContainer || !islandMsg || !islandIcon) {
        console.warn("System: Notification elements not found on this page.");
        return;
    }

    // 2. Content aur Icon Injection: SF Symbol library se icon uthao
    islandMsg.textContent = msg;
    islandIcon.innerHTML = islandIcons[type] || islandIcons.info;
    
    /**
     * 3. Appearance Sync: 
     * Base wrapper class ko maintain karte huye active aur type classes lagao.
     * Isse centering (left:50%) kabhi kharab nahi hogi.
     */
    islandContainer.className = `dynamic-island-wrapper active ${type}`;

    // 4. Persistence Logic: 3.5 Seconds Dismiss Rule
    // Purane timer ko saaf karo taaki naya notification poora dikhe
    if (window.islandDismissTimer) {
        clearTimeout(window.islandDismissTimer);
    }
    
    window.islandDismissTimer = setTimeout(() => {
        islandContainer.classList.remove('active');
    }, 3500);

    // Debug Log for System Monitoring
    console.log(`Island Alert: [${type.toUpperCase()}] ${msg}`);
}

// Global Export: Taaki har module is function ko awaz de sake
window.showIsland = showIsland;

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1B file : 0.1-Notification/Notification.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 0.1-Notification/Notification.js <<=== */
/* ===================================================================== */