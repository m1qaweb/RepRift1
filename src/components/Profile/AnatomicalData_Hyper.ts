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
  Legs: [
    "VastusLateralis",
    "RectusFemoris",
    "VastusMedialis",
    "Sartorius",
    "Adductors",
    "TibialisAnterior",
    "GastrocnemiusFrontal",
    "Hamstrings",
    "Calves",
  ],
  Chest: ["Chest"],
  Back: ["Trapezius", "Lats", "ErectorSpinae"],
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
  Forearms: ["Brachioradialis", "ForearmFlexors"],
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
        "M150,132 C120,130 98,155 100,205 C115,195 135,175 148,162z",
        "M250,132 C280,130 302,155 300,205 C285,195 265,175 252,162z",
      ],
      detail: [
        "M148,162 C150,180 145,195 135,200z",
        "M252,162 C250,180 255,195 265,200z",
      ],
      outline:
        "M150,132 C120,130 98,155 100,205 L140,208 C145,180 149,150 150,132z M250,132 C280,130 302,155 300,205 L260,208 C255,180 251,150 250,132z",
      textureId: "fanned-fiber",
    },
    // UPDATED: Reworked Chest paths for a more detailed, sculpted look with separation.
    Chest: {
      base: [
        "M198,145 C175,150 155,160 152,180 L150,215 C165,230 198,232 198,232z",

        "M202,145 C225,150 245,160 248,180 L250,215 C235,230 202,232 202,232z",
      ],
      detail: [
        "M198,168 C185,172 165,175 158,180",

        "M202,168 C215,172 235,175 242,180",

        "M152,218 C170,226 198,226 198,226",

        "M248,218 C230,226 202,226 202,226",
      ],
      outline:
        "M198,145 C175,150 155,160 152,180 L150,215 C165,230 198,232 198,232z M202,145 C225,150 245,160 248,180 L250,215 C235,230 202,232 202,232z",
      textureId: "angled-fiber",
    },

    // START OF HYPER-REALISTIC CORE RECONSTRUCTION
    AbdominisTopL: {
      base: ["M198,235 C188,238 185,255 185,263 Q190,266 198,265 Z"],
      outline: "M198,235 C188,238 185,255 185,263 Q190,266 198,265 Z",
      textureId: "vertical-fiber",
    },
    AbdominisTopR: {
      base: ["M202,235 C212,238 215,255 215,263 Q210,266 202,265 Z"],
      outline: "M202,235 C212,238 215,255 215,263 Q210,266 202,265 Z",
      textureId: "vertical-fiber",
    },
    AbdominisMidL: {
      base: [
        "M198,269 Q190,268 186,267 C185,280 186,295 186,296 Q190,299 198,298 Z",
      ],
      outline:
        "M198,269 Q190,268 186,267 C185,280 186,295 186,296 Q190,299 198,298 Z",
      textureId: "vertical-fiber",
    },
    AbdominisMidR: {
      base: [
        "M202,269 Q210,268 214,267 C215,280 214,295 214,296 Q210,299 202,298 Z",
      ],
      outline:
        "M202,269 Q210,268 214,267 C215,280 214,295 214,296 Q210,299 202,298 Z",
      textureId: "vertical-fiber",
    },
    AbdominisBotL: {
      base: ["M198,302 Q190,300 187,299 C186.5,315 187,330 187,330 H198 Z"],
      outline: "M198,302 Q190,300 187,299 C186.5,315 187,330 187,330 H198 Z",
      textureId: "vertical-fiber",
    },
    AbdominisBotR: {
      base: ["M202,302 Q210,300 213,299 C213.5,315 213,330 213,330 H202 Z"],
      outline: "M202,302 Q210,300 213,299 C213.5,315 213,330 213,330 H202 Z",
      textureId: "vertical-fiber",
    },
    AbdominisLower: {
      base: [
        "M188,333 C188,338 195,342 200,342 C205,342 212,338 212,333 L200,336 Z",
      ],
      outline:
        "M188,333 C188,338 195,342 200,342 C205,342 212,338 212,333 L200,336 Z",
      textureId: "vertical-fiber",
    },
    Obliques: {
      base: [
        "M178,255 C168,280 172,328 185,330 L178,325 C172,300 172,270 178,255z",
        "M222,255 C232,280 228,328 215,330 L222,325 C228,300 228,270 222,255z",
      ],
      outline:
        "M178,255 C168,280 172,328 185,330 L178,325 C172,300 172,270 178,255z M222,255 C232,280 228,328 215,330 L222,325 C228,300 228,270 222,255z",
      textureId: "angled-fiber",
    },
    SerratusAnterior: {
      base: [
        "M160,230 L176,255 L170,260z M165,245 L178,268 L172,273z",
        "M240,230 L224,255 L230,260z M235,245 L222,268 L228,273z",
      ],
      outline:
        "M160,230 L176,255 L170,260z M165,245 L178,268 L172,273z M240,230 L224,255 L230,260z M235,245 L222,268 L228,273z",
      textureId: "fanned-fiber",
    },
    // GOD-TIER BICEPS
    Biceps: {
      base: [
        "M128,215 C106,218 96,255 123,290 C125,292 128,290 128,290z",

        "M272,215 C294,218 304,255 277,290 C275,292 272,290 272,290z",
      ],
      detail: [
        "M126,225 C116,245 118,280 122,288",
        "M274,225 C284,245 282,280 278,288",
        "M125,230 Q130,255 124,285",
        "M275,230 Q270,255 276,285",
      ],
      outline:
        "M128,215 C106,218 96,255 123,290 C125,292 128,290 128,290z M272,215 C294,218 304,255 277,290 C275,292 272,290 272,290z",
      textureId: "vertical-fiber",
    },

    Brachioradialis: {
      base: [
        "M132,295 c-12,10 -17,48 -14,93 l15,-5 c5,-35 8,-58 -16,-88z",
        "M268,295 c12,10 17,48 14,93 l-15,-5 c-5,-35 -8,-58 16,-88z",
      ],
      detail: ["M124,318 c-1,20 1,45 3,55", "M276,318 c1,20 -1,45 -3,55"],
      outline:
        "M132,295 c-12,10 -17,48 -14,93 l15,-5 c5,-35 8,-58 -16,-88z M268,295 c12,10 17,48 14,93 l-15,-5 c-5,-35 -8,-58 16,-88z",
      textureId: "angled-fiber",
    },

    ForearmFlexors: {
      base: [
        "M134,296 c8,15 4,55 -3,92 l13,-5 c-2,-40 0,-65 -10,-87z",
        "M266,296 c-8,15 -4,55 3,92 l-13,-5 c2,-40 0,-65 10,-87z",
      ],
      detail: ["M123,320 c15,15 10,50 15,65", "M277,320 c-15,15 -10,50 -15,65"],
      outline:
        "M134,296 c8,15 4,55 -3,92 l13,-5 c-2,-40 0,-65 -10,-87z M266,296 c-8,15 -4,55 3,92 l-13,-5 c2,-40 0,-65 10,-87z",
      textureId: "vertical-fiber",
    },
    VastusLateralis: {
      base: [
        "M178,340 C150,390 145,520 170,555 l12,0 C175,500 174,400 181,340z",
        "M222,340 C250,390 255,520 230,555 l-12,0 C225,500 226,400 219,340z",
      ],
      detail: [
        "M175,360 c-5,50 0,120 5,160",
        "M178,390 c-3,40 2,80 4,110",
        "M225,360 c5,50 0,120 -5,160",
        "M222,390 c3,40 -2,80 -4,110",
      ],
      outline:
        "M178,340 C150,390 145,520 170,555 l12,0 C175,500 174,400 181,340z M222,340 C250,390 255,520 230,555 l-12,0 C225,500 226,400 219,340z",
      textureId: "angled-fiber",
    },
    RectusFemoris: {
      base: ["M183,342 C185,420 188,555 200,555 C212,555 215,420 217,342z"],
      detail: ["M192,360 q-2,90 0,185", "M208,360 q2,90 0,185"],
      outline: "M183,342 C185,420 188,555 200,555 C212,555 215,420 217,342z",
      textureId: "vertical-fiber",
    },
    VastusMedialis: {
      base: [
        "M203,475 C220,480 225,550 215,558 C212,530 205,490 203,475z",
        "M197,475 C180,480 175,550 185,558 C188,530 195,490 197,475z",
      ],
      outline:
        "M203,475 C220,480 225,550 215,558 C212,530 205,490 203,475z M197,475 C180,480 175,550 185,558 C188,530 195,490 197,475z",
      textureId: "fanned-fiber",
    },
    Sartorius: {
      base: [
        "M180,335 C175,400 188,500 194,558 L199,555 C192,500 182,400 184,335z",
        "M220,335 C225,400 212,500 206,558 L201,555 C208,500 218,400 216,335z",
      ],
      outline:
        "M180,335 C175,400 188,500 194,558 L199,555 C192,500 182,400 184,335z M220,335 C225,400 212,500 206,558 L201,555 C208,500 218,400 216,335z",
      textureId: "angled-fiber",
    },
    Adductors: {
      base: [
        "M203,345 C208,400 208,470 208,475 L200,470z",
        "M197,345 C192,400 192,470 192,475 L200,470z",
      ],
      outline:
        "M203,345 C208,400 208,470 208,475 L200,470z M197,345 C192,400 192,470 192,475 L200,470z",
      textureId: "fanned-fiber",
    },
    TibialisAnterior: {
      base: [
        "M182,565 c0,25 -2,85 0,88 l15,0 c-2,-20 0,-60 0,-88z",
        "M218,565 c0,25 2,85 0,88 l-15,0 c2,-20 0,-60 0,-88z",
      ],
      detail: ["M188,575 c-2,20 0,60 1,75", "M212,575 c2,20 0,60 -1,75"],
      outline:
        "M182,565 c0,25 -2,85 0,88 l15,0 c-2,-20 0,-60 0,-88z M218,565 c0,25 2,85 0,88 l-15,0 c2,-20 0,-60 0,-88z",
      textureId: "vertical-fiber",
    },
    GastrocnemiusFrontal: {
      base: [
        "M198,565 C192,600 190,650 195,655 L200,652z",
        "M202,565 C208,600 210,650 205,655 L200,652z",
      ],
      outline:
        "M198,565 C192,600 190,650 195,655 L200,652z M202,565 C208,600 210,650 205,655 L200,652z",
      textureId: "fanned-fiber",
    },

    Calves: {
      base: [
        "M185,560 C180,600 175,640 190,640z",
        "M215,560 C220,600 225,640 210,640z",
      ],
      detail: [
        "M188,560 C185,600 182,635 195,635z",
        "M212,560 C215,600 218,635 205,635z",
      ],
      outline:
        "M185,560 C175,600 175,640 190,640z M215,560 C225,600 225,640 210,640z",
      textureId: "vertical-fiber",
    },
  },

  back: {
    Shoulders: {
      base: [
        "M150,132 C120,130 98,155 100,205 C115,195 135,175 148,162z",
        "M250,132 C280,130 302,155 300,205 C285,195 265,175 252,162z",
      ],

      outline:
        "M150,132 C120,130 98,155 100,205 L140,208 C145,180 149,150 150,132z M250,132 C280,130 302,155 300,205 L260,208 C255,180 251,150 250,132",
      textureId: "fanned-fiber",
    },
    Trapezius: {
      base: [
        "M200,135 L200,240 C180,240 170,180 180,135z",
        "M200,135 L200,240 C220,240 230,180 220,135z",
      ],
      outline:
        "M180,135 C 170,180 180,240 200,240 V 135 H 220 C 230,180 220,240 200,240 V 135 H 180 z",
      textureId: "fanned-fiber",
    },
    Lats: {
      base: [
        "M178,245 C170,280 180,310 198,300z",
        "M222,245 C230,280 220,310 202,300z",
      ],
      outline:
        "M178,245 C170,280 180,310 198,300 L202,300 C220,310 230,280 222,245z",
      textureId: "fanned-fiber",
    },
    ErectorSpinae: {
      base: [
        "M198,240 L198,300 L200,300 L200,240z",
        "M202,240 L202,300 L200,300 L200,240z",
      ],
      outline: "M198,240 L198,300 H 202 V 240z",
      textureId: "vertical-fiber",
    },
    Glutes: {
      base: [
        "M200,302 C170,305 162,370 200,370z",
        "M200,302 C230,305 238,370 200,370z",
      ],
      outline: "M200,302 C162,302 162,370 200,370 C 238,370 238,302 200,302z",
      textureId: "fanned-fiber",
    },
    TricepsLateralHead: {
      base: [
        "M112,225 C132,235 125,295 116,305z",
        "M288,225 C268,235 275,295 284,305z",
      ],
      detail: [
        "M116,240 C121,265 116,288 118,298",
        "M284,240 C279,265 284,288 282,298",
      ],
      outline:
        "M112,225 C132,235 125,295 116,305z M288,225 C268,235 275,295 284,305z",
      textureId: "fanned-fiber",
    },
    TricepsLongHead: {
      base: ["M132,225 c-12,25 -22,60 -12,80z", "M268,225 c12,25 22,60 12,80z"],
      detail: ["M126,235 c0,25 -2,45 2,60", "M274,235 c0,25 2,45 -2,60"],
      outline: "M132,225 c-12,25 -22,60 -12,80z M268,225 c12,25 22,60 12,80z",
      textureId: "vertical-fiber",
    },

    ForearmFlexors: {
      base: [
        "M134,296 c8,15 4,55 -3,92 l13,-5 c-2,-40 0,-65 -10,-87z",
        "M266,296 c-8,15 -4,55 3,92 l-13,-5 c2,-40 0,-65 10,-87z",
      ],
      detail: ["M123,320 c15,15 10,50 15,65", "M277,320 c-15,15 -10,50 -15,65"],
      outline:
        "M134,296 c8,15 4,55 -3,92 l13,-5 c-2,-40 0,-65 -10,-87z M266,296 c-8,15 -4,55 3,92 l-13,-5 c2,-40 0,-65 10,-87z",
      textureId: "vertical-fiber",
    },
    Brachioradialis: {
      base: [
        "M132,295 c-12,10 -17,48 -14,93 l15,-5 c5,-35 8,-58 -16,-88z",
        "M268,295 c12,10 17,48 14,93 l-15,-5 c-5,-35 -8,-58 16,-88z",
      ],
      detail: ["M124,318 c-1,20 1,45 3,55", "M276,318 c1,20 -1,45 -3,55"],
      outline:
        "M132,295 c-12,10 -17,48 -14,93 l15,-5 c5,-35 8,-58 -16,-88z M268,295 c12,10 17,48 14,93 l-15,-5 c-5,-35 -8,-58 16,-88z",
      textureId: "angled-fiber",
    },
    Hamstrings: {
      base: [
        "M185,375 C175,450 170,540 182,550 L195,550 C190,450 190,375 185,375z",
        "M215,375 C225,450 230,540 218,550 L205,550 C210,450 210,375 215,375z",
      ],
      outline:
        "M185,375 C170,480 170,550 182,550 H 195 C 190,450 190,375 185,375z M215,375 C230,480 230,550 218,550 H 205 C 210,450 210,375 215,375z",
      textureId: "vertical-fiber",
    },
    Calves: {
      base: [
        "M185,560 C180,600 175,640 190,640z",
        "M215,560 C220,600 225,640 210,640z",
      ],
      detail: [
        "M188,560 C185,600 182,635 195,635z",
        "M212,560 C215,600 218,635 205,635z",
      ],
      outline:
        "M185,560 C175,600 175,640 190,640z M215,560 C225,600 225,640 210,640z",
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
// ForearmFlexors: {
//   base: [
//     "M100,246 c8,15 4,55 -3,92 l13,-5 c-2,-40 0,-65 -10,-87z",
//     "M100,296 c-8,15 -2,55 3,92 l-13,-5 c2,-40 0,-65 10,-87z",
//   ],
//   detail: ["M123,220 c5,15 10,50 15,65", "M277,320 c-15,15 -10,50 -15,65"],
//   outline:
//     "M132,290 c0,23 0,1 -9,92 l20,-0.2 c-2,-20 0,-25 -12,-80z M266,296 c-8,15 -4,55 3,92 l-13,-5 c2,-40 0,-65 10,-87z",
//   textureId: "vertical-fiber",
// },
// Brachioradialis: {
//   base: [
//     "M132,295 c-12,10 -17,48 -14,93 l15,-5 c5,-35 8,-58 -16,-88z",
//     "M268,295 c12,10 17,48 14,93 l-15,-5 c-5,-35 -8,-58 16,-88z",
//   ],
//   detail: ["M124,318 c-1,20 1,45 3,55", "M276,318 c1,20 -1,45 -3,55"],
//   outline:
//     "M132,295 c-2,10 -20,48 -8,93 l10,-9 c5,-35 8,-58 -16,-88z M268,295 c12,10 17,48 14,93 l-15,-5 c-5,-35 -8,-58 16,-88z",
//   textureId: "angled-fiber",
// },
