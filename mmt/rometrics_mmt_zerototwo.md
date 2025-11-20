<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>MMT Trainer</title>

<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
</script>

<style>
/* --- NEW MMT COLOR SCHEME: Teal & Charcoal (Clinical Contrast) --- */
:root{
    --bg:#f1f5f9;        /* Light Gray Background */
    --panel:#ffffff;     /* White Panel */
    --line:#cbd5e1;      /* Cool Gray Border */
    --ctrl:#e2e8f0;      /* Lighter Control BG */
    --text:#0f172a;      /* Dark Charcoal Text */
    --muted:#64748b;     /* Muted Gray Text */
    --primary-teal: #0d9488; /* Deep Teal for emphasis */
    --secondary-yellow: #facc15; /* Bright Yellow for test */
}
html,body{margin:0;height:100%;background:var(--bg);color:var(--text);overflow:hidden;font-family:system-ui,Segoe UI,Roboto}
.panel{position:fixed;left:25px;top:12px;width:360px;max-height:90vh;z-index:100;background:var(--panel);border:1px solid var(--line);border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.15);display:flex;flex-direction:column;overflow:hidden}
.dragbar{cursor:move;background:var(--ctrl);border-bottom:1px solid var(--line);padding:8px 12px;font-weight:700;display:flex;align-items:center;gap:8px}
.dragbar .hint{margin-left:auto;font-size:12px;color:var(--muted)}
.content{padding:12px;overflow:auto}
label{display:block;font-size:12px;margin-top:8px;color:var(--muted)}
select,button,input[type=range]{width:100%;margin:6px 0 8px 0;padding:8px 10px;border-radius:10px;background:var(--ctrl);border:1px solid var(--line);color:var(--text)}
.row{display:flex;gap:8px}.row>button{flex:1}
.mini{padding:6px 10px;border-radius:8px;background:var(--ctrl);border:1px solid var(--line)}
#log{background:var(--ctrl);border:1px solid var(--line);min-height:90px;max-height:130px;overflow:auto;border-radius:8px;padding:8px;font-size:12px;white-space:pre-wrap;color:var(--text)}
#msg{position:fixed;bottom:10px;left:12px;background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:6px 10px;font-size:12px;z-index:25;color:var(--text)}
canvas{position:fixed;inset:0;width:100%;height:100%;display:block}

