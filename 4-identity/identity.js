/* ===================================================================== */
/* ===>> BLOCK JS 1: Identity OS Engine & Navigation Controller <<=== */
/* ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1A : OS Initialization & Security Guard --- */
    /* --------------------------------------------------------------------- */
    const activeEmail = sessionStorage.getItem('RP_Temp_Email');
    
    // Rule: Bina active session ke entry mana hai
    if (!activeEmail) {
        window.location.href = '../1-login/login.html';
        return;
    }

    // Loader controls for smooth arrival
    if (typeof window.hideLoader === 'function') {
        setTimeout(window.hideLoader, 1000);
    }

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1B : Zero-Jerk Navigation Engine --- */
    /* --------------------------------------------------------------------- */
    /**
     * navigateToStep: 
     * Ek card ko fade-out karta hai aur dusre ko Spatial animation ke sath
     * screen par "Arrive" karwata hai.
     */
    function navigateToStep(targetStep) {
        const currentCard = document.querySelector('.identity-card.active');
        const nextCard    = document.getElementById(`identity-day-${targetStep}`);

        if (currentCard && nextCard) {
            // Step 1: Current card exit animation
            currentCard.style.opacity = '0';
            currentCard.style.transform = 'translateY(-30px) scale(0.95)';
            
            setTimeout(() => {
                currentCard.classList.remove('active');
                currentCard.style.display = 'none';

                // Step 2: Next card entry animation
                nextCard.style.display = 'block';
                setTimeout(() => {
                    nextCard.classList.add('active');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 50);
            }, 600);
        }
    }

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 1C : Haptic Feedback Engine --- */
    /* --------------------------------------------------------------------- */
    function triggerHaptic() {
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    }

    /* --------------------------------------------------------------------- */
    /* --- End Sub-Block 1C file : 4-identity/identity.js --- */ 
    /* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 4-identity/identity.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 2: UI Interactive Components & Field Logic <<=== */
/* ===================================================================== */

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 2A : iPad Segmented Control (Gender) --- */
    /* --------------------------------------------------------------------- */
    const genderBtns = document.querySelectorAll('.seg-btn');
    let selectedGender = "Male"; // Default

    genderBtns.forEach(btn => {
        btn.onclick = () => {
            triggerHaptic();
            genderBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedGender = btn.getAttribute('data-value');
            console.log("Identity OS: Gender updated ->", selectedGender);
        };
    });

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 2B : Form Field Real-time Validation --- */
    /* --------------------------------------------------------------------- */
    // Placeholder for future field masks (e.g. Phone/Pincode validation)

    /* --------------------------------------------------------------------- */
    /* --- End Sub-Block 2B file : 4-identity/identity.js --- */ 
    /* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 4-identity/identity.js <<=== */
/* ===================================================================== */


/* ===================================================================== */
/* ===>> BLOCK JS 3: Identity Persistence Engine (Supabase Sync) <<=== */
/* ===================================================================== */

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 3A : Day 1 Save Logic (The Roots) --- */
    /* --------------------------------------------------------------------- */
    const saveBtn1 = document.getElementById('save-day-1');

    if (saveBtn1) {
        saveBtn1.onclick = async () => {
            triggerHaptic();
            
            const fullName = document.getElementById('id-full-name').value.trim();
            const dob      = document.getElementById('id-dob').value;
            const marital  = document.getElementById('id-marital-status').value;

            // Rule: Mandatory fields check
            if (!fullName || !dob || !marital) {
                if (typeof showIsland === 'function') showIsland("Please fill all official roots.", "error");
                return;
            }

            if (typeof window.showLoader === 'function') window.showLoader("Securing Basic Identity...");

            try {
                const { error } = await window._sb
                    .from('users')
                    .update({
                        verified_name: fullName,
                        dob: dob,
                        gender: selectedGender,
                        marital_status: marital,
                        identity_step: 1,
                        updated_at: new Date().toISOString()
                    })
                    .eq('login_email', activeEmail);

                if (error) throw error;

                if (typeof showIsland === 'function') showIsland("Day 1 Identity Secured!", "success");
                
                // Transition to Day 2
                navigateToStep(2);

            } catch (err) {
                console.error("OS Error:", err);
                if (typeof showIsland === 'function') showIsland("Sync failed. Check connection.", "error");
            } finally {
                if (typeof window.hideLoader === 'function') window.hideLoader();
            }
        };
    }

    /* --------------------------------------------------------------------- */
    /* --- Sub-Block 3B : Day 2 Save Logic (Contact & Roots) --- */
    /* --------------------------------------------------------------------- */
    const saveBtn2 = document.getElementById('save-day-2');

    if (saveBtn2) {
        saveBtn2.onclick = async () => {
            triggerHaptic();

            const address    = document.getElementById('id-address').value.trim();
            const pincode    = document.getElementById('id-pincode').value.trim();
            const emerName   = document.getElementById('id-emergency-name').value.trim();
            const emerPhone  = document.getElementById('id-emergency-phone').value.trim();

            if (!address || !pincode || !emerName || !emerPhone) {
                if (typeof showIsland === 'function') showIsland("Contact details are mandatory.", "error");
                return;
            }

            if (typeof window.showLoader === 'function') window.showLoader("Securing Geographical Roots...");

            try {
                // Address aur Emergency data ko objects mein convert karke save kar sakte hain
                const { error } = await window._sb
                    .from('users')
                    .update({
                        current_address: address,
                        pincode: pincode,
                        emergency_contact: `${emerName} (${emerPhone})`,
                        identity_step: 2,
                        updated_at: new Date().toISOString()
                    })
                    .eq('login_email', activeEmail);

                if (error) throw error;

                if (typeof showIsland === 'function') showIsland("Day 2 Identity Secured!", "success");
                
                // Final Step for now: Return to Dashboard
                setTimeout(() => {
                    window.location.href = '../3-dashboard/dashboard.html';
                }, 1500);

            } catch (err) {
                console.error("OS Error:", err);
                if (typeof showIsland === 'function') showIsland("Sync failed. Check connection.", "error");
            } finally {
                if (typeof window.hideLoader === 'function') window.hideLoader();
            }
        };
    }

    /* --------------------------------------------------------------------- */
    /* --- End Sub-Block 3B file : 4-identity/identity.js --- */ 
    /* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : 4-identity/identity.js <<=== */
/* ===================================================================== */

}); // Closure End