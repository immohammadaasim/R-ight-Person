/* ===================================================================== */
/* ===>> BLOCK JS 1: Identity Module Initialization & Session Sync <<=== */
/* ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1A : Security & Session Verification --- */
    /* --------------------------------------------------------------------- */
    const activeEmail = sessionStorage.getItem('RP_Temp_Email');

    if (!activeEmail) {
        console.error("Identity OS: No session found. Returning to login.");
        window.location.href = '../1-login/login.html';
        return;
    }

    // Loader ko hide karo jab sab load ho jaye
    if (typeof window.hideLoader === 'function') {
        setTimeout(window.hideLoader, 1000);
    }

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1B : Haptic Visual Engine --- */
    /* --------------------------------------------------------------------- */
    function triggerHaptic() {
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(10);
    }

    /* --------------------------------------------------------------------- */
    /* --- End Sub-Block 1B file : 4-identity/identity.js --- */ 
    /* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 4-identity/identity.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 2: Interactive UI Controls (Segmented Control) <<=== */
/* ===================================================================== */

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 2A : Gender Selector Logic (Segmented Control) --- */
    /* --------------------------------------------------------------------- */
    const genderButtons = document.querySelectorAll('.seg-btn');
    let selectedGender = "Male"; // Default

    genderButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            triggerHaptic();
            
            // UI Update: Active class switch
            genderButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            selectedGender = btn.getAttribute('data-value');
            console.log("Identity OS: Gender selected ->", selectedGender);
        });
    });

    /* --------------------------------------------------------------------- */
    /* --- End Sub-Block 2A file : 4-identity/identity.js --- */ 
    /* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 4-identity/identity.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 3: Identity Persistence Engine (Supabase Save) <<=== */
/* ===================================================================== */

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 3A : Form Validation & Submission --- */
    /* --------------------------------------------------------------------- */
    const saveBtn = document.getElementById('save-identity-day-1');

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            triggerHaptic();

            const fullName      = document.getElementById('id-full-name').value.trim();
            const dob           = document.getElementById('id-dob').value;
            const maritalStatus = document.getElementById('id-marital-status').value;

            // 1. Mandatory Check
            if (!fullName || !dob || !maritalStatus) {
                if (typeof showIsland === 'function') {
                    showIsland("Please fill all official fields.", "error");
                }
                return;
            }

            // 2. Database Sync (Supabase)
            if (typeof window.showLoader === 'function') window.showLoader("Securing Day 1 Identity...");

            try {
                const db = window._sb;
                const { error } = await db
                    .from('users')
                    .update({
                        verified_name: fullName,
                        dob: dob,
                        gender: selectedGender,
                        marital_status: maritalStatus,
                        identity_step: 1, // Progress marker
                        updated_at: new Date().toISOString()
                    })
                    .eq('login_email', activeEmail);

                if (error) throw error;

                // 3. Success Feedback
                if (typeof showIsland === 'function') {
                    showIsland("Day 1 Identity Secured!", "success");
                }

                // Transition to Dashboard after a small delay
                setTimeout(() => {
                    window.location.href = '../3-dashboard/dashboard.html';
                }, 2000);

            } catch (err) {
                console.error("Identity OS: Save failed ->", err);
                if (typeof showIsland === 'function') {
                    showIsland("Database sync failed. Try again.", "error");
                }
            } finally {
                if (typeof window.hideLoader === 'function') window.hideLoader();
            }
        });
    }

    /* --------------------------------------------------------------------- */
    /* --- End Sub-Block 3A file : 4-identity/identity.js --- */ 
    /* --------------------------------------------------------------------- */

}); // DOMContentLoaded End

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : 4-identity/identity.js <<=== */
/* ===================================================================== */