/* MMT Specific Styles */
.mmt-pill.active {
    border-color: var(--primary-teal);
    box-shadow: 0 0 8px rgba(13, 148, 136, 0.6);
}
/* Hand Placement Visuals (Stabilizer = Teal, Test = Yellow) */
.place-btn.stabilize { border-color: var(--primary-teal); color: var(--primary-teal); }
.place-btn.stabilize.active { background: var(--primary-teal); color: white; border-color: var(--primary-teal); }
.place-btn.test { border-color: var(--secondary-yellow); color: #b45309; }
.place-btn.test.active { background: #b45309; color: white; border-color: #b45309; } /* Darker Orange/Brown for contrast */
.place-btn:disabled { opacity: 0.5; cursor: default; }

/* The new progressive resistance button */
#testButton {
    position: relative;
    padding: 12px 10px;
    font-weight: 700;
    overflow: hidden;
    transition: background-color 0.2s;
    touch-action: none; 
    background: var(--ctrl); 
}
#resistanceFill {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: var(--secondary-yellow); 
    transition: width 0.1s linear;
    z-index: 1;
}
#resistanceText {
    position: relative;
    z-index: 2;
    color: var(--text);
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.3); 
}
#instructionText {
    font-size: 12px;
    color: var(--muted);
    text-align: center;
    margin: 4px 0 12px 0;
    display: none; 
}
</style>
</head>
<body>

  <div class="panel" id="panel">
    <div class="dragbar" id="dragbar">💪 MMT Trainer <span class="hint">drag me</span></div>
    <div class="content">

        <label>MMT Test & Muscle</label>
        <select id="actionSel">
            <option value="">(Select a test to begin…)</option>
            <optgroup label="Scapula">
              <option value="Serratus_Anterior">Scapular Abduction & Upward Rotation (Serratus Anterior)</option>
              <option value="Upper_Trapezius">Scapular Elevation (Upper Trapezius, Levator Scapulae)</option>
              <option value="Middle_Trapezius">Scapular Adduction / Retraction (Middle Trapezius)</option>
              <option value="Rhomboids">Scapular Adduction + Downward Rotation (Rhomboids)</option>
              <option value="Latissimus_Dorsi">Latissimus Dorsi (shoulder depression/extension pattern)</option>
            </optgroup>
            <optgroup label="Shoulder">
              <option value="Anterior_Deltoid">Shoulder Flexion (Anterior Deltoid, Coracobrachialis)</option>
              <option value="Posterior_Deltoid">Shoulder Extension (Posterior Deltoid, Lat, Teres Major)</option>
              <option value="Middle_Deltoid">Shoulder Abduction (Middle Deltoid, Supraspinatus)</option>
              <option value="Infraspinatus">Shoulder External Rotation (Infraspinatus, Teres Minor)</option>
              <option value="Subscapularis">Shoulder Internal Rotation (Subscapularis, Teres Major, Pec Major, Lat)</option>
            </optgroup>
            <optgroup label="Elbow">
              <option value="Biceps_Brachii">Elbow Flexion — Biceps Brachii (supinated)</option>
              <option value="Brachialis">Elbow Flexion — Brachialis (pronated)</option>
              <option value="Brachioradialis">Elbow Flexion — Brachioradialis (neutral)</option>
              <option value="Triceps_Brachii">Elbow Extension — Triceps Brachii</option>
            </optgroup>
            <optgroup label="Wrist">
              <option value="ECRL">Wrist Extension — Extensor Carpi Radialis Longus (ECRL)</option>
              <option value="ECRB">Wrist Extension — Extensor Carpi Radialis Brevis (ECRB)</option>
              <option value="ECU">Wrist Extension — Extensor Carpi Ulnaris (ECU)</option>
              <option value="FCR">Wrist Flexion — Flexor Carpi Radialis (FCR)</option>
              <option value="FCU">Wrist Flexion — Flexor Carpi Ulnaris (FCU)</option>
            </optgroup>
            <optgroup label="Hip">
              <option value="Iliopsoas">Hip Flexion (Iliopsoas)</option>
              <option value="Glute_Max">Hip Extension (Glute Max, Hamstrings)</option>
              <option value="Glute_Med">Hip Abduction (Glute Med, Glute Min)</option>
              <option value="Hip_ER">Hip External Rotation</option>
              <option value="Hip_IR">Hip Internal Rotation</option>
            </optgroup>
            <optgroup label="Knee">
              <option value="Hamstrings">Knee Flexion (Hamstrings)</option>
              <option value="Quadriceps">Knee Extension (Quadriceps)</option>
            </optgroup>
            <optgroup label="Ankle & Foot">
              <option value="Tibialis_Anterior">Dorsiflexion + Inversion (Tibialis Anterior)</option>
              <option value="Gastrocnemius">Plantar Flexion (Gastrocnemius, Soleus)</option>
            </optgroup>
        </select>

        <div class="row" style="margin-top:10px;">
          <button id="startTestBtn" class="mini">▶️ Start Test (Grade 3 Position)</button>
        </div>

        <label>Test Grade Selection</label>
        <div class="row">
          <select id="grade35">
            <option value="3">Grade 3 (Full ROM / No Resistance)</option>
            <option value="4">Grade 4 (Full ROM / Moderate Resistance)</option>
            <option value="5">Grade 5 (Full ROM / Maximum Resistance)</option>
          </select>
          <select id="grade02">
            <option value="0">Grade 0 (No Contraction)</option>
            <option value="1">Grade 1 (Trace Contraction)</option>
            <option value="2">Grade 2 (Full ROM / Gravity Eliminated)</option>
          </select>
        </div>
        
                <div class="row" style="margin-top:10px;">
          <button id="testButton" disabled>
            <div id="resistanceFill"></div>
            <span id="resistanceText">Hold to Apply Resistance (4/5)</span>
          </button>
        </div>
        <p id="instructionText">Hold for 1s ($\text{Grade 4}$), Hold for 2s ($\text{Grade 5}$).</p>

        <label>Hands/Arm Placement (After Start Test)</label>
        <div class="row">
          <button id="placeStabilize" class="mini place-btn stabilize" disabled>📍 Stabilize Arm</button>
          <button id="placeTest" class="mini place-btn test" disabled>✋ Test Arm</button>
        </div>
        <p style="font-size:12px;color:var(--muted);text-align:center;margin:4px 0 8px 0;">Click to place virtual MMT hands/arms.</p>
        

      <label style="margin-top:12px;">Model Control</label>
      <div class="row">
        <button id="lock3D" class="mini">🔓 3D: Unlocked</button>
        <button id="zeroAll" class="mini" title="Reset everything to anatomic baseline">Zero All</button>
      </div>


      <label style="display:none">Event Log</label>
      <pre id="log" style="display:none"></pre>
    </div>
  </div>

  <div id="msg">Loading…</div>
  <canvas id="c"></canvas>

    <div id="handHost" class="hide" aria-hidden="true" style="position:fixed; inset:0; z-index:10; pointer-events:none">
    <svg id="handSvg" style="width:100vw;height:100vh;background:transparent;pointer-events:none">
      <g id="handDots"></g>
    </svg>
  </div>


  <script type="module">
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
  import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
  import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
  import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
   
