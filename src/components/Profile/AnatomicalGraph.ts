// src/components/Profile/AnatomicalGraph.ts

export const ANATOMICAL_GRAPH = {
  nodes: {
    // This new layout adopts a more "heroic" or "V-taper" physique,
    // characterized by broad shoulders, a wide back, and a narrow waist.
    // The arms and legs are repositioned for a more dynamic and natural stance.

    // Torso & Center-line
    n_neck: [200, 145],
    n_cervical: [200, 160],
    n_solar: [200, 240],
    n_abs: [200, 280],
    n_pelvis: [200, 330],

    // Upper Body
    n_pec_l_1: [140, 190],
    n_pec_l_2: [150, 230],
    n_pec_r_1: [260, 190],
    n_pec_r_2: [250, 230],
    n_trap_l: [160, 170],
    n_trap_r: [240, 170],
    n_lat_l: [140, 260],
    n_lat_r: [260, 260],

    // Arms
    n_shoulder_l: [100, 165],
    n_shoulder_r: [300, 165],
    n_bicep_l: [110, 250],
    n_bicep_r: [290, 250],
    n_tricep_l: [125, 290],
    n_tricep_r: [275, 290],
    n_forearm_l: [100, 350],
    n_forearm_r: [300, 350],

    // Legs
    n_glute_l: [165, 360],
    n_glute_r: [235, 360],
    n_quad_l: [160, 450],
    n_quad_r: [240, 450],
    n_ham_l: [165, 490],
    n_ham_r: [235, 490],
    n_calf_l: [160, 580],
    n_calf_r: [240, 580],
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
