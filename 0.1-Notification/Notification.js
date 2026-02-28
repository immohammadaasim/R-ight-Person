/* ===================================================================== */
/* ===>> BLOCK JS 1: Universal Dynamic Island Logic Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1A : Elements Selection & Icon Library --- */
/* --------------------------------------------------------------------- */
/**
 * Notification UI Elements:
 * Global elements jo notch ko zinda karte hain.
 */
const islandContainer = document.getElementById('showIsland');
const islandMsg       = document.getElementById('island-message');
const islandIcon      = document.getElementById('island-icon');

// SF Symbol Vibe Icons (Thin & Premium SVGs)
const islandIcons = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    error:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    info:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
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
    if (!islandContainer || !islandMsg || !islandIcon) return;

    // 1. Content aur Type update karo
    islandMsg.textContent = msg;
    islandIcon.innerHTML = islandIcons[type] || islandIcons.info;
    
    // 2. Dynamic styling apply karo
    islandContainer.className = `dynamic-island-wrapper active ${type}`;

    // 3. Display Duration Logic (3.5 Seconds Rule)
    // Purana timer saaf karo agar koi pehle se chal raha ho
    clearTimeout(window.islandDismissTimer);
    
    window.islandDismissTimer = setTimeout(() => {
        islandContainer.classList.remove('active');
    }, 3500);

    console.log(`Notification: [${type.toUpperCase()}] ${msg}`);
}

// Function ko globally available banao taaki har page use kar sake
window.showIsland = showIsland;

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1B file : 0.1-Notification/Notification.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 0.1-Notification/Notification.js <<=== */
/* ===================================================================== */