/* ===================== MMT CONFIGURATION ===================== */

// MMT Test Definitions (Simplified and Linked to Bone Keys)
const MMT_TESTS = {
    "Serratus_Anterior": { actionKey: 'sh_aa_l', plane: 'frontal', pose: { name: 'sitting', cam: [3, 1.5, 3] }, side: 'l', max: 180, move: 90, stab: [0, 0, 0], test: [0, 0, 0] },
    "Upper_Trapezius": { actionKey: 'cerv_lat', plane: 'frontal', pose: { name: 'sitting', cam: [2.5, 1.8, 1.8] }, side: '', max: 45, move: 30, stab: [0, 0, 0], test: [0, 0, 0] },
    "Middle_Trapezius": { actionKey: 'sh_aa_l', plane: 'frontal', pose: { name: 'prone', cam: [3, 1.5, 3] }, side: 'l', max: 90, move: 90, stab: [0, 0, 0], test: [0, 0, 0] },
    "Rhomboids": { actionKey: 'sh_aa_l', plane: 'frontal', pose: { name: 'prone', cam: [3, 1.5, 3] }, side: 'l', max: 90, move: 90, stab: [0, 0, 0], test: [0, 0, 0] },
    "Latissimus_Dorsi": { actionKey: 'sh_fe_l', plane: 'sagittal', pose: { name: 'prone', cam: [3, 1.5, 3] }, side: 'l', max: 60, move: 30, stab: [0, 0, 0], test: [0, 0, 0] },

    "Anterior_Deltoid": { actionKey: 'sh_fe_l', plane: 'sagittal', pose: { name: 'sitting', cam: [2.5, 1.8, 1.8] }, side: 'l', max: 180, move: 90, stab: [0, 0, 0], test: [0, 0, 0] },
    "Posterior_Deltoid": { actionKey: 'sh_fe_l', plane: 'sagittal', pose: { name: 'prone', cam: [3, 1.5, 3] }, side: 'l', max: 60, move: 30, stab: [0, 0, 0], test: [0, 0, 0] },
    "Middle_Deltoid": { actionKey: 'sh_aa_l', plane: 'frontal', pose: { name: 'sitting', cam: [3, 1.5, 3] }, side: 'l', max: 180, move: 90, stab: [0, 0, 0], test: [0, 0, 0] },
    "Infraspinatus": { actionKey: 'sh_irer_l', plane: 'transverse', pose: { name: 'prone', cam: [3, 1.5, 3] }, side: 'l', max: 90, move: 90, stab: [0, 0, 0], test: [0, 0, 0] },
    "Subscapularis": { actionKey: 'sh_irer_l', plane: 'transverse', pose: { name: 'supine', cam: [3, 1.5, 3] }, side: 'l', max: 70, move: 90, stab: [0, 0, 0], test: [0, 0, 0] },
    
    "Biceps_Brachii": { actionKey: 'el_fe_l', plane: 'sagittal', pose: { name: 'sitting', cam: [2.5, 1.8, 1.8] }, side: 'l', max: 150, move: 90, stab: [0, 0, 0], test: [0, 0, 0] },
    "Brachialis": { actionKey: 'el_fe_l', plane: 'sagittal', pose: { name: 'sitting', cam: [2.5, 1.8, 1.8] }, side: 'l', max: 150, move: 90, stab: [0, 0, 0], test: [0, 0, 0] },
    "Brachioradialis": { actionKey: 'el_fe_l', plane: 'sagittal', pose: { name: 'sitting', cam: [2.5, 1.8, 1.8] }, side: 'l', max: 150, move: 90, stab: [0, 0, 0], test: [0, 0, 0] },
    "Triceps_Brachii": { actionKey: 'el_fe_l', plane: 'sagittal', pose: { name: 'supine', cam: [3, 1.5, 3] }, side: 'l', max: 10, move: 10, stab: [0, 0, 0], test: [0, 0, 0] },
    
    "ECRL": { actionKey: 'wr_fe_l', plane: 'sagittal', pose: { name: 'sitting', cam: [2.5, 1.8, 1.8] }, side: 'l', max: 80, move: 30, stab: [0, 0, 0], test: [0, 0, 0] },
    "ECRB": { actionKey: 'wr_fe_l', plane: 'sagittal', pose: { name: 'sitting', cam: [2.5, 1.8, 1.8] }, side: 'l', max: 80, move: 30, stab: [0, 0, 0], test: [0, 0, 0] },
    "ECU": { actionKey: 'wr_fe_l', plane: 'sagittal', pose: { name: 'sitting', cam: [2.5, 1.8, 1.8] }, side: 'l', max: 80, move: 30, stab: [0, 0, 0], test: [0, 0, 0] },
    "FCR": { actionKey: 'wr_fe_l', plane: 'sagittal', pose: { name: 'sitting', cam: [2.5, 1.8, 1.8] }, side: 'l', max: 70, move: 30, stab: [0, 0, 0], test: [0, 0, 0] },
    "FCU": { actionKey: 'wr_fe_l', plane: 'sagittal', pose: { name: 'sitting', cam: [2.5, 1.8, 1.8] }, side: 'l', max: 70, move: 30, stab: [0, 0, 0], test: [0, 0, 0] },
    
    "Iliopsoas": { actionKey: 'hip_fe_l', plane: 'sagittal', pose: { name: 'sitting', cam: [2.5, 1.5, 3] }, side: 'l', max: 120, move: 90, stab: [0, 0, 0], test: [0, 0, 0] },
    "Glute_Max": { actionKey: 'hip_fe_l', plane: 'sagittal', pose: { name: 'prone', cam: [3, 1.5, 3] }, side: 'l', max: 30, move: 10, stab: [0, 0, 0], test: [0, 0, 0] },
    "Glute_Med": { actionKey: 'hip_aa_l', plane: 'frontal', pose: { name: 'supine', cam: [3, 1.5, 3] }, side: 'l', max: 45, move: 20, stab: [0, 0, 0], test: [0, 0, 0] },
    "Hip_ER": { actionKey: 'hip_irer_l', plane: 'transverse', pose: { name: 'sitting', cam: [2.5, 1.5, 3] }, side: 'l', max: 45, move: 20, stab: [0, 0, 0], test: [0, 0, 0] },
    "Hip_IR": { actionKey: 'hip_irer_l', plane: 'transverse', pose: { name: 'sitting', cam: [2.5, 1.5, 3] }, side: 'l', max: 45, move: 20, stab: [0, 0, 0], test: [0, 0, 0] },
    
    "Hamstrings": { actionKey: 'knee_fe_l', plane: 'sagittal', pose: { name: 'prone', cam: [3, 1.5, 3] }, side: 'l', max: 150, move: 90, stab: [0, 0, 0], test: [0, 0, 0] },
    "Quadriceps": { actionKey: 'knee_fe_l', plane: 'sagittal', pose: { name: 'sitting', cam: [2.5, 1.5, 3] }, side: 'l', max: 55, move: 10, stab: [0, 0, 0], test: [0, 0, 0] },
    
    "Tibialis_Anterior": { actionKey: 'ankle_dfpf_l', plane: 'sagittal', pose: { name: 'sitting', cam: [3, 0.5, 3] }, side: 'l', max: 20, move: 10, stab: [0, 0, 0], test: [0, 0, 0] },
    "Gastrocnemius": { actionKey: 'ankle_dfpf_l', plane: 'sagittal', pose: { name: 'prone', cam: [3, 0.5, 3] }, side: 'l', max: 50, move: 20, stab: [0, 0, 0], test: [0, 0, 0] },
};

