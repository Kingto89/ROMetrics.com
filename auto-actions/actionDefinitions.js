export const UPPER = [
    {key:'trunk_fe',  pair:'Trunk — Flex / Ext',            side:'', plane:'sagittal',   neutral:0, min:-60, max:80,  hints:[/^spine01$/i]},
    {key:'trunk_lat', pair:'Trunk — Lateral Bend (L / R)',  side:'', plane:'frontal',    neutral:0, min:-40, max:40,  hints:[/^spine01$/i]},
    {key:'trunk_rot', pair:'Trunk — Rotation (L / R)',      side:'', plane:'transverse', neutral:0, min:-45, max:45,  hints:[/^spine01$/i]},

    {key:'cerv_fe',   pair:'Cervical Flex / Ext',                side:'', plane:'sagittal',   neutral:0, min:-60,  max:70,  hints:[/^neck$|cspine|head/i]},
    {key:'cerv_lat',  pair:'Cervical Lat Flex (L / R)',          side:'', plane:'frontal',    neutral:0, min:-45,  max:45,  hints:[/^neck$|cspine|head/i]},
    {key:'cerv_rot',  pair:'Cervical Rotation (L / R)',          side:'', plane:'transverse', neutral:0, min:-80,  max:80,  hints:[/^neck$|cspine|head/i]},

    {key:'sh_fe_l',   pair:'Shoulder L — Flex / Ext',            side:'l', plane:'sagittal',  neutral:0, min:-60,  max:180, hints:[/upperarm|humerus|shoulder|arm(?!.*lower)/i]},
    {key:'sh_fe_r',   pair:'Shoulder R — Flex / Ext',            side:'r', plane:'sagittal',  neutral:0, min:-60,  max:180, hints:[/upperarm|humerus|shoulder|arm(?!.*lower)/i]},
    {key:'sh_aa_l',   pair:'Shoulder L — Abd / Add',             side:'l', plane:'frontal',   neutral:0, min:-30,  max:180, hints:[/upperarm|humerus|shoulder|arm(?!.*lower)/i]},
    {key:'sh_aa_r',   pair:'Shoulder R — Abd / Add',             side:'r', plane:'frontal',   neutral:0, min:-30,  max:180, hints:[/upperarm|humerus|shoulder|arm(?!.*lower)/i]},
    {key:'sh_irer_l', pair:'Shoulder L — Internal / External',   side:'l', plane:'transverse',neutral:0, min:-90,  max:90,  hints:[/upperarm|humerus|shoulder|arm(?!.*lower)/i]},
    {key:'sh_irer_r', pair:'Shoulder R — Internal / External',   side:'r', plane:'transverse',neutral:0, min:-90,  max:90,  hints:[/upperarm|humerus|shoulder|arm(?!.*lower)/i]},

    // ELBOW — fix so Flexion moves (150), Extension small (10)
    {key:'el_fe_l',   pair:'Elbow L — Flex / Ext',               side:'l', plane:'sagittal',  neutral:0, min:-10,  max:150, hints:[/lowerarm|forearm|ulna|radius/i]},
    {key:'el_fe_r',   pair:'Elbow R — Flex / Ext',               side:'r', plane:'sagittal',  neutral:0, min:-10,  max:150, hints:[/lowerarm|forearm|ulna|radius/i]},

     // ===== Wrist — corrected direction for right side =====
    {key:'wr_ps_l', pair:'Wrist L — Pronation / Supination', side:'l', plane:'transverse', neutral:0, min:-95, max:85, hints:[/wrist|hand|forearm|radius|ulna/i]},
    {key:'wr_ps_r', pair:'Wrist R — Pronation / Supination', side:'r', plane:'transverse', neutral:0, min:-95, max:85, invert:true, hints:[/wrist|hand|forearm|radius|ulna/i]}, // 🔁 flipped

    {key:'wr_fe_l', pair:'Wrist L — Flex / Ext', side:'l', plane:'sagittal', neutral:0, min:-70, max:80, hints:[/wrist|hand/i]},
    {key:'wr_fe_r', pair:'Wrist R — Flex / Ext', side:'r', plane:'sagittal', neutral:0, min:-70, max:80, hints:[/wrist|hand/i]},

    {key:'wr_ru_l', pair:'Wrist L — Radial / Ulnar Dev', side:'l', plane:'frontal', neutral:0, min:-40, max:20, hints:[/wrist|hand/i]},
    {key:'wr_ru_r', pair:'Wrist R — Radial / Ulnar Dev', side:'r', plane:'frontal', neutral:0, min:-40, max:20, invert:true, hints:[/wrist|hand/i]}, // 🔁 flipped

];   
export const LOWER = [
    {key:'hip_fe_l',   pair:'Hip L — Flex / Ext',                side:'l', plane:'sagittal',  neutral:0, min:-30,  max:120, hints:[/thigh|femur/i]},
    {key:'hip_fe_r',   pair:'Hip R — Flex / Ext',                side:'r', plane:'sagittal',  neutral:0, min:-30,  max:120, hints:[/thigh|femur/i]},
    {key:'hip_aa_l',   pair:'Hip L — Abd / Add',                 side:'l', plane:'frontal',   neutral:0, min:-30,  max:45,  hints:[/thigh|femur/i]},
    {key:'hip_aa_r', pair:'Hip R — Add / Abd', side:'r', plane:'frontal', neutral:0, min:-30, max:45, hints:[/thigh|femur/i]},
    {key:'hip_irer_l', pair:'Hip L — Internal / External',       side:'l', plane:'transverse',neutral:0, min:-45,  max:45,  hints:[/thigh|femur/i]},
    {key:'hip_irer_r', pair:'Hip R — Internal / External',       side:'r', plane:'transverse',neutral:0, min:-45,  max:45,  hints:[/thigh|femur/i]},
    {key:'knee_fe_l', pair:'Knee L — Ext / Flex', side:'l', plane:'sagittal', neutral:0, min:-15, max:150, hints:[/calf|tibia|fibula|shin/i]},
    {key:'knee_fe_r', pair:'Knee R — Ext / Flex', side:'r', plane:'sagittal', neutral:0, min:-15, max:150, hints:[/calf|tibia|fibula|shin/i]},
    {key:'ankle_dfpf_l', pair:'Ankle L — Dorsi / Plantarflex',   side:'l', plane:'sagittal',  neutral:0, min:-20,  max:50,  hints:[/ankle|foot|talus|tarsal/i]},
    {key:'ankle_dfpf_r', pair:'Ankle R — Dorsi / Plantarflex',   side:'r', plane:'sagittal',  neutral:0, min:-20,  max:50,  hints:[/ankle|foot|talus|tarsal/i]},
    {key:'foot_invev_l', pair:'Foot L — Inversion / Eversion',   side:'l', plane:'frontal',   neutral:0, min:-20,  max:35,  hints:[/foot|calcaneus|metatars|heel/i]},
    {key:'foot_invev_r', pair:'Foot R — Inversion / Eversion',   side:'r', plane:'frontal',   neutral:0, min:-20,  max:35,  hints:[/foot|calcaneus|metatars|heel/i]},
  ];

export const ACTION_CONFIG = (() => {
  const map = {};

  function axisFromPlane(plane) {
    if (plane === "sagittal") return "x";
    if (plane === "frontal") return "z";
    return "y"; // transverse
  }

  function boneFromSide(side) {
    if (side === "l") return "upperarm_L";
    if (side === "r") return "upperarm_R";
    return "spine01"; // trunk and cervical default
  }

  function add(list) {
    list.forEach(cfg => {
      map[cfg.key] = {
        key: cfg.key,
        label: cfg.pair,
        axis: axisFromPlane(cfg.plane),
        bone: boneFromSide(cfg.side),
        sign: cfg.invert ? -1 : 1,
        max: cfg.max
      };
    });
  }

  add(UPPER);
  add(LOWER);

  return map;
})();
window.ACTION_CONFIG = ACTION_CONFIG;

