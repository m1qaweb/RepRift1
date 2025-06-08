// src/components/Profile/AnatomicalGraph.ts

export const ANATOMICAL_GRAPH = {
  nodes: {
    // TORSO & CENTER-LINE: Unchanged
    n_neck: [200, 145],
    n_cervical: [200, 160],
    n_solar: [200, 240],
    n_abs: [200, 280],
    n_pelvis: [200, 330],
    n_pec_l_1: [170, 180],
    n_pec_l_2: [165, 220],
    n_pec_r_1: [230, 180],
    n_pec_r_2: [235, 220],
    n_trap_l: [180, 170],
    n_trap_r: [220, 170],
    n_lat_l: [170, 250],
    n_lat_r: [230, 250],

    n_shoulder_l: [115, 160], // Was 155
    n_shoulder_r: [285, 160], // Was 245

    n_bicep_l: [95, 230], // Was 135
    n_bicep_r: [305, 230], // Was 265

    n_tricep_l: [90, 270], // Was 130
    n_tricep_r: [310, 270], // Was 270

    n_forearm_l: [85, 330], // Was 125
    n_forearm_r: [315, 330], // Was 275

    // LEGS: Unchanged
    n_glute_l: [175, 360],
    n_glute_r: [225, 360],
    n_quad_l: [170, 450],
    n_quad_r: [230, 450],
    n_ham_l: [170, 480],
    n_ham_r: [230, 480],
    n_calf_l: [165, 580],
    n_calf_r: [235, 580],
  },

  // NOTE: edges, groups, and views are structurally correct and do not need to be changed.
  // The system relies on this stable definition.
  edges: [
    ["n_neck", "n_cervical"],
    ["n_cervical", "n_solar"],
    ["n_solar", "n_abs"],
    ["n_abs", "n_pelvis"],
    ["n_cervical", "n_shoulder_l"],
    ["n_cervical", "n_shoulder_r"],
    ["n_shoulder_l", "n_bicep_l"],
    ["n_shoulder_r", "n_bicep_r"],
    ["n_pec_l_1", "n_shoulder_l"],
    ["n_pec_r_1", "n_shoulder_r"],
    ["n_pec_l_1", "n_pec_l_2"],
    ["n_pec_r_1", "n_pec_r_2"],
    ["n_cervical", "n_trap_l"],
    ["n_cervical", "n_trap_r"],
    ["n_trap_l", "n_lat_l"],
    ["n_trap_r", "n_lat_r"],
    ["n_solar", "n_lat_l"],
    ["n_solar", "n_lat_r"],
    ["n_bicep_l", "n_tricep_l"],
    ["n_bicep_r", "n_tricep_r"],
    ["n_tricep_l", "n_forearm_l"],
    ["n_tricep_r", "n_forearm_r"],
    ["n_pelvis", "n_glute_l"],
    ["n_pelvis", "n_glute_r"],
    ["n_glute_l", "n_quad_l"],
    ["n_glute_r", "n_quad_r"],
    ["n_glute_l", "n_ham_l"],
    ["n_glute_r", "n_ham_r"],
    ["n_quad_l", "n_calf_l"],
    ["n_ham_l", "n_calf_l"],
    ["n_quad_r", "n_calf_r"],
    ["n_ham_r", "n_calf_r"],
  ],
  groups: {
    Shoulders: ["n_shoulder_l", "n_shoulder_r"],
    Chest: ["n_pec_l_1", "n_pec_l_2", "n_pec_r_1", "n_pec_r_2"],
    Back: ["n_trap_l", "n_trap_r", "n_lat_l", "n_lat_r"],
    Biceps: ["n_bicep_l", "n_bicep_r"],
    Triceps: ["n_tricep_l", "n_tricep_r"],
    Forearms: ["n_forearm_l", "n_forearm_r"],
    Core: ["n_solar", "n_abs"],
    Glutes: ["n_glute_l", "n_glute_r"],
    Legs: [
      "n_quad_l",
      "n_quad_r",
      "n_ham_l",
      "n_ham_r",
      "n_calf_l",
      "n_calf_r",
    ],
  },
  views: {
    front: ["Shoulders", "Chest", "Biceps", "Forearms", "Core", "Legs"],
    back: ["Shoulders", "Back", "Triceps", "Forearms", "Glutes", "Legs"],
  },
} as const;

export type UIGroup = keyof typeof ANATOMICAL_GRAPH.groups;