let CURRENT_MMT = null;
let resistanceTimer = null;
let resistanceStartTime = 0;
const RESISTANCE_FILL_TIME = 2000; // 2 seconds for full fill

/* ===================== NEW HANDS PLACEMENT LOGIC ===================== */

const MMT_HANDS = {
    stabilize: { x: -100, y: -100, placed: false, color: '#0d9488', element: null }, // Teal
    test:      { x: -100, y: -100, placed: false, color: '#facc15', element: null }  // Yellow
};
let activeHandTarget = null; 

// Element selectors for the new SVG layer
const handSvg = document.getElementById('handSvg');
const handDotsGrp = document.getElementById('handDots');

function updateHandDot(handKey) {
    const hand = MMT_HANDS[handKey];
    if (!hand.element) {
        const NS = "http://www.w3.org/2000/svg";
        hand.element = document.createElementNS(NS, 'circle');
        hand.element.setAttribute('r', '8');
        hand.element.setAttribute('stroke', hand.color);
        hand.element.setAttribute('stroke-width', '3'); 
        hand.element.setAttribute('fill', 'rgba(0,0,0,0.5)');
        handDotsGrp.appendChild(hand.element);
    }

    if (hand.placed) {
        hand.element.setAttribute('cx', hand.x);
        hand.element.setAttribute('cy', hand.y);
        hand.element.style.display = 'block';
    } else {
        hand.element.style.display = 'none';
    }
    document.getElementById('handHost').classList.toggle('hide', !MMT_HANDS.stabilize.placed && !MMT_HANDS.test.placed);
}

