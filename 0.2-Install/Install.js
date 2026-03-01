/* ===================================================================== */
/* ===>> BLOCK JS 1: Universal PWA Install Engine (Safe Mode) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1A : Event Listeners & State Management --- */
/* --------------------------------------------------------------------- */
// Global Variable Protection
if (typeof window.deferredPrompt === 'undefined') {
    window.deferredPrompt = null;
}

const pwaCapsule = document.getElementById('pwa-install-capsule');
const pwaTrigger = document.getElementById('pwa-trigger-btn');
const pwaDismiss = document.getElementById('pwa-dismiss-btn');

/**
 * beforeinstallprompt:
 * Capture native prompt silently.
 */
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    
    // Show capsule after delay
    setTimeout(showPWACapsule, 2000);
});

// TEST MODE: Uncomment this line to force show button for testing
setTimeout(showPWACapsule, 3000);

function showPWACapsule() {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    if (pwaCapsule) {
        pwaCapsule.style.display = 'flex';
        // Small delay for CSS transition
        setTimeout(() => {
            pwaCapsule.classList.add('visible');
        }, 100);
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1B : Install Execution Logic --- */
/* --------------------------------------------------------------------- */
if (pwaTrigger) {
    pwaTrigger.addEventListener('click', async () => {
        if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();

        if (window.deferredPrompt) {
            // Android/Desktop Native Install
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;
            console.log(`Install choice: ${outcome}`);
            window.deferredPrompt = null;
            hidePWACapsule();
        } else {
            // iOS / Manual Instructions
            if (typeof showIsland === 'function') {
                showIsland("Tap 'Share' -> 'Add to Home Screen'", "info");
            } else {
                alert("To install: Tap Share -> Add to Home Screen");
            }
        }
    });
}

// Dismiss Logic
if (pwaDismiss) {
    pwaDismiss.addEventListener('click', hidePWACapsule);
}

function hidePWACapsule() {
    if (pwaCapsule) {
        pwaCapsule.classList.remove('visible');
        setTimeout(() => {
            pwaCapsule.style.display = 'none';
        }, 600); // Wait for transition
    }
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1C : Logo Fallback Logic --- */
/* --------------------------------------------------------------------- */
const appLogoImg = document.querySelector('.app-icon img');
if (appLogoImg) {
    appLogoImg.onerror = function() {
        this.style.display = 'none';
        const icon = document.querySelector('.fallback-icon');
        if (icon) icon.style.display = 'block';
    };
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1C file : 0.2-Install/Install.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 0.2-Install/Install.js <<=== */
/* ===================================================================== */