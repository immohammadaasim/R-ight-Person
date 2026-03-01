/* ===================================================================== */
/* ===>> BLOCK JS 1: Initialization & Verification UI Engine <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1A : Supabase Client & Connection Setup --- */
/* --------------------------------------------------------------------- */
/**
 * Supabase Engine:
 * Hamare database se link karne wala main bridge.
 */
const SB_URL = "https://xtzdlepgpqvllwzjfrsh.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0emRsZXBncHF2bGx3empmcnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTI2MzcsImV4cCI6MjA4NzU2ODYzN30.NxX8BPCK_HNQYmn0-7YkdPv12gO8wKgOS5oP2R0OYZc";

// Initialize Supabase for this identity module
const _sb = supabase.createClient(SB_URL, SB_KEY);
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1A file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1B : DOM Element Selection (Verification) --- */
/* --------------------------------------------------------------------- */
// Gateway Views
const selectionView = document.getElementById('selection-view');
const keyInputView = document.getElementById('key-input-view');
const shiftGuardView = document.getElementById('shift-guard-view');

// Path Selection Cards
const pathTelegram = document.getElementById('path-telegram');
const pathEmail = document.getElementById('path-email');
const pathWhatsapp = document.getElementById('path-whatsapp');

// Interaction Elements
const verifyKeyBtn = document.getElementById('verify-key-btn');
const resendKeyBtn = document.getElementById('resend-key-btn');
const goBackBtn = document.getElementById('go-back-entry');
const changePathBtn = document.getElementById('back-to-selection');
const keyBoxes = document.querySelectorAll('.key-box');
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1B file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1C : UI Feedback Helpers (The Island Sync) --- */
/* --------------------------------------------------------------------- */
/**
 * triggerHaptic: 
 * User ko physical feedback dene wala function. 
 * Rule: 10ms vibration for touch reality.
 */
function triggerHaptic() {
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(10);
    console.log("System: Haptic visual triggered.");
}

/**
 * NOTE: 'showIsland' function ab global Notification.js se liya jayega.
 * Local function ko delete kar diya gaya hai modularity maintain karne ke liye.
 */
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1C file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1D : View Controller (Zero-Jerk Transition) --- */
/* --------------------------------------------------------------------- */
/**
 * switchView: 
 * Ek portal se dusre portal par makkhan jaisa smooth arrival.
 * Rule: 0.4s delay for opacity/transform sync.
 */