function placeHand(e) {
    if (!activeHandTarget) return;

    const hand = MMT_HANDS[activeHandTarget];
    const rect = handSvg.getBoundingClientRect();
    hand.x = e.clientX - rect.left;
    hand.y = e.clientY - rect.top;
    hand.placed = true;

    updateHandDot(activeHandTarget);
    log(`${activeHandTarget} hand pinned @ ${hand.x | 0}, ${hand.y | 0}`);
    
    document.getElementById(`place${activeHandTarget.charAt(0).toUpperCase() + activeHandTarget.slice(1)}`).classList.remove('active');
    activeHandTarget = null;
    handSvg.style.pointerEvents = 'none'; 
}


/* ===================== OLD/REUSED HELPER FUNCTIONS ===================== */

const logEl = document.getElementById("log");
const log = (t) => { logEl.textContent += t + "\n"; logEl.scrollTop = logEl.scrollHeight; };
const canvas = document.getElementById("c");
const actionSel = document.getElementById("actionSel");
const startTestBtn = document.getElementById("startTestBtn");
const testButton = document.getElementById("testButton");
const resistanceFill = document.getElementById("resistanceFill");
const resistanceText = document.getElementById("resistanceText");
const instructionText = document.getElementById("instructionText");
const placeStabilizeBtn = document.getElementById("placeStabilize");
const placeTestBtn = document.getElementById("placeTest");
const grade35 = document.getElementById("grade35");
const grade02 = document.getElementById("grade02");

let model = null, skeleton = null;
const initialBoneRot = new Map();
const JOINT_BIND = new Map();
let controls = null;

const ALL_ACTIONS = [
    { key: 'sh_fe_l', plane: 'sagittal', hints: [/upperarm|humerus/i] },
    { key: 'sh_aa_l', plane: 'frontal', hints: [/upperarm|humerus/i] },
    { key: 'sh_irer_l', plane: 'transverse', hints: [/upperarm_L/i] },
    { key: 'el_fe_l', plane: 'sagittal', hints: [/lowerarm|forearm/i] },
    { key: 'wr_fe_l', plane: 'sagittal', hints: [/wrist|hand/i] },
    { key: 'hip_fe_l', plane: 'sagittal', hints: [/thigh|femur/i] },
    { key: 'hip_aa_l', plane: 'frontal', hints: [/thigh|femur/i] },
    { key: 'hip_irer_l', plane: 'transverse', hints: [/thigh|femur/i] },
    { key: 'knee_fe_l', plane: 'sagittal', hints: [/calf|tibia/i] },
    { key: 'ankle_dfpf_l', plane: 'sagittal', hints: [/ankle|foot/i] },
    { key: 'cerv_lat', plane: 'frontal', hints: [/^neck$|cspine|head/i] },
    { key: 'sh_fe_r', plane: 'sagittal', hints: [/upperarm|humerus/i] },
];
const cfgFromKey = (k) => ALL_ACTIONS.find(x => x.key === k) || null;

