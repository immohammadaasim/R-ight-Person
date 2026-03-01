/* ===================================================================== */
/* ===>> BLOCK JS 1: Universal PWA Install Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1A : Event Listeners & State Management --- */
/* --------------------------------------------------------------------- */
let deferredPrompt; // Browser ka native prompt store karne ke liye
const pwaCapsule = document.getElementById('pwa-install-capsule');
const pwaTrigger = document.getElementById('pwa-trigger-btn');
const pwaDismiss = document.getElementById('pwa-dismiss-btn');

/**
 * beforeinstallprompt:
 * Ye event tab fire hota hai jab browser ko lagta hai ki app install ho sakti hai.
 */
window.addEventListener('beforeinstallprompt', (e) => {
    // 1. Native prompt ko roko (Hum apna custom capsule dikhayenge)
    e.preventDefault();
    deferredPrompt = e;

    // 2. Capsule ko dikhao (Delay taaki user pehle page dekh le)
    setTimeout(() => {
        if (pwaCapsule) pwaCapsule.classList.add('visible');
    }, 3000);
});

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1B : Install Execution Logic --- */
/* --------------------------------------------------------------------- */
if (pwaTrigger) {
    pwaTrigger.addEventListener('click', async () => {
        if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();

        if (deferredPrompt) {
            // Android/Desktop: Native prompt dikhao
            deferredPrompt.prompt();
            
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            
            // Ek baar use hone par prompt bekar ho jata hai
            deferredPrompt = null;
            pwaCapsule.classList.remove('visible');
        } else {
            // iOS Fallback: Instruction dikhao
            if (typeof showIsland === 'function') {
                showIsland("Tap 'Share' then 'Add to Home Screen' +", "info");
            } else {
                alert("Tap Share icon and select 'Add to Home Screen'");
            }
        }
    });
}

// Dismiss Logic: User ne cross dabaya
if (pwaDismiss) {
    pwaDismiss.addEventListener('click', () => {
        if (pwaCapsule) pwaCapsule.classList.remove('visible');
    });
}

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1C : Standalone Mode Check (Already Installed?) --- */
/* --------------------------------------------------------------------- */
/**
 * Check karta hai ki kya user pehle se App Mode mein hai.
 */
window.addEventListener('DOMContentLoaded', () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    if (isStandalone) {
        console.log("System: App is running in Standalone Mode.");
        // Agar app mein hai toh capsule kabhi mat dikhao
        if (pwaCapsule) pwaCapsule.style.display = 'none';
    }
});
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1C file : 0.2-Install/Install.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 0.2-Install/Install.js <<=== */
/* ===================================================================== */