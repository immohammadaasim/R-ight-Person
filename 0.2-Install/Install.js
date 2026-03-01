/* ===================================================================== */
/* ===>> BLOCK JS 1: Universal PWA Injector & Engine <<=== */
/* ===================================================================== */

(function() {
    // 1. Inject HTML & CSS Programmatically (No fetch needed)
    const pwaHTML = `
    <div id="pwa-install-capsule" class="install-capsule">
        <div class="capsule-content" id="pwa-trigger-btn">
            <div class="app-icon">
                <i class="fas fa-download" style="font-size:1.2rem;"></i>
            </div>
            <div class="text-content">
                <span class="install-title">Install App</span>
                <span class="install-subtitle">Add to Home Screen</span>
            </div>
            <button class="action-btn">Get</button>
        </div>
        <button id="pwa-dismiss-btn" class="close-capsule"><i class="fas fa-times"></i></button>
    </div>
    <style>
        .install-capsule {
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(100px);
            z-index: 999999; display: flex; align-items: center; gap: 12px;
            background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.5);
            box-shadow: 0 20px 60px rgba(0,0,0,0.2); padding: 8px 14px; border-radius: 100px;
            opacity: 0; transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-family: -apple-system, sans-serif; visibility: hidden;
        }
        body.dark-mode .install-capsule { background: rgba(30, 30, 30, 0.9); border-color: rgba(255,255,255,0.1); }
        .install-capsule.visible { transform: translateX(-50%) translateY(0); opacity: 1; visibility: visible; }
        .app-icon { width: 40px; height: 40px; background: #007AFF; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; }
        .text-content { display: flex; flex-direction: column; margin-right: 10px; }
        .install-title { font-size: 0.9rem; font-weight: 700; color: #000; }
        body.dark-mode .install-title { color: #FFF; }
        .install-subtitle { font-size: 0.7rem; color: #888; }
        .action-btn { background: rgba(0,122,255,0.1); color: #007AFF; border: none; padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; cursor: pointer; }
        .close-capsule { background: none; border: none; color: #999; font-size: 1.1rem; cursor: pointer; margin-left: 5px; }
    </style>`;

    // Insert into DOM
    document.body.insertAdjacentHTML('beforeend', pwaHTML);

    // 2. Logic Engine
    let deferredPrompt;
    const capsule = document.getElementById('pwa-install-capsule');
    const trigger = document.getElementById('pwa-trigger-btn');
    const dismiss = document.getElementById('pwa-dismiss-btn');

    // Check if already standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    function showCapsule() {
        if(capsule) capsule.classList.add('visible');
    }

    // Capture Native Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        setTimeout(showCapsule, 2000);
    });

    // Force Show for Testing (Browser prompt na bhi ho toh dikhega)
    setTimeout(showCapsule, 3000);

    // Click Handler
    if (trigger) {
        trigger.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                capsule.classList.remove('visible');
            } else {
                alert("To install: Tap Share -> Add to Home Screen");
            }
        });
    }

    if (dismiss) {
        dismiss.addEventListener('click', () => {
            capsule.classList.remove('visible');
        });
    }

})();

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 0.2-Install/Install.js <<=== */
/* ===================================================================== */