const EXCLUDE = /(pelvis|root|scapula)/i;
function sideRegex(side) {
    if (!side) return [/.*/];
    return side === 'l'
        ? [/\bleft\b/i, /\b_left\b/i, /\.l\b/i, /_l\b/i, /\bl\b(?![a-z])/i, /mixamorig:.*left/i]
        : [/\bright\b/i, /\b_right\b/i, /\.r\b/i, /_r\b/i, /\br\b(?![a-z])/i, /mixamorig:.*right/i];
}

function findBoneBy(cfg) {
    if (!skeleton) return null;
    const names = skeleton.bones.map(b => b.name.toLowerCase());
    const sideREs = sideRegex(cfg.side);
    const HINTS = cfg.hints || [];
    const tryList = HINTS;

    for (const cand of tryList) {
        for (let i = 0; i < names.length; i++) {
            if (EXCLUDE.test(names[i])) continue;
            if (cfg.side && !sideREs.some(r => r.test(names[i]))) continue;
            if (cand.test(names[i])) return skeleton.bones[i];
        }
    }
    return null;
}

function axisFor(profile, key, defAxis) {
    const map = {
        sh_fe_l: 'x', sh_aa_l: 'z', sh_irer_l: 'y',
        el_fe_l: 'x', wr_fe_l: 'x', hip_fe_l: 'x', hip_aa_l: 'z',
        hip_irer_l: 'y', knee_fe_l: 'x', ankle_dfpf_l: 'x', cerv_lat: 'z'
    };
    return map[key] || defAxis;
}

function resolveBind(key, cfg) {
    if (JOINT_BIND.has(key)) return JOINT_BIND.get(key);
    let bone = findBoneBy({ ...cfg, key });

    if (key === 'cerv_lat') { 
        bone = findBoneBy({ side: '', hints: [/^head$/, /^neck$/] });
    } else if (!bone) {
        return null;
    }

    const qBind = (initialBoneRot.get(bone) || bone.quaternion.clone()).clone();
    const baseAxis = ({ sagittal: 'x', frontal: 'z', transverse: 'y' })[cfg.plane] || 'x';
    const axis = axisFor('generic', key, baseAxis);
    const obj = { bone, qBind, axis };
    JOINT_BIND.set(key, obj);
    return obj;
}

function applyPairAngle(key, cfg, deg) {
    const bind = resolveBind(key, cfg);
    if (!bind) return;

    const { bone, qBind, axis: rawAxis } = bind;
    let rad = THREE.MathUtils.degToRad(deg);
    let axis = rawAxis || 'x';
    let flip = 1;

    if (key === 'hip_aa_r' || key === 'sh_aa_r') flip = -1;

    let x = 0, y = 0, z = 0;
    const r = flip * rad;
    if (axis === 'x') x = r;
    if (axis === 'y') y = r;
    if (axis === 'z') z = r; 

    const e = new THREE.Euler(x, y, z, "XYZ");
    const qDelta = new THREE.Quaternion().setFromEuler(e);
    bone.quaternion.copy(qBind).multiply(qDelta);
}

function setPair(key, deg) {
    const cfg = cfgFromKey(key);
    if (cfg) applyPairAngle(key, cfg, deg);
}

function resetAllBonesToInitial() {
    if (!skeleton) return;
    skeleton.bones.forEach(b => {
        const q0 = initialBoneRot.get(b);
        if (q0) b.quaternion.copy(q0);
    });
    JOINT_BIND.clear(); 
}

function set3DLock(v) {
    let lock3D = v;
    if (controls) controls.enabled = !lock3D;
    const btn = document.getElementById("lock3D");
    if (btn) { btn.textContent = (lock3D ? "🔒 3D: Locked" : "🔓 3D: Unlocked"); btn.classList.toggle('lockOn', lock3D); }
}

const ANAT = { addL: 0, psL: 0, wpsL: 0 }; 
function applyAnatomicBaseline() {
    setPair('sh_aa_l', ANAT.addL);
}


/* ===================== MMT LOGIC ===================== */

const PI_HALF = Math.PI / 2;
function updateModelPose(pose) {
    if (!model) return;
    resetAllBonesToInitial();
    model.rotation.set(0, 0, 0, 'XYZ');
    model.position.set(0, 0, 0.6); 

    if (pose === "supine") {
        model.rotation.x = -PI_HALF;
    } else if (pose === "prone") {
        model.rotation.x = -PI_HALF;
        model.rotation.y = Math.PI;
    } else if (pose === "sitting") {
        setPair('hip_fe_l', 90);
        setPair('hip_fe_r', 90);
        setPair('knee_fe_l', -90); 
        setPair('knee_fe_r', -90);
        model.position.y = -0.4;
    }
    
    if (CURRENT_MMT && CURRENT_MMT.pose.cam) {
        controls.target.set(CURRENT_MMT.pose.cam[0], CURRENT_MMT.pose.cam[1], CURRENT_MMT.pose.cam[2]);
        controls.update();
    } else {
        controls.target.set(0, 1.1, 0);
        controls.update();
    }
}

function startTestMovement(testCfg) {
    if (!testCfg || !testCfg.actionKey) return;

    const { name: poseName } = testCfg.pose;
    updateModelPose(poseName);

    const { actionKey, move } = testCfg;
    setPair(actionKey, move);
    log(`Model moved to Grade 3 position (${move}°).`);
}

function handleResistanceButtonDown(e) {
    if (testButton.disabled) return;
    e.preventDefault();
    resistanceStartTime = performance.now();
    testButton.classList.add('active');
    resistanceText.textContent = 'Applying Resistance...';
    instructionText.style.display = 'block'; 

    resistanceTimer = setInterval(() => {
        const elapsed = performance.now() - resistanceStartTime;
        const progress = Math.min(1, elapsed / RESISTANCE_FILL_TIME);
        resistanceFill.style.width = `${progress * 100}%`;

        if (progress >= 1) {
            resistanceText.textContent = 'Grade 5: Maximum Resistance';
            grade35.value = '5';
            log('Grade 5 (Max Resistance) applied.');
        } else if (progress >= 0.5) {
            resistanceText.textContent = 'Grade 4: Moderate Resistance';
            grade35.value = '4';
        } else {
            resistanceText.textContent = 'Applying Resistance...';
        }
    }, 100);
}

function handleResistanceButtonUp() {
    if (!resistanceTimer) return;
    clearInterval(resistanceTimer);
    resistanceTimer = null;

    testButton.classList.remove('active');
    resistanceFill.style.width = '0'; 
    resistanceText.textContent = 'Hold to Apply Resistance (4/5)';
    instructionText.style.display = 'none'; 

    log(`Test complete. Final Grade recorded: ${grade35.value}`);
}

testButton.addEventListener('pointerdown', handleResistanceButtonDown);
testButton.addEventListener('pointerup', handleResistanceButtonUp);
testButton.addEventListener('pointercancel', handleResistanceButtonUp);
testButton.addEventListener('contextmenu', e => e.preventDefault()); 


/* ===================== UI WIRING ===================== */

actionSel.onchange = () => {
    const muscle = actionSel.value;
    CURRENT_MMT = MMT_TESTS[muscle];

    testButton.disabled = true;
    placeStabilizeBtn.disabled = true;
    placeTestBtn.disabled = true;
    placeStabilizeBtn.classList.remove('active');
    placeTestBtn.classList.remove('active');
    MMT_HANDS.stabilize.placed = MMT_HANDS.test.placed = false;
    updateHandDot('stabilize');
    updateHandDot('test');
    instructionText.style.display = 'none';
    resistanceFill.style.width = '0';
    resistanceText.textContent = 'Hold to Apply Resistance (4/5)';


    resetAllBonesToInitial();
    applyAnatomicBaseline();
    updateModelPose('standing');
    log(`Selected MMT: ${muscle}`);
};

startTestBtn.onclick = () => {
    if (!CURRENT_MMT) {
        log("Please select a muscle test first.");
        return;
    }
    startTestMovement(CURRENT_MMT);

    testButton.disabled = false;
    placeStabilizeBtn.disabled = false;
    placeTestBtn.disabled = false;
    log("Test position established. Grade 3 assumed. Hand placement buttons enabled.");
};

placeStabilizeBtn.onclick = () => {
    if (!CURRENT_MMT) return;
    activeHandTarget = 'stabilize';
    placeStabilizeBtn.classList.add('active');
    placeTestBtn.classList.remove('active');
    handSvg.style.pointerEvents = 'auto'; 
    log("Stabilize arm selection active. Click on screen to place.");
};

placeTestBtn.onclick = () => {
    if (!CURRENT_MMT) return;
    activeHandTarget = 'test';
    placeTestBtn.classList.add('active');
    placeStabilizeBtn.classList.remove('active');
    handSvg.style.pointerEvents = 'auto'; 
    log("Test arm selection active. Click on screen to place.");
};

canvas.addEventListener('pointerdown', placeHand, { passive: false });
handSvg.addEventListener('pointerdown', placeHand, { passive: false });

grade35.onchange = () => {
    grade02.value = '0'; 
    log(`Recorded Grade: ${grade35.value}`);
};
grade02.onchange = () => {
    grade35.value = '3'; 
    log(`Recorded Grade: ${grade02.value}`);
};

document.getElementById("zeroAll").onclick = () => {
    resetAllBonesToInitial();
    applyAnatomicBaseline();
    updateModelPose('standing');
    actionSel.value = "";
    log("All motions zeroed → returned to anatomic baseline.");
    testButton.disabled = true;
    placeStabilizeBtn.disabled = true;
    placeTestBtn.disabled = true;
    MMT_HANDS.stabilize.placed = MMT_HANDS.test.placed = false;
    updateHandDot('stabilize');
    updateHandDot('test');
    instructionText.style.display = 'none';
};

/* ===================== THREE.js / RENDER SETUP ===================== */

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf1f5f9); // MATCH NEW BG

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.01, 100);
camera.position.set(1.6, 1.6, 3.2);

controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.minDistance = 0.6; controls.maxDistance = 6;
controls.target.set(0, 1.1, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0x333344, 0.7));
const key = new THREE.DirectionalLight(0xffffff, 1.2);
key.position.set(2.5, 4, 2.5);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.near = 0.1; key.shadow.camera.far = 15;
key.shadow.camera.left = -4; key.shadow.camera.right = 4; key.shadow.camera.top = 4; key.shadow.camera.bottom = -4;
scene.add(key);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.45 }));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
const draco = new DRACOLoader(); draco.setDecoderPath("https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/"); loader.setDRACOLoader(draco);
const ktx2 = new KTX2Loader(); ktx2.setTranscoderPath("https://unpkg.com/three@0.160.0/examples/jsm/libs/basis/"); ktx2.detectSupport(renderer); loader.setKTX2Loader(ktx2);

function groundSnap() {
    if (!model) return;
    const box = new THREE.Box3().setFromObject(model);
    const minY = box.min.y;
    if (isFinite(minY)) model.position.y -= minY;
}

// 🐛 FIXED: The model path logic must be outside loadModel and correctly set the global variable
function pickModelUrl(){
    const u = new URL(location.href);
    const q = u.searchParams.get("model");
    if (q && /^https?:\/\//i.test(q)) return q;
    if (q && q.trim()) return new URL(q, location.href).href;
    return "https://kingto89.github.io/ROMetrics.com/assets/Roma_ROMetrics.glb";
}
let MODEL_URL = pickModelUrl();

function loadModel() {
    log(`Loading model from: ${MODEL_URL}`);
    loader.load(
        MODEL_URL,
        (gltf) => {
            model = gltf.scene;
            model.traverse(o => {
                if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
                if (o.isSkinnedMesh && !skeleton) skeleton = o.skeleton;
            });
            scene.add(model);
            groundSnap();
            document.getElementById("msg").textContent = "✅ Model loaded";

            skeleton.bones.forEach(b => {
                initialBoneRot.set(b, b.quaternion.clone());
            });
            log("Model baselines set.");

            applyAnatomicBaseline();
        },
        (xhr) => {
            const pct = xhr.lengthComputable ? Math.min(100, Math.round((xhr.loaded / xhr.total) * 100)) : null;
            document.getElementById("msg").textContent = pct !== null ? `Loading ${pct}%` : "Loading…";
        },
        (err) => { console.error(err); document.getElementById("msg").textContent = "⚠️ Load error"; log(`Error: ${err?.message || err}`); }
    );
}
loadModel();

document.getElementById("lock3D").onclick = () => set3DLock(!controls.enabled);

addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

const clock = new THREE.Clock();

(function animate() {
    clock.getDelta();
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})();
  </script>
</body>
</html>