function switchView(show, hide) {
    if (!show || !hide) return;
    
    // Purane view ko fade-out karo
    hide.classList.remove('active');
    
    setTimeout(() => {
        hide.style.display = 'none';
        show.style.display = 'block';
        
        // Halka sa delay taaki browser transition ko register kare
        setTimeout(() => {
            show.classList.add('active');
        }, 50);
    }, 400);
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1D file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 1E : Identity Gatekeeper (Security Sync) --- */
/* --------------------------------------------------------------------- */
/**
 * checkSessionIntegrity: 
 * Ensure karta hai ki user login.html se hi verify karke aaya hai.
 */
function checkSessionIntegrity() {
    const tempEmail = sessionStorage.getItem('RP_Temp_Email');
    const tempPhone = sessionStorage.getItem('RP_Temp_Phone');

    if (!tempEmail || !tempPhone) {
        // Bina data ke entry blocked
        window.location.href = '../1-login/login.html';
    } else {
        if (typeof showIsland === 'function') {
            showIsland("Select your Identity Path", "info");
        }
    }
}

// System ko turant activate karo
document.addEventListener('DOMContentLoaded', checkSessionIntegrity);
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 1E file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 1 file : 2-verification/Verification.js <<=== */
/* ===================================================================== */

/* ===================================================================== */
/* ===>> BLOCK JS 2: Path Selection & Telegram Deep Link Logic <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2A : Path Selection Listeners (Identity Entry Points) --- */
/* --------------------------------------------------------------------- */
/**
 * Path Listeners:
 * User ko rasta chunne ki ijazat dete hain. 
 * Filhal sirf Telegram active hai, baaki "Coming Soon" status par hain.
 */
if (pathTelegram) {
    pathTelegram.addEventListener('click', () => {
        triggerHaptic();
        initiateTelegramFlow();
    });
}

if (pathEmail) {
    pathEmail.addEventListener('click', () => {
        triggerHaptic();
        if (typeof showIsland === 'function') showIsland("iMail Path is coming soon ($1.00 fee).", "info");
    });
}

if (pathWhatsapp) {
    pathWhatsapp.addEventListener('click', () => {
        triggerHaptic();
        if (typeof showIsland === 'function') showIsland("WhatsApp Premium is coming soon ($2.00 fee).", "info");
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2A file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2B : Telegram Flow Initiator (Hex-Secure Engine) --- */
/* --------------------------------------------------------------------- */
/**
 * initiateTelegramFlow: 
 * Phone number ko Hex mein badal kar secure deep link banata hai.
 * Rule: 'tg://' protocol use hota hai browser blocking bypass karne ke liye.
 */
function initiateTelegramFlow() {
    const phone = sessionStorage.getItem('RP_Temp_Phone'); // Representing login_mobile
    const countryCode = sessionStorage.getItem('RP_Country_Code') || '+91';

    if (!phone) {
        if (typeof showIsland === 'function') showIsland("Session expired. Please login again.", "error");
        setTimeout(() => { window.location.href = '../1-login/login.html'; }, 2000);
        return;
    }

    const fullPhoneRaw = countryCode + phone;
    const cleanNumber = fullPhoneRaw.replace(/\D/g, ''); 

    // God-Level Hexadecimal Encoding
    const toHex = (str) => {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += str.charCodeAt(i).toString(16);
        }
        return result;
    };

    const hexEncodedParam = toHex(cleanNumber);

    // BYPASS FIX: Direct Telegram App Link
    const botUsername = "Rightpersonverification_bot";
    const deepLink = `tg://resolve?domain=${botUsername}&start=${hexEncodedParam}`;
    const fallbackLink = `https://t.me/${botUsername}?start=${hexEncodedParam}`;

    showTelegramOpenButton(deepLink, fullPhoneRaw);
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2B file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2C : Telegram Open Button UI & Smart Link Logic --- */
/* --------------------------------------------------------------------- */
/**
 * showTelegramOpenButton: 
 * Smart logic: Pehle App kholne ki koshish karta hai, fail hone par Web.
 */
function showTelegramOpenButton(deepLink, displayPhone) {
    if (document.getElementById('telegram-open-wrapper')) return;

    const selectionList = document.querySelector('.selection-list');
    const wrapper = document.createElement('div');
    wrapper.id = 'telegram-open-wrapper';
    wrapper.style.cssText = `
        margin-top: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 12px;
        animation: spatialArrival 0.5s var(--spring-ease) forwards;
    `;

    // Fallback Web Link creation
    const webLink = deepLink.replace('tg://resolve?domain=', 'https://t.me/');

    wrapper.innerHTML = `
        <div style="background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.15); border-radius:18px; padding:1rem; font-size:0.85rem; color:var(--blue-accent); line-height:1.6;">
            📱 Mobile: <b>${displayPhone}</b><br>
            Tap below → Open Telegram → Press <b>START</b> → Key arrives instantly!
        </div>

        <a id="open-telegram-btn" href="#" class="ios-primary-btn" style="text-decoration:none; background:var(--telegram-blue);">
            <i class="fab fa-telegram-plane" style="margin-right:10px;"></i> Open Telegram
        </a>

        <button id="already-got-key-btn" class="ios-secondary-btn">I have my Key → Enter it</button>
    `;

    selectionList.after(wrapper);

    // Smart Link Listener
    document.getElementById('open-telegram-btn').addEventListener('click', (e) => {
        e.preventDefault();
        triggerHaptic();
        if (typeof showIsland === 'function') showIsland("Opening Telegram...", "info");

        // Strategy 1: Try Direct App (No new tab)
        window.location.href = deepLink;

        // Strategy 2: If app fails, open Web in new tab after 1s
        setTimeout(() => {
            if (document.hidden) return; // App opened successfully
            window.open(webLink, '_blank');
        }, 1500);
        
        // Auto-switch view hint
        setTimeout(() => {
            if (typeof showIsland === 'function') showIsland("Got your key? Tap 'I have my Key'", "info");
        }, 4000);
    });

    // Manual Switch Listener
    document.getElementById('already-got-key-btn').addEventListener('click', () => {
        triggerHaptic();
        const targetLabel = document.getElementById('target-identity');
        if (targetLabel) targetLabel.textContent = 'Telegram';
        switchView(keyInputView, selectionView);
        
        if (typeof startOTPTimer === 'function') startOTPTimer();
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2C file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 2D : Navigation Helpers (Back Rules) --- */
/* --------------------------------------------------------------------- */
/**
 * Navigation Listeners:
 * User ko wapas piche jaane aur path badalne ki suvidha dete hain.
 */
if (goBackBtn) {
    goBackBtn.addEventListener('click', () => {
        triggerHaptic();
        window.location.href = '../1-login/login.html';
    });
}

if (changePathBtn) {
    changePathBtn.addEventListener('click', () => {
        triggerHaptic();
        const wrapper = document.getElementById('telegram-open-wrapper');
        if (wrapper) wrapper.remove();
        switchView(selectionView, keyInputView);
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 2D file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 2 file : 2-verification/Verification.js <<=== */
/* ===================================================================== */



/* ===================================================================== */
/* ===>> BLOCK JS 3: Access -R- Key Passcode Logic & Verification <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3A : Auto-Focus Input Behavior (Passcode Rule) --- */
/* --------------------------------------------------------------------- */
/**
 * keyBoxes: 
 * 6-digit boxes ka smart behavior handle karta hai.
 * Rule: Auto-advance on input, Backspace recovery, and 6-digit Paste support.
 */
if (keyBoxes) {
    keyBoxes.forEach((box, index) => {
        // Sirf numbers allow karo aur auto-focus aage bhejo
        box.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            if (e.target.value.length === 1 && index < keyBoxes.length - 1) {
                keyBoxes[index + 1].focus();
            }
        });

        // Backspace dabane par piche wale box me jao
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && index > 0) {
                keyBoxes[index - 1].focus();
            }
        });

        // Paste support: Jab user poora 6-digit code paste kare
        box.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
            if (pastedData.length === 6) {
                keyBoxes.forEach((b, i) => { b.value = pastedData[i] || ''; });
                keyBoxes[5].focus();
            }
        });
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 3A file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* —-- Function#2 BLOCK JS 3B: Verify Identity Execution —-- */
/* --------------------------------------------------------------------- */
/**
 * verifyKeyBtn: 
 * Supabase 'otp_store' table se OTP match karke identity confirm karta hai.
 * UPDATE: Ab 'login_mobile' column ka use ho raha hai (Sync with Block 103).
 */
if (verifyKeyBtn) {
    verifyKeyBtn.addEventListener('click', async () => {
        triggerHaptic();

        // 1. Boxes se poora code nikaalo
        let enteredOTP = "";
        keyBoxes.forEach(box => enteredOTP += box.value);

        if (enteredOTP.length < 6) {
            if (typeof showIsland === 'function') showIsland("Please enter the full 6-digit key.", "error");
            return;
        }

        const phone = sessionStorage.getItem('RP_Temp_Phone');
        const countryCode = sessionStorage.getItem('RP_Country_Code') || '+91';
        const fullPhone = (countryCode + phone).replace(/\s/g, '');

        if (!phone) {
            if (typeof showIsland === 'function') showIsland("Session expired. Please re-login.", "error");
            setTimeout(() => { window.location.href = '../1-login/login.html'; }, 2000);
            return;
        }

        // UI Loading State
        verifyKeyBtn.disabled = true;
        const btnText = verifyKeyBtn.querySelector('.btn-text');
        const btnLoader = verifyKeyBtn.querySelector('.btn-loader');
        if (btnText) btnText.style.opacity = '0';
        if (btnLoader) btnLoader.style.display = 'block';

        try {
            // 2. Database Lookup: 'login_mobile' column se search karo
            const { data: otpRecord, error } = await _sb
                .from('otp_store')
                .select('otp, expires_at')
                .eq('login_mobile', fullPhone) 
                .maybeSingle();

            if (error || !otpRecord) {
                throw new Error('Key not found. Please request a new code.');
            }

            // 3. Expiry Check
            const now = new Date();
            const expiry = new Date(otpRecord.expires_at);
            if (now > expiry) {
                throw new Error('Verification Key expired.');
            }

            // 4. OTP Match Check
            if (enteredOTP !== otpRecord.otp) {
                throw new Error('Invalid Key. Access Denied.');
            }

            // 5. Match Success!
            if (typeof showIsland === 'function') showIsland("Identity Confirmed!", "success");

            // Execute Final Identity Bridge (Sub-Block 4A)
            await handleIdentitySuccess();

        } catch (err) {
            console.error("Verification Guard Error:", err.message);
            if (typeof showIsland === 'function') showIsland(err.message, "error");

            // Reset UI for retry
            keyBoxes.forEach(box => box.value = "");
            if (keyBoxes[0]) keyBoxes[0].focus();

            verifyKeyBtn.disabled = false;
            if (btnText) btnText.style.opacity = '1';
            if (btnLoader) btnLoader.style.display = 'none';
        }
    });
}
/* --------------------------------------------------------------------- */
/* —-- Function#2 END OF BLOCK JS 3B: file : 2-verification/Verification.js —-- */
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 3C : Countdown Timer & Resend Logic --- */
/* --------------------------------------------------------------------- */
let otpTimer;

/**
 * startOTPTimer: 
 * 2 minute ka countdown timer jo resend button ko control karta hai.
 */
function startOTPTimer() {
    let timeLeft = 120; // 2 Minutes
    const timerDisplay = document.getElementById('resend-timer');
    if (!timerDisplay || !resendKeyBtn) return;

    resendKeyBtn.disabled = true;

    clearInterval(otpTimer);
    otpTimer = setInterval(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if (timeLeft <= 0) {
            clearInterval(otpTimer);
            resendKeyBtn.disabled = false;
            timerDisplay.textContent = "0:00";
            if (typeof showIsland === 'function') showIsland("You can now request a new key.", "info");
        }
        timeLeft--;
    }, 1000);
}

// Resend Button Click Listener
if (resendKeyBtn) {
    resendKeyBtn.addEventListener('click', () => {
        triggerHaptic();
        
        // Form Reset
        keyBoxes.forEach(box => box.value = "");
        if (keyBoxes[0]) keyBoxes[0].focus();

        // Wapas selection par bhejo taaki user naya flow start kare
        const wrapper = document.getElementById('telegram-open-wrapper');
        if (wrapper) wrapper.remove();
        switchView(selectionView, keyInputView);

        if (typeof showIsland === 'function') showIsland("Tap Telegram to get a new key.", "info");
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 3C file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 3 file : 2-verification/Verification.js <<=== */
/* ===================================================================== */




/* ===================================================================== */
/* ===>> BLOCK JS 4: Device Guard & Anti-Theft Logic (Shift System) <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4A : handleIdentitySuccess (The Final Identity Bridge) --- */
/* --------------------------------------------------------------------- */
/**
 * handleIdentitySuccess: 
 * OTP verify hone ke baad Google aur Telegram se saara verified data (Hiden)
 * ikatha karta hai aur use 'users' table mein naye column names ke sath save karta hai.
 */
async function handleIdentitySuccess() {
    const currentDID = localStorage.getItem('RP_DeviceID');
    const userType = sessionStorage.getItem('RP_User_Type');
    const tempEmail = sessionStorage.getItem('RP_Temp_Email');
    const tempPhone = sessionStorage.getItem('RP_Temp_Phone');
    const countryCode = sessionStorage.getItem('RP_Country_Code') || '+91';
    const fullPhone = (countryCode + tempPhone).replace(/\s/g, '');

    // Google/Yahoo Data from Session (Captured in login.js)
    const providerName = sessionStorage.getItem('RP_Verified_Name') || "";
    const providerUID  = sessionStorage.getItem('RP_Provider_UID') || "";
    const authProvider = sessionStorage.getItem('RP_Auth_Provider') || "manual";

    // UI State: Processing Animation
    if (verifyKeyBtn) {
        verifyKeyBtn.disabled = true;
        const btnText = verifyKeyBtn.querySelector('.btn-text');
        const btnLoader = verifyKeyBtn.querySelector('.btn-loader');
        if (btnText) btnText.style.opacity = '0';
        if (btnLoader) btnLoader.style.display = 'block';
    }

    try {
        // 1. Capture Telegram Name from otp_store (Hiden Data)
        const { data: otpData } = await _sb
            .from('otp_store')
            .select('telegram_name')
            .eq('login_mobile', fullPhone)
            .maybeSingle();
        
        const telegramName = otpData?.telegram_name || "";

        // SCENARIO 1: Agar User bilkul naya hai (First Time Registration)
        if (userType === 'NEW') {
            const { error: insertError } = await _sb
                .from('users')
                .insert({
                    login_email: tempEmail,      
                    login_mobile: tempPhone,              
                    device_fingerprint: currentDID,
                    is_blocked: false,
                    created_at: new Date().toISOString(),
                    security_level: 'Standard',
                    // Hidden Identity Columns (Naming Sync)
                    provider_name: providerName,         // Google/Yahoo Name
                    provider_uid: providerUID,           // Provider Unique ID
                    auth_provider: authProvider,         // Source Type
                    telegram_name: telegramName          // Telegram Profile Name
                });

            if (insertError) throw new Error(insertError.message);

            if (typeof showIsland === 'function') showIsland("New Identity Created Successfully!", "success");
            
            // Clean-up OTP record after successful sync
            await _sb.from('otp_store').delete().eq('login_mobile', fullPhone);

            setTimeout(() => { window.location.href = '../3-Dashboard/Dashboard.html'; }, 2000);
            return;
        }

        // SCENARIO 2: Agar User purana hai (Login Flow)
        const { data: user, error: userError } = await _sb
            .from('users')
            .select('id, device_fingerprint, is_blocked')
            .eq('login_email', tempEmail)
            .single();

        if (userError) throw new Error("Account not found. Please register first.");

        if (user.is_blocked) {
            return showHighAlert("This Identity is permanently suspended.");
        }

        // Silent Update: Data refresh in new columns (Background Sync)
        await _sb
            .from('users')
            .update({ 
                provider_name: providerName,
                telegram_name: telegramName,
                identity_synced_at: new Date().toISOString()
            })
            .eq('id', user.id);

        // Device Guard Logic: Check if device DNA matches
        if (user.device_fingerprint === currentDID) {
            if (typeof showIsland === 'function') showIsland("Device Verified. Welcome back!", "success");
            
            // Clean-up OTP record
            await _sb.from('otp_store').delete().eq('login_mobile', fullPhone);

            setTimeout(() => { window.location.href = '../3-Dashboard/Dashboard.html'; }, 1500);
        } else {
            // New device detected — trigger Shift Protocol (Sub-Block 4B)
            triggerDeviceShiftProtocol(user.id, currentDID);
        }

    } catch (err) {
        console.error("Identity Bridge Error:", err);
        if (typeof showIsland === 'function') showIsland(err.message, "error");
        
        // Reset Button on Failure
        if (verifyKeyBtn) {
            verifyKeyBtn.disabled = false;
            const btnText = verifyKeyBtn.querySelector('.btn-text');
            const btnLoader = verifyKeyBtn.querySelector('.btn-loader');
            if (btnText) btnText.style.opacity = '1';
            if (btnLoader) btnLoader.style.display = 'none';
        }
    }
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4A file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4B : Trigger Device Shift (Anti-Theft Protocol) --- */
/* --------------------------------------------------------------------- */
let shiftCountdown;

/**
 * triggerDeviceShiftProtocol: 
 * Naye device par login karne par 3-minute ka real-time timer chalu karta hai.
 */
function triggerDeviceShiftProtocol(uid, newDID) {
    const shiftTimerText = document.getElementById('shift-timer-text');
    const timerRing = document.getElementById('timer-progress-ring');
    
    if (typeof showIsland === 'function') showIsland("New Device detected! Verification required.", "error");

    // Smooth switch to Shift Guard view (Zero-Jerk Rule)
    if (selectionView) selectionView.style.display = 'none';
    if (keyInputView) keyInputView.style.display = 'none';
    
    if (shiftGuardView) {
        shiftGuardView.style.display = 'block';
        void shiftGuardView.offsetWidth; // Force Reflow for transition
        shiftGuardView.classList.add('active');
    }

    let timeLeft = 180; // 3 Minutes (180 Seconds)
    const totalTime = 180;
    const ringCircumference = 339.29;

    clearInterval(shiftCountdown);
    shiftCountdown = setInterval(() => {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        if(shiftTimerText) shiftTimerText.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        // Circular Progress Ring animation
        const offset = ringCircumference - (timeLeft / totalTime) * ringCircumference;
        if(timerRing) timerRing.style.strokeDashoffset = offset;

        if (timeLeft <= 0) {
            clearInterval(shiftCountdown);
            handleShiftExpiry();
        }
        timeLeft--;
    }, 1000);

    // Start Real-time sync listener (JS Block 5A)
    if (typeof startShiftSyncListener === 'function') {
        startShiftSyncListener(uid, newDID);
    }
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4B file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 4C : High Alert Logic & Expiry Rules --- */
/* --------------------------------------------------------------------- */
/**
 * showHighAlert: Device ko permanent block screen par bhejta hai.
 */
function showHighAlert(reason) {
    const blockScreen = document.getElementById('high-alert-screen');
    const blockReasonText = document.getElementById('block-reason');
    if (blockReasonText) blockReasonText.textContent = reason;
    if (blockScreen) blockScreen.style.display = 'flex';
    
    const container = document.getElementById('app-container');
    if (container) container.style.display = 'none';
}

function handleShiftExpiry() {
    if (typeof showIsland === 'function') showIsland("Verification time expired. Please re-login.", "error");
    setTimeout(() => { 
        window.location.href = '../1-login/login.html'; 
    }, 2000);
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 4C file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 4 file : 2-verification/Verification.js <<=== */
/* ===================================================================== */




/* ===================================================================== */
/* ===>> BLOCK JS 5: Real-time Identity Sync & Portal Finalization <<=== */
/* ===================================================================== */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5A : Start Shift Sync Listener (The Magic Bridge) --- */
/* --------------------------------------------------------------------- */
/**
 * startShiftSyncListener: 
 * Supabase Real-time channel ka use karke primary device se aane wale 
 * APPROVED ya REJECTED signal ko live sunta hai.
 */
function startShiftSyncListener(uid, newDID) {
    const syncChannel = _sb.channel(`identity-sync-${uid}`);

    syncChannel
        .on('broadcast', { event: 'auth-response' }, async ({ payload }) => {
            const { action, targetDeviceID } = payload;

            // Rule: Sirf tabhi action lo jab target Device ID match kare
            if (targetDeviceID === newDID) {
                if (action === 'APPROVED') {
                    if (shiftCountdown) clearInterval(shiftCountdown);
                    if (typeof showIsland === 'function') showIsland("Authorization Granted!", "success");
                    
                    // Naye hardware ko users table mein register karo
                    await finalizeIdentityEntry(uid, newDID);
                } 
                else if (action === 'REJECTED') {
                    if (shiftCountdown) clearInterval(shiftCountdown);
                    
                    // Device ko nuclear block (high alert) list mein daalo
                    await _sb
                        .from('blocked_devices')
                        .insert({ 
                            device_id: newDID, 
                            reason: 'Rejected by primary device owner',
                            created_at: new Date().toISOString()
                        });

                    showHighAlert("Authorization REJECTED. This hardware is now permanently flagged.");
                }
            }
        })
        .subscribe((status) => {
            console.log("Modular Engine: Real-time sync status ->", status);
        });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5A file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5B : Finalize Identity Entry (Database Sync) --- */
/* --------------------------------------------------------------------- */
/**
 * finalizeIdentityEntry: 
 * Naye device ki fingerprint ko 'users' table me update karke 
 * user ko dashboard raste par bhejta hai.
 */
async function finalizeIdentityEntry(uid, newDID) {
    try {
        const phone = sessionStorage.getItem('RP_Temp_Phone');
        const countryCode = sessionStorage.getItem('RP_Country_Code') || '+91';
        const fullPhone = (countryCode + phone).replace(/\s/g, '');

        // 1. Naming convention check: Update new hardware ID
        const { error: updateError } = await _sb
            .from('users')
            .update({ device_fingerprint: newDID })
            .eq('id', uid);

        if (updateError) throw updateError;

        // 2. Clean-up: OTP record ko delete karo (login_mobile column)
        await _sb.from('otp_store').delete().eq('login_mobile', fullPhone);

        if (typeof showIsland === 'function') showIsland("Device Sync Complete. Welcome!", "success");

        // 3. Final Transition to Dashboard
        setTimeout(() => {
            window.location.href = '../3-Dashboard/Dashboard.html';
        }, 1800);

    } catch (err) {
        console.error("Sync Error:", err);
        if (typeof showIsland === 'function') showIsland("Sync failed. Please try manual re-entry.", "error");
    }
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5B file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5C : Email Shift Link (Lost Phone Protocol) --- */
/* --------------------------------------------------------------------- */
/**
 * shiftViaEmail: 
 * Agar purana phone kho gaya hai, toh email raste ka link trigger karta hai.
 */
const emailShiftLink = document.getElementById('shift-via-email');
if (emailShiftLink) {
    emailShiftLink.addEventListener('click', (e) => {
        e.preventDefault();
        triggerHaptic();
        if (typeof showIsland === 'function') {
            showIsland("Email shift link will be active after 3 minutes.", "info");
        }
    });
}
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5C file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* --------------------------------------------------------------------- */
/* --- Sub-Block 5D : Page Load Animation & Vision Entrance --- */
/* --------------------------------------------------------------------- */
/**
 * revealVerificationSystem: 
 * Page load hone par spatial glass card ko hawa mein tairta hua dikhata hai.
 */
window.addEventListener('load', () => {
    // Card entrance animation physics
    const card = document.querySelector('.spatial-glass-card');
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95) translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.32, 0.72, 0, 1)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
        }, 150);
    }
});
/* --------------------------------------------------------------------- */
/* --- End Sub-Block 5D file : 2-verification/Verification.js --- */ 
/* --------------------------------------------------------------------- */

/* ===================================================================== */
/* ===>> END OF BLOCK JS 5 file : 2-verification/Verification.js <<=== */
/* ===================================================================== */