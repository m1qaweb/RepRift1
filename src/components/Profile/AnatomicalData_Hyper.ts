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
    // TAPERED CHEST - FULL UPPER, STREAMLINED LOWER
    Chest: {
      base: [
        // LEFT PEC: Upper section remains broad, lower section is tighter.
        "M196,152 C175,155, 160,165, 155,180 C152,200, 165,230, 196,230 Z",
        // RIGHT PEC: Mirror image
        "M204,152 C225,155, 240,165, 245,180 C248,200, 235,230, 204,230 Z",
      ],
      detail: [
        // Upper clavicular fibers (unchanged)
        "M196,158 C180,162, 165,175, 157,185",
        "M204,158 C220,162, 235,175, 243,185",
        // Tighter sternal fibers for a less bulky lower chest
        "M196,195 C178,198, 168,215, 168,225",
        "M204,195 C222,198, 232,215, 232,225",
        // Lower contour line adjusted for new shape
        "M168,225 C180,230, 196,230, 196,230",
        "M232,225 C220,230, 204,230, 204,230",
        // Center sternum line, shortened slightly
        "M200,152 V 230",
      ],
      outline:
        "M196,152 C175,155, 160,165, 155,180 C152,200, 165,230, 196,230 Z M204,152 C225,155, 240,165, 245,180 C248,200, 235,230, 204,230 Z",
      textureId: "angled-fiber",
    },

    // START OF HYPER-REALISTIC CORE RECONSTRUCTION - REPOSITIONED
    AbdominisTopL: {
      base: ["M198,245 C188,248 185,262 185,272 Q190,275 198,274 Z"],
      outline: "M198,245 C188,248 185,262 185,272 Q190,275 198,274 Z",
      textureId: "vertical-fiber",
    },
    AbdominisTopR: {
      base: ["M202,245 C212,248 215,262 215,272 Q210,275 202,274 Z"],
      outline: "M202,245 C212,248 215,262 215,272 Q210,275 202,274 Z",
      textureId: "vertical-fiber",
    },
    AbdominisMidL: {
      base: [
        "M198,278 Q190,277 186,276 C185,288 186,303 186,305 Q190,308 198,307 Z",
      ],
      outline:
        "M198,278 Q190,277 186,276 C185,288 186,303 186,305 Q190,308 198,307 Z",
      textureId: "vertical-fiber",
    },
    AbdominisMidR: {
      base: [
        "M202,278 Q210,277 214,276 C215,288 214,303 214,305 Q210,308 202,307 Z",
      ],
      outline:
        "M202,278 Q210,277 214,276 C215,288 214,303 214,305 Q210,308 202,307 Z",
      textureId: "vertical-fiber",
    },
    AbdominisBotL: {
      base: ["M198,311 Q190,309 187,308 C186.5,323 187,338 187,338 H198 Z"],
      outline: "M198,311 Q190,309 187,308 C186.5,323 187,338 187,338 H198 Z",
      textureId: "vertical-fiber",
    },
    AbdominisBotR: {
      base: ["M202,311 Q210,309 213,308 C213.5,323 213,338 213,338 H202 Z"],
      outline: "M202,311 Q210,309 213,308 C213.5,323 213,338 213,338 H202 Z",
      textureId: "vertical-fiber",
    },
    AbdominisLower: {
      base: [
        "M188,341 C188,346 195,350 200,350 C205,350 212,346 212,341 L200,344 Z",
      ],
      outline:
        "M188,341 C188,346 195,350 200,350 C205,350 212,346 212,341 L200,344 Z",
      textureId: "vertical-fiber",
    },
    Obliques: {
      base: [
        "M178,265 C165,290 170,338 185,340 C178,325 174,290 178,265z",
        "M222,265 C235,290 230,338 215,340 C222,325 226,290 222,265z",
      ],
      detail: [
        "M175,270 C170,300 178,330 184,338",
        "M225,270 C230,300 222,330 216,338",
      ],
      outline:
        "M178,265 C165,290 170,338 185,340 C178,325 174,290 178,265z M222,265 C235,290 230,338 215,340 C222,325 226,290 222,265z",
      textureId: "angled-fiber",
    },
    SerratusAnterior: {
      base: [
        "M160,240 L176,265 L170,270z M165,255 L178,278 L172,283z M170,272 L180,292 L175,295z",
        "M240,240 L224,265 L230,270z M235,255 L222,278 L228,283z M230,272 L220,292 L225,295z",
      ],
      outline:
        "M160,240 L176,265 L170,270z M165,255 L178,278 L172,283z M170,272 L180,292 L175,295z M240,240 L224,265 L230,270z M235,255 L222,278 L228,283z M230,272 L220,292 L225,295z",
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
        "M120,295 C113,305 110,340 118,370 l6,-4 c3,-25 3,-45 -7,-67z",
        "M280,295 C287,305 290,340 282,370 l-6,-4 c-3,-25 -3,-45 7,-67z",
      ],
      detail: ["M118,315 c-1,15 1,35 2,40", "M282,315 c1,15 -1,35 -2,40"],
      outline:
        "M120,295 C113,305 110,340 118,370 l6,-4 c3,-25 3,-45 -7,-67z M280,295 C287,305 290,340 282,370 l-6,-4 c-3,-25 -3,-45 7,-67z",
      textureId: "angled-fiber",
    },
    // ELITE-TIER QUADS - REPOSITIONED FOR WIDER STANCE
    Quads: {
      base: [
        // LEFT LEG (Shifted Left/Up)
        "M185,360 C155,410 150,470 170,500 C175,450 180,400 187,360 Z",
        "M187,360 C185,430 183,490 181,502 C191,492 193,430 189,360 Z",
        "M189,430 C200,455 195,495 183,503 C190,485 193,460 189,430 Z",

        // RIGHT LEG (Shifted Right/Up)
        "M215,360 C245,410 250,470 230,500 C225,450 220,400 213,360 Z",
        "M213,360 C215,430 217,490 219,502 C209,492 207,430 211,360 Z",
        "M211,430 C200,455 205,495 217,503 C210,485 207,460 211,430 Z",
      ],
      detail: [
        // LEFT LEG - Adjusted definition lines
        "M187,360 C177,425 173,490 171,498",
        "M189,430 C187,460 184,495 182,502",
        "M175,358 C187,430 185,490 179,503",
        "M188,360 L 188 500",

        // RIGHT LEG - Adjusted definition lines
        "M213,360 C223,425 227,490 229,498",
        "M211,430 C213,460 216,495 218,502",
        "M225,358 C213,430 215,490 221,503",
        "M212,360 L 212 500",

        // Patellar tendon and knee complexity
        "M181,502 C185,508 189,508 192,502",
        "M219,502 C215,508 211,508 208,502",
      ],
      outline:
        "M185,360 C155,410 150,470 170,500 C165,505 185,505 190,503 C200,470 200,420 189,360 Z M215,360 C245,410 250,470 230,500 C235,505 215,505 210,503 C200,470 200,420 211,360 Z",
      textureId: "vertical-fiber",
    },
    // GOD-TIER CALVES - SCULPTED GASTROCNEMIUS & SOLEUS
    Calves: {
      base: [
        // LEFT LEG
        // Gastrocnemius, Medial Head (inner calf)
        "M188, 515 C 200, 550, 196, 590, 187, 605 L 186, 520 Z",
        // Gastrocnemius, Lateral Head (outer calf)
        "M182, 515 C 170, 550, 174, 590, 183, 605 L 184, 520 Z",
        // Soleus (peeking out from the sides)
        "M173, 570 C 170, 590, 175, 605, 181, 608 Z",

        // RIGHT LEG (mirror)
        // Gastrocnemius, Medial Head
        "M212, 515 C 200, 550, 204, 590, 213, 605 L 214, 520 Z",
        // Gastrocnemius, Lateral Head
        "M218, 515 C 230, 550, 226, 590, 217, 605 L 216, 520 Z",
        // Soleus
        "M227, 570 C 230, 590, 225, 605, 219, 608 Z",
      ],
      detail: [
        // LEFT LEG - Definition lines for the classic 'diamond' shape
        "M185, 520 V 600", // Central division of Gastrocnemius
        "M178, 565 c -3, 15 0, 30 4, 38", // Detail on the Soleus/Lateral Gastrocnemius
        "M185, 605 L 185, 620", // Achilles Tendon

        // RIGHT LEG - Definition lines
        "M215, 520 V 600", // Central division of Gastrocnemius
        "M222, 565 c 3, 15 0, 30 -4, 38", // Detail on the Soleus/Lateral Gastrocnemius
        "M215, 605 L 215, 620", // Achilles Tendon
      ],
      outline:
        "M188, 515 C 200, 550, 196, 590, 187, 605 L185,620 L183,605 C 174,590 170,550 182,515 Z M212, 515 C 200,550 204,590 213,605 L215,620 L217,605 C 226,590 230,550 218,515 Z",
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
