/* ============================================================
   ROMetrics — AutoActions Engine
   Reads motion definitions from lab-motion/index.html
   and performs collision-limited, anatomically-correct actions.
   ============================================================ */

/* GLOBAL API made available to Trainer and Tester */
window.AutoAction = {
    attached: false,
    model: null,
    skeleton: null,
    bones: {},
    actions: {},
    populateMotionDropdown,
    attachModel,
    run
};

/* ============================================================
   1.  Attach the loaded model & skeleton
   ============================================================ */
function attachModel(model, skeleton) {
    AutoAction.model = model;
    AutoAction.skeleton = skeleton;

    // Build bone map (matching Lab Motion)
    model.traverse(obj => {
        if (obj.isBone) {
            AutoAction.bones[obj.name] = obj;
        }
    });

    AutoAction.attached = true;
    console.log("AutoActions: Model attached.");
}

/* ============================================================
   2.  Build dropdown using ACTION_CONFIG from lab-motion
   ============================================================ */
function populateMotionDropdown(sel) {
    if (!window.ACTION_CONFIG) {
        console.warn("AutoActions: Lab Motion ACTION_CONFIG not found.");
        sel.innerHTML = "<option value=''>ERROR: No actions found</option>";
        return;
    }

    sel.innerHTML = "";

    for (const key in window.ACTION_CONFIG) {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = `${key} — ${window.ACTION_CONFIG[key].label || ""}`;
        sel.appendChild(opt);
    }

    console.log("AutoActions: Dropdown populated from lab-motion ACTION_CONFIG.");
}

/* ============================================================
   3.  Run a motion (read from ACTION_CONFIG exactly as in lab-motion)
   ============================================================ */
async function run(key) {

    if (!AutoAction.attached) {
        console.warn("AutoActions: Model not attached.");
        return;
    }
    if (!window.ACTION_CONFIG) {
        console.error("AutoActions: ACTION_CONFIG missing.");
        return;
    }

    const cfg = window.ACTION_CONFIG[key];
    if (!cfg) {
        console.error("AutoActions: Invalid action: " + key);
        return;
    }

    console.log("AutoActions: Running", key, cfg);

    // Extract bones and axes from Lab Motion
    const bones = AutoAction.bones;
    if (!bones[cfg.bone]) {
        console.error("AutoActions: Bone not found:", cfg.bone);
        return;
    }

    // Determine ROM target using Lab Collision Limits
    const maxAngle = determineMaxAngle(key, cfg);

    // Perform animation tweens
    await animateTo(bones[cfg.bone], cfg.axis, maxAngle);

    console.log("AutoActions: Motion complete:", key);
}

/* ============================================================
   4.  Determine ROM limits using COLLIM from lab-motion
   ============================================================ */
function determineMaxAngle(key, cfg) {

    const sign = cfg.sign || 1;
    const fullROM = cfg.maxAngle || cfg.max || 90; // fallback if not defined

    if (window.COLLIM && window.COLLIM.enabled) {

        // Example simple pattern:
        if (window.COLLIM[key + "Max"] !== undefined) {
            const cap = window.COLLIM[key + "Max"];
            return cap * sign;
        }
    }

    // Default if no collision limit is found
    return fullROM * sign;
}

/* ============================================================
   5.  Simple tween animation (matching Lab Motion style)
   ============================================================ */
function animateTo(bone, axis, target, duration = 550) {
    return new Promise(resolve => {

        const start = bone.rotation[axis];
        const end = target * (Math.PI / 180);

        const t0 = performance.now();

        function step(t) {
            const k = Math.min(1, (t - t0) / duration);
            bone.rotation[axis] = start + (end - start) * easeInOut(k);
            if (k < 1) { requestAnimationFrame(step); }
            else { resolve(); }
        }

        requestAnimationFrame(step);
    });
}

function easeInOut(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
