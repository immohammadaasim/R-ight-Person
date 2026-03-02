/* ===================================================================== */
/* ===>> BLOCK JS 1: Universal Mobile PWA Engine (iOS & Android) <<=== */
/* ===================================================================== */

(function() {
    // 1. Inject Premium Spatial Capsule (If not already present)
    if (!document.getElementById('pwa-install-capsule')) {
        const pwaHTML = `
        <div id="pwa-install-capsule" class="install-capsule">
            <div class="capsule-content" id="pwa-trigger-btn">
                <div class="app-icon" style="background:#000; color:#FFF; font-weight:900;">R</div>
                <div class="text-content">
                    <span class="install-title">R-ight Person</span>
                    <span class="install-subtitle">Official Mobile App</span>
                </div>
                <button class="action-btn">Get</button>
            </div>
            <button id="pwa-dismiss-btn" class="close-capsule"><i class="fas fa-times"></i></button>
        </div>
        <style>
            .install-capsule {
                position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(120px);
                z-index: 999999; display: flex; align-items: center; gap: 12px;
                background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(25px);
                -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.4);
                box-shadow: 0 20px 60px rgba(0,0,0,0.25); padding: 10px 16px; border-radius: 100px;
                opacity: 0; transition: all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            }
            body.dark-mode .install-capsule { background: rgba(28, 28, 30, 0.9); border-color: rgba(255,255,255,0.1); }
            .install-capsule.visible { transform: translateX(-50%) translateY(0); opacity: 1; }
            .app-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
            .text-content { display: flex; flex-direction: column; margin-right: 12px; }
            .install-title { font-size: 0.95rem; font-weight: 700; color: #1c1c1e; }
            body.dark-mode .install-title { color: #FFF; }
            .install-subtitle { font-size: 0.75rem; color: #8e8e93; }
            .action-btn { background: #007AFF; color: #FFF; border: none; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
            .close-capsule { background: none; border: none; color: #8e8e93; font-size: 1.1rem; cursor: pointer; margin-left: 5px; }
        </style>`;
        document.body.insertAdjacentHTML('beforeend', pwaHTML);
    }

    // 2. Logic Controller
    let deferredPrompt;
    const capsule = document.getElementById('pwa-install-capsule');
    const trigger = document.getElementById('pwa-trigger-btn');
    const dismiss = document.getElementById('pwa-dismiss-btn');

    // Device Detection
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    // RULE: Already installed toh kuch mat dikhao
    if (isStandalone) return;

    // Function to show capsule
    function revealCapsule() {
        if (capsule) capsule.classList.add('visible');
    }

    // ANDROID: Capture beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        setTimeout(revealCapsule, 3000);
    });

    // IPHONE: Show capsule after delay (since they don't fire prompt event)
    if (isiOS) {
        setTimeout(revealCapsule, 4000);
    }

    // Click Handler: "Get" Action
    if (trigger) {
        trigger.addEventListener('click', async () => {
            if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();

            if (deferredPrompt) {
                // Trigger Native Android/Desktop Prompt
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                if (outcome === 'accepted') capsule.classList.remove('visible');
            } else if (isiOS) {
                // iPhone Instructions via Island
                if (typeof showIsland === 'function') {
                    showIsland("Tap 'Share' then 'Add to Home Screen' +", "info");
                } else {
                    alert("On iPhone: Tap 'Share' button and select 'Add to Home Screen'");
                }
            } else {
                // Fallback (e.g. Browser already dismissed prompt)
                if (typeof showIsland === 'function') {
                    showIsland("Look for 'Install App' in browser menu", "info");
                }
            }
        });
    }

    // Dismiss Logic
    if (dismiss) {
        dismiss.addEventListener('click', () => {
            capsule.classList.remove('visible');
        });
    }

})();

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 0.2-Install/Install.js <<=== */
/* ===================================================================== */