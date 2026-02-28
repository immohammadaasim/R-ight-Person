/* ===================================================================== */
/* ===>> BLOCK JS 1: Universal Theme Synchronization Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1A : Theme Persistence & Initial Setup --- */
/* --------------------------------------------------------------------- */
/**
 * initGlobalTheme: Page load hote hi user ki purani pasand (Saved Theme) 
 * ko dhoondta hai aur use system par apply karta hai.
 */
function initGlobalTheme() {
    const savedTheme = localStorage.getItem('RP_System_Theme') || 'light';
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    } else {
        body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
    }
    
    console.log(`Modular Engine: Theme synchronized to ${savedTheme.toUpperCase()}`);
}

// System ko turant zinda karo
document.addEventListener('DOMContentLoaded', initGlobalTheme);

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1A file : 0-Theme/Theme.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1B : Theme Toggle Logic & Visual Feedback --- */
/* --------------------------------------------------------------------- */
/**
 * toggleAppearance: User ki click par theme switch karta hai aur
 * use hamesha ke liye yaad rakhta hai.
 */
const themeBtn = document.getElementById('global-theme-toggle');

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        // 1. Haptic Visual Feedback (If helper exists)
        if (typeof triggerHapticFeedback === 'function') {
            triggerHapticFeedback();
        }

        // 2. Switch Logic
        const body = document.body;
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        
        // 3. Update Icon & Local Storage
        const themeIcon = document.getElementById('theme-icon');
        if (isDark) {
            localStorage.setItem('RP_System_Theme', 'dark');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            if (typeof showIsland === 'function') showIsland("Dark Appearance Active", "info");
        } else {
            localStorage.setItem('RP_System_Theme', 'light');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            if (typeof showIsland === 'function') showIsland("Light Appearance Active", "info");
        }
    });
}

/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1B file : 0-Theme/Theme.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 0-Theme/Theme.js <<=== */
/* ===================================================================== */