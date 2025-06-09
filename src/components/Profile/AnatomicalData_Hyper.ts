// /src/components/Profile/AnatomicalData_Hyper.ts

// This interface defines the render data for each individual muscle part.
export interface MuscleRenderData {
  base: string[];
  detail?: string[];
  outline: string;
  textureId: "vertical-fiber" | "angled-fiber" | "fanned-fiber";
  parentUiGroup?: string;
}

// This map is the crucial link between the UI list (e.g., "Legs", "Back")
// and the numerous, detailed anatomical parts that should be highlighted.
export const UI_GROUP_TO_ANATOMY_MAP: { [uiGroup: string]: string[] } = {
  Legs: ["Quads", "Hamstrings", "Calves"],
  Chest: ["Chest"],
  Back: ["Trapezius", "Lats", "ErectorSpinae", "TeresMajor"],
  Shoulders: ["Shoulders"],
  Biceps: ["Biceps"],
  Triceps: ["TricepsLateralHead", "TricepsLongHead"],
  Core: [
    "AbdominisTopL",
    "AbdominisTopR",
    "AbdominisMidL",
    "AbdominisMidR",
    "AbdominisBotL",
    "AbdominisBotR",
    "AbdominisLower",
    "Obliques",
    "SerratusAnterior",
  ],
  Forearms: ["Brachioradialis"],
  Glutes: ["Glutes"],
};

// The complete and validated anatomical path data. All placeholders are removed.
export const ANATOMICAL_PATHS_HYPER: {
  front: MuscleViewGroup;
  back: MuscleViewGroup;
} = {
  // FRONT VIEW - REDRAWN FOR HIGH FIDELITY
  // =======================================================================
  front: {
    Shoulders: {
      base: [
        "M150,132 C135,128 115,145 105,170 C95,195 108,210 120,208 C135,198 145,180 148,162z",
        "M250,132 C265,128 285,145 295,170 C305,195 292,210 280,208 C265,198 255,180 252,162z",
      ],
      detail: [
        "M148,162 C130,172 115,195 122,206",
        "M252,162 C270,172 285,195 278,206",
      ],
      outline:
        "M150,132 C135,128 115,145 105,170 C95,195 108,210 120,208 C135,198 145,180 148,162z M250,132 C265,128 285,145 295,170 C305,195 292,210 280,208 C265,198 255,180 252,162z",
      textureId: "fanned-fiber",
    },
    // UPDATED: HYPER-REALISTIC CHEST RECONSTRUCTION v3
    Chest: {
      base: [
        // Left Pec: smaller, more defined shape
        "M198,148 C178,148,160,155,155,170 C152,185,154,205,162,228 C175,235,190,236,198,235 Z",
        // Right Pec: Mirror image
        "M202,148 C222,148,240,155,245,170 C248,185,246,205,238,228 C225,235,210,236,202,235 Z",
      ],
      detail: [
        // Clavicular head fibers (upper chest)
        "M198,155 C180,158,165,165,158,172",
        "M202,155 C220,158,235,165,242,172",
        // Sternal head fibers (lower chest)
        "M162,225 C175,230,198,232,198,232",
        "M238,225 C225,230,202,232,202,232",
        // Sternum to armpit line to show definition
        "M198,185 c-15,0,-30,-2,-40,-8",
        "M202,185 c15,0,30,-2,40,-8",
        // Central sternum line
        "M200,148 V 235",
      ],
      outline:
        "M198,148 C178,148,160,155,155,170 C152,185,154,205,162,228 C175,235,190,236,198,235 Z M202,148 C222,148,240,155,245,170 C248,185,246,205,238,228 C225,235,210,236,202,235 Z",
      textureId: "angled-fiber",
    },

    // START OF HYPER-REALISTIC CORE RECONSTRUCTION
    AbdominisTopL: {
      base: ["M198,235 C188,238 185,252 185,262 Q190,265 198,264 Z"],
      outline: "M198,235 C188,238 185,252 185,262 Q190,265 198,264 Z",
      textureId: "vertical-fiber",
    },
    AbdominisTopR: {
      base: ["M202,235 C212,238 215,252 215,262 Q210,265 202,264 Z"],
      outline: "M202,235 C212,238 215,252 215,262 Q210,265 202,264 Z",
      textureId: "vertical-fiber",
    },
    AbdominisMidL: {
      base: [
        "M198,268 Q190,267 186,266 C185,278 186,293 186,295 Q190,298 198,297 Z",
      ],
      outline:
        "M198,268 Q190,267 186,266 C185,278 186,293 186,295 Q190,298 198,297 Z",
      textureId: "vertical-fiber",
    },
    AbdominisMidR: {
      base: [
        "M202,268 Q210,267 214,266 C215,278 214,293 214,295 Q210,298 202,297 Z",
      ],
      outline:
        "M202,268 Q210,267 214,266 C215,278 214,293 214,295 Q210,298 202,297 Z",
      textureId: "vertical-fiber",
    },
    AbdominisBotL: {
      base: ["M198,301 Q190,299 187,298 C186.5,313 187,328 187,328 H198 Z"],
      outline: "M198,301 Q190,299 187,298 C186.5,313 187,328 187,328 H198 Z",
      textureId: "vertical-fiber",
    },
    AbdominisBotR: {
      base: ["M202,301 Q210,299 213,298 C213.5,313 213,328 213,328 H202 Z"],
      outline: "M202,301 Q210,299 213,298 C213.5,313 213,328 213,328 H202 Z",
      textureId: "vertical-fiber",
    },
    AbdominisLower: {
      base: [
        "M188,331 C188,336 195,340 200,340 C205,340 212,336 212,331 L200,334 Z",
      ],
      outline:
        "M188,331 C188,336 195,340 200,340 C205,340 212,336 212,331 L200,334 Z",
      textureId: "vertical-fiber",
    },
    Obliques: {
      base: [
        "M178,255 C165,280 170,328 185,330 C178,315 174,280 178,255z",
        "M222,255 C235,280 230,328 215,330 C222,315 226,280 222,255z",
      ],
      detail: [
        "M175,260 C170,290 178,320 184,328",
        "M225,260 C230,290 222,320 216,328",
      ],
      outline:
        "M178,255 C165,280 170,328 185,330 C178,315 174,280 178,255z M222,255 C235,280 230,328 215,330 C222,315 226,280 222,255z",
      textureId: "angled-fiber",
    },
    SerratusAnterior: {
      base: [
        "M160,230 L176,255 L170,260z M165,245 L178,268 L172,273z M170,262 L180,282 L175,285z",
        "M240,230 L224,255 L230,260z M235,245 L222,268 L228,273z M230,262 L220,282 L225,285z",
      ],
      outline:
        "M160,230 L176,255 L170,260z M165,245 L178,268 L172,273z M170,262 L180,282 L175,285z M240,230 L224,255 L230,260z M235,245 L222,268 L228,273z M230,262 L220,282 L225,285z",
      textureId: "fanned-fiber",
    },
    // GOD-TIER BICEPS - REDEFINED FOR REALISM
    Biceps: {
      base: [
        // Left Bicep: a fuller, more peaked shape
        "M120,215 C100,220 92,255 112,288 C113,291 120,292 122,290 C130,270 130,240 120,215z",
        // Right Bicep: mirror image
        "M280,215 C300,220 308,255 288,288 C287,291 280,292 278,290 C270,270 270,240 280,215z",
      ],
      detail: [
        // Fibers suggesting the peak and separation of heads
        "M117,225 C107,250 106,280 114,288", // Left outer contour
        "M283,225 C293,250 294,280 286,288", // Right outer contour
        "M120,220 C124,255 120,285 121,289", // Left inner contour
        "M280,220 C276,255 280,285 279,289", // Right inner contour
        "M107,230 C110,255 107,280 113,288", // Left detail
        "M293,230 C290,255 293,280 287,288", // Right detail
      ],
      outline:
        "M120,215 C100,220 92,255 112,288 C113,291 120,292 122,290 C130,270 130,240 120,215z M280,215 C300,220 308,255 288,288 C287,291 280,292 278,290 C270,270 270,240 280,215z",
      textureId: "vertical-fiber",
    },

    Brachioradialis: {
      base: [
        "M115,295 C105,305 100,350 112,380 l8,-4 c4,-30 4,-50 -8,-77z",
        "M285,295 C295,305 300,350 288,380 l-8,-4 c-4,-30 -4,-50 8,-77z",
      ],
      detail: ["M112,315 c-2,20 2,40 4,50", "M288,315 c2,20 -2,40 -4,50"],
      outline:
        "M115,295 C105,305 100,350 112,380 l8,-4 c4,-30 4,-50 -8,-77z M285,295 C295,305 300,350 288,380 l-8,-4 c-4,-30 -4,-50 8,-77z",
      textureId: "angled-fiber",
    },
    // HYPER-REALISTIC QUADS - VASTUS LATERALIS, RECTUS FEMORIS, VASTUS MEDIALIS
    Quads: {
      base: [
        // LEFT LEG
        // Vastus Lateralis (Outer Thigh): Long, sweeping muscle on the outside.
        "M188,390 C165,430 160,490 178,520 C179,480 182,430 190,392 Z",
        // Rectus Femoris (Center Thigh): The prominent, central muscle.
        "M190,392 C188,450 186,510 184,522 C194,512 195,450 192,392 Z",
        // Vastus Medialis (Inner Thigh): The "teardrop" muscle above the knee.
        "M192,470 C202,490 198,518 186,523 C192,510 195,490 192,470 Z",

        // RIGHT LEG (mirror)
        // Vastus Lateralis
        "M212,390 C235,430 240,490 222,520 C221,480 218,430 210,392 Z",
        // Rectus Femoris
        "M210,392 C212,450 214,510 216,522 C206,512 205,450 208,392 Z",
        // Vastus Medialis
        "M208,470 C198,490 202,518 214,523 C208,510 205,490 208,470 Z",
      ],
      detail: [
        // Details for definition and separation
        // Left Leg
        "M190,392 C185,450 182,515 180,520", // Division between Vastus Lateralis and Rectus Femoris
        "M192,470 C190,495 187,518 185,522", // Division for Vastus Medialis
        "M185,388 C195,450 194,515 188,523", // Path of the Sartorius muscle
        // Right Leg
        "M210,392 C215,450 218,515 220,520", // Division between Vastus Lateralis and Rectus Femoris
        "M208,470 C210,495 213,518 215,522", // Division for Vastus Medialis
        "M215,388 C205,450 206,515 212,523", // Path of the Sartorius muscle
        // Patellar Ligament/Tendon Area
        "M184,522 C188,528 192,528 195,522",
        "M216,522 C212,528 208,528 205,522",
      ],
      outline:
        "M188,390 C165,430 160,490 178,520 C182,525 188,525 186,523 C198,518 202,490 192,470 L192,392 Z M212,390 C235,430 240,490 222,520 C218,525 212,525 214,523 C202,518 198,490 208,470 L208,392 Z",
      textureId: "vertical-fiber",
    },
    Calves: {
      base: [
        "M185,525 C178,565 178,610 190,615 C188,580 185,550 185,525z",
        "M215,525 C222,565 222,610 210,615 C212,580 215,550 215,525z",
      ],
      detail: [
        "M188,530 C182,570 184,605 195,613",
        "M212,530 C218,570 216,605 205,613",
        "M200,525 V 615",
      ],
      outline:
        "M185,525 C178,565 178,610 190,615 C188,580 185,550 185,525z M215,525 C222,565 222,610 210,615 C212,580 215,550 215,525z",
      textureId: "vertical-fiber",
    },
  },

  back: {
    // UPDATED BACK - ENHANCED REALISM
    Shoulders: {
      base: [
        "M150,132 C135,128 115,145 105,170 C95,195 108,210 120,208 C135,198 145,180 148,162z",
        "M250,132 C265,128 285,145 295,170 C305,195 292,210 280,208 C265,198 255,180 252,162z",
      ],
      detail: [
        "M148,162 C130,172 115,195 122,206",
        "M252,162 C270,172 285,195 278,206",
      ],
      outline:
        "M150,132 C135,128 115,145 105,170 C95,195 108,210 120,208 C135,198 145,180 148,162z M250,132 C265,128 285,145 295,170 C305,195 292,210 280,208 C265,198 255,180 252,162z",
      textureId: "fanned-fiber",
    },
    Trapezius: {
      base: [
        "M200,125 C175,130 150,150 150,180 C160,240 185,280 200,290z",
        "M200,125 C225,130 250,150 250,180 C240,240 215,280 200,290z",
      ],
      detail: [
        "M200,130 C180,180 180,250 198,288",
        "M200,130 C220,180 220,250 202,288",
        "M160,185 c20,25 35,50 40,85",
        "M240,185 c-20,25 -35,50 -40,85",
      ],
      outline:
        "M200,125 C175,130 150,150 150,180 C160,240 185,280 200,290 L200,125z M200,125 C225,130 250,150 250,180 C240,240 215,280 200,290 L200,125z",
      textureId: "fanned-fiber",
    },

    Glutes: {
      base: [
        "M200,302 C185,300 160,310 160,345 C160,380 185,385 200,375z",
        "M200,302 C215,300 240,310 240,345 C240,380 215,385 200,375z",
      ],
      detail: [
        "M198,310 C180,325 168,350 165,375",
        "M202,310 C220,325 232,350 235,375",
        "M198,330 C185,345 170,365 165,375",
        "M202,330 C215,345 230,365 235,375",
        "M190,305 C175,325 165,355 162,375",
        "M210,305 C225,325 235,355 238,375",
      ],
      outline:
        "M200,302 C185,300 160,310 160,345 C160,380 185,385 200,375z M200,302 C215,300 240,310 240,345 C240,380 215,385 200,375z",
      textureId: "fanned-fiber",
    },
    TricepsLateralHead: {
      base: [
        "M100,210 C120,220 115,280 105,290z",
        "M300,210 C280,220 285,280 295,290z",
      ],
      detail: [
        "M104,225 C112,245 108,270 107,282",
        "M296,225 C288,245 292,270 293,282",
      ],
      outline:
        "M100,210 C120,220 115,280 105,290z M300,210 C280,220 285,280 295,290z",
      textureId: "fanned-fiber",
    },
    TricepsLongHead: {
      base: ["M125,210 c-10,30 -20,65 -10,85z", "M275,210 c10,30 20,65 10,85z"],
      detail: ["M118,220 c-2,25 0,50 4,65", "M282,220 c2,25 0,50 -4,65"],
      outline: "M125,210 c-10,30 -20,65 -10,85z M275,210 c10,30 20,65 10,85z",
      textureId: "vertical-fiber",
    },

    Brachioradialis: {
      base: [
        "M115,295 C105,305 100,350 112,380 l8,-4 c4,-30 4,-50 -8,-77z",
        "M285,295 C295,305 300,350 288,380 l-8,-4 c-4,-30 -4,-50 8,-77z",
      ],
      detail: ["M112,315 c-2,20 2,40 4,50", "M288,315 c2,20 -2,40 -4,50"],
      outline:
        "M115,295 C105,305 100,350 112,380 l8,-4 c4,-30 4,-50 -8,-77z M285,295 C295,305 300,350 288,380 l-8,-4 c-4,-30 -4,-50 8,-77z",
      textureId: "angled-fiber",
    },
    Hamstrings: {
      base: [
        "M185,388 C170,450 170,510 182,520 L195,520 C190,450 190,388 185,388z",
        "M215,388 C230,450 230,510 218,520 L205,520 C210,450 210,388 215,388z",
      ],
      detail: [
        "M188,395 C180,440 188,512 194,518",
        "M212,395 C220,440 212,512 206,518",
        "M194,395 C192,445 194,512 196,519",
        "M206,395 C208,445 206,512 204,519",
      ],
      outline:
        "M185,388 C170,450 170,510 182,520 L195,520 C190,450 190,388 185,388z M215,388 C230,450 230,510 218,520 L205,520 C210,450 210,388 215,388z",
      textureId: "vertical-fiber",
    },
    Calves: {
      base: [
        "M185,525 C178,565 178,610 190,615 C188,580 185,550 185,525z",
        "M215,525 C222,565 222,610 210,615 C212,580 215,550 215,525z",
      ],
      detail: [
        "M188,530 C182,570 184,605 195,613",
        "M212,530 C218,570 216,605 205,613",
        "M200,525 V 615",
      ],
      outline:
        "M185,525 C178,565 178,610 190,615 C188,580 185,550 185,525z M215,525 C222,565 222,610 210,615 C212,580 215,550 215,525z",
      textureId: "vertical-fiber",
    },
  },
};

export const MUSCLE_DATA: {
  [key: string]: { name: string; colorVar: string };
} = {
  Chest: { name: "Chest", colorVar: "--color-muscle-chest" },
  Back: { name: "Back", colorVar: "--color-muscle-back" },
  Shoulders: { name: "Shoulders", colorVar: "--color-muscle-shoulders" },
  Biceps: { name: "Biceps", colorVar: "--color-muscle-biceps" },
  Triceps: { name: "Triceps", colorVar: "--color-muscle-triceps" },
  Legs: { name: "Legs", colorVar: "--color-muscle-legs" },
  Glutes: { name: "Glutes", colorVar: "--color-muscle-glutes" },
  Core: { name: "Core", colorVar: "--color-muscle-core" },
  Forearms: { name: "Forearms", colorVar: "--color-muscle-arms" },
};

export const ALL_MUSCLE_GROUPS_UI = Object.keys(MUSCLE_DATA);
// In AnatomicalData_Hyper.ts, ensure this type is exported

export interface MuscleViewGroup {
  // Add 'export'
  [group: string]: MuscleRenderData;
}
