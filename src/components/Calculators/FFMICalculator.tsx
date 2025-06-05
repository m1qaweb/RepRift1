// /src/components/Calculators/FFMICalculator.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Button from "../UI/Button"; // Assuming Button is UI/Button
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ScaleIcon } from "@heroicons/react/24/outline";
import { debounce } from "../../utils/helpers";

// --- Types and Data ---
type UnitsSystem = "imperial" | "metric";
type Sex = "male" | "female";
type FFMIFormInputs = {
  sex: Sex;
  weight: number;
  heightCm: number;
  bodyFat: number;
  displayFeet?: number;
  displayInches?: number;
};
interface FFMIInterpretationDetail {
  label: string;
  description: string;
  color: string;
  textColor?: string;
  scoreMin: number;
  scoreMax: number;
}
interface FFMIResult {
  lbmKg: number;
  lbmLbs: number;
  ffmi: number;
  interpretation: string;
  details: FFMIInterpretationDetail;
  bodyFat: number;
}

const referenceScaleColors: { [key: string]: string } = {
  "Below Average": "#EF4444", // red-500
  Average: "#F59E0B", // amber-500
  "Above Average": "#FACC15", // yellow-400
  Excellent: "#84CC16", // lime-500
  Superior: "#22C55E", // green-500
  Suspicious: "#10B981", // teal-500
  "Unlikely Natural": "#6366F1", // indigo-500
};

const ffmiScales: Record<Sex, Array<FFMIInterpretationDetail>> = {
  male: [
    {
      scoreMin: 0,
      scoreMax: 16,
      label: "Below Average",
      description: "Significantly below average muscle mass.",
      color: referenceScaleColors["Below Average"],
      textColor: "#FFFFFF",
    },
    {
      scoreMin: 16,
      scoreMax: 18,
      label: "Average",
      description: "Average muscle mass for the general population.",
      color: referenceScaleColors["Average"],
      textColor: "#FFFFFF",
    },
    {
      scoreMin: 18,
      scoreMax: 20,
      label: "Above Average",
      description: "Typical range for recreationally active individuals.",
      color: referenceScaleColors["Above Average"],
      textColor: "#1F2937",
    },
    {
      scoreMin: 20,
      scoreMax: 22,
      label: "Excellent",
      description:
        "Good level of muscularity, often seen in dedicated trainees.",
      color: referenceScaleColors["Excellent"],
      textColor: "#FFFFFF",
    },
    {
      scoreMin: 22,
      scoreMax: 23,
      label: "Superior",
      description: "Very good muscularity, advanced trainee.",
      color: referenceScaleColors["Superior"],
      textColor: "#FFFFFF",
    },
    {
      scoreMin: 23,
      scoreMax: 25,
      label: "Highly Superior",
      description:
        "Highly muscular, approaching typical natural genetic limits for many.",
      color: referenceScaleColors["Suspicious"],
      textColor: "#FFFFFF",
    },
    {
      scoreMin: 25,
      scoreMax: 27,
      label: "Suspicious",
      description:
        "Potentially achievable naturally by genetically gifted individuals with optimal training/nutrition, but can also indicate use of AAS.",
      color: referenceScaleColors["Unlikely Natural"],
      textColor: "#FFFFFF",
    },
    {
      scoreMin: 27,
      scoreMax: Infinity,
      label: "Unlikely Natural",
      description:
        "Very high FFMI, typically associated with anabolic steroid use.",
      color: "#A855F7",
      textColor: "#FFFFFF",
    },
  ],
  female: [
    {
      scoreMin: 0,
      scoreMax: 13,
      label: "Below Average",
      description: "Significantly below average muscle mass.",
      color: referenceScaleColors["Below Average"],
      textColor: "#FFFFFF",
    },
    {
      scoreMin: 13,
      scoreMax: 14,
      label: "Average",
      description: "Average muscle mass for the general population.",
      color: referenceScaleColors["Average"],
      textColor: "#FFFFFF",
    },
    {
      scoreMin: 14,
      scoreMax: 16,
      label: "Above Average",
      description: "Typical range for recreationally active individuals.",
      color: referenceScaleColors["Above Average"],
      textColor: "#1F2937",
    },
    {
      scoreMin: 16,
      scoreMax: 18,
      label: "Excellent",
      description:
        "Good level of muscularity, often seen in dedicated trainees.",
      color: referenceScaleColors["Excellent"],
      textColor: "#FFFFFF",
    },
    {
      scoreMin: 18,
      scoreMax: 19,
      label: "Superior",
      description: "Very good muscularity, advanced trainee.",
      color: referenceScaleColors["Superior"],
      textColor: "#FFFFFF",
    },
    {
      scoreMin: 19,
      scoreMax: 21,
      label: "Highly Superior",
      description:
        "Highly muscular, approaching typical natural genetic limits for many women.",
      color: referenceScaleColors["Suspicious"],
      textColor: "#FFFFFF",
    },
    {
      scoreMin: 21,
      scoreMax: 22,
      label: "Suspicious",
      description:
        "Potentially achievable naturally by genetically gifted women with optimal training/nutrition, but may raise questions.",
      color: referenceScaleColors["Unlikely Natural"],
      textColor: "#FFFFFF",
    },
    {
      scoreMin: 22,
      scoreMax: Infinity,
      label: "Unlikely Natural",
      description:
        "Very high FFMI for females, may indicate anabolic substance use.",
      color: "#A855F7",
      textColor: "#FFFFFF",
    },
  ],
};

const getFFMIInterpretationDetails = (
  ffmi: number,
  sex: Sex
): FFMIInterpretationDetail => {
  const scale = ffmiScales[sex];
  for (const range of scale) {
    if (ffmi >= range.scoreMin && ffmi < range.scoreMax) return range;
  }
  return (
    scale[scale.length - 1] || {
      label: "N/A",
      description: "Unable to determine FFMI category.",
      color: "#9CA3AF",
      scoreMin: 0,
      scoreMax: 0,
      textColor: "#FFFFFF",
    }
  );
};

const calculateFFMIInternal = (
  weightKg: number,
  heightM: number,
  bodyFatPercentage: number,
  sex: Sex
): FFMIResult | null => {
  if (
    isNaN(weightKg) ||
    isNaN(heightM) ||
    isNaN(bodyFatPercentage) ||
    !sex ||
    weightKg <= 0 ||
    heightM <= 0 ||
    bodyFatPercentage < 1 ||
    bodyFatPercentage > 70
  )
    return null;
  const lbmKg = weightKg * (1 - bodyFatPercentage / 100);
  const lbmLbs = lbmKg * 2.20462;
  if (lbmKg <= 0) return null;
  const ffmi = lbmKg / (heightM * heightM);
  const details = getFFMIInterpretationDetails(ffmi, sex);
  return {
    lbmKg: parseFloat(lbmKg.toFixed(1)),
    lbmLbs: parseFloat(lbmLbs.toFixed(1)),
    ffmi: parseFloat(ffmi.toFixed(1)),
    interpretation: details.label,
    details,
    bodyFat: bodyFatPercentage,
  };
};

function convertToCmInternal(feet?: number, inches?: number): number {
  return ((Number(feet) || 0) * 12 + (Number(inches) || 0)) * 2.54;
}

function convertCmToFtInInternal(cm: number): { feet: number; inches: number } {
  const totalInches = Number(cm) / 2.54;
  return {
    feet: Math.floor(totalInches / 12),
    inches: parseFloat((totalInches % 12).toFixed(1)),
  };
}

interface FFMIInputProps {
  id: string;
  label: string;
  control: any;
  error?: string;
  min: number;
  max: number;
  step: number;
  currentValue: number | undefined;
  displayUnit: string;
  isBodyFat?: boolean;
  decimalPlaces?: number;
}

const FFMIInput: React.FC<FFMIInputProps> = ({
  id,
  label,
  control,
  error,
  min,
  max,
  step,
  currentValue,
  displayUnit,
  isBodyFat = false,
  decimalPlaces = 0,
}) => {
  const displayVal =
    currentValue !== undefined && !isNaN(Number(currentValue))
      ? Number(currentValue).toFixed(decimalPlaces)
      : " -- ";
  const percentage =
    currentValue !== undefined && !isNaN(Number(currentValue))
      ? Math.max(
          0,
          Math.min(100, ((Number(currentValue) - min) / (max - min)) * 100)
        )
      : 0;
  const thumbPositionSpring = {
    type: "spring",
    stiffness: 450,
    damping: 28,
    mass: 0.8,
  }; // For smooth, responsive tracking
  const fillBarSpring = { type: "spring", stiffness: 380, damping: 35 }; // For the fill bar animation
  return (
    <Controller
      name={id}
      control={control}
      rules={{
        required: `${label} is required.`,
        min: { value: min, message: `Min ${label.toLowerCase()} is ${min}.` },
        max: { value: max, message: `Max ${label.toLowerCase()} is ${max}.` },
      }}
      render={({ field: { onChange, value: rhfValue, ref } }) => (
        <div className="mb-8 last:mb-0">
          <div className="flex justify-between items-end mb-1">
            <label
              htmlFor={id}
              className="text-sm font-medium text-brand-text-muted"
            >
              {label}
            </label>
            <div>
              <span className="text-3xl sm:text-4xl font-semibold text-brand-text leading-none tabular-nums">
                {displayVal}
              </span>
              <span className="text-sm sm:text-base text-brand-text-muted ml-1 leading-none">
                {isBodyFat ? "%" : displayUnit}
              </span>
            </div>
          </div>

          {/* Advanced Slider UI Area - parent is a 'group' for hover effects on children */}
          <div className="relative h-8 w-full group py-1">
            {" "}
            {/* Added py-1 to give some breathing room for scaled thumb */}
            {/* Invisible Native Input (PEER) - For interaction & accessibility */}
            <input
              type="range"
              id={id}
              ref={ref}
              min={min}
              max={max}
              step={step}
              value={isNaN(Number(rhfValue)) ? min : Number(rhfValue)}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              className="peer absolute inset-0 w-full h-full appearance-none bg-transparent cursor-grab active:cursor-grabbing z-30
                          focus:outline-none
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:-webkit-appearance-none
                          [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8
                          [&::-webkit-slider-thumb]:bg-transparent
                          
                          [&::-moz-range-thumb]:appearance-none
                          [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8
                          [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:border-none"
            />
            {/* Track Background - visual only, with micro-interaction on group hover */}
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1.5 
                            bg-brand-border/70 dark:bg-brand-secondary/25 
                            rounded-full z-0 transition-all duration-250 ease-out
                            group-hover:h-2 group-hover:bg-brand-border dark:group-hover:bg-brand-secondary/40" // Track subtly thickens
            />
            {/* Fill Bar - visual only, animated */}
            <motion.div
              className="absolute top-1/2 left-0 -translate-y-1/2 h-1.5 bg-brand-primary rounded-full z-10
                         group-hover:h-2 transition-all duration-250 ease-out" // Fill bar also thickens with track
              initial={{ width: "0%" }}
              animate={{ width: `${percentage}%` }}
              transition={fillBarSpring}
            />
            {/* Highly Advanced Custom Animated Thumb - visual only, reacts to peer states */}
            <motion.div
              className="absolute top-1/2 w-6 h-6 rounded-full bg-brand-card 
                         flex items-center justify-center
                         transform-gpu z-20 pointer-events-none
                         /* Base transitions for properties affected by peer states */
                         transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] /* Custom ease for scale */
                         will-change-transform /* Hint browser about transform changes */

                         /* Base shadow */
                         shadow-md 

                         /* Hover state (mouse over slider area) - more reactive */
                         peer-hover:scale-[1.2] 
                         peer-hover:shadow-lg

                         /* Focus Visible state (keyboard focus on slider) - premium glow */
                         peer-focus-visible:scale-[1.25]
                         peer-focus-visible:shadow-[0_0_0_2px_theme(colors.brand.card),0_0_0_5px_theme(colors.brand.primary)]
                         dark:peer-focus-visible:shadow-[0_0_0_2px_theme(colors.brand.card),0_0_0_5px_theme(colors.brand.primary)]

                         /* Active state (dragging the thumb) - lifts and expands */
                         peer-active:scale-[1.45]
                         peer-active:shadow-2xl /* Very prominent shadow */
                         "
              style={{ x: "-50%", y: "-50%" }} // Precise centering of the thumb
              initial={{ left: `${percentage}%` }}
              animate={{ left: `${percentage}%` }}
              transition={thumbPositionSpring} // Apply advanced spring for positional tracking
            >
              {/* Inner Thumb Detail - more intricate design */}
              <div
                className="w-full h-full rounded-full border-2 border-brand-primary/70
                              flex items-center justify-center relative overflow-hidden
                              transition-colors duration-200 ease-out
                              peer-hover:border-brand-primary
                              peer-focus-visible:border-brand-primary
                              peer-active:border-brand-primary/80"
              >
                <div
                  className="w-1.5 h-1.5 bg-brand-primary rounded-full
                                transition-all duration-150 ease-out
                                peer-hover:scale-110 
                                peer-active:scale-[0.8]
                                "
                />
                {/* Optional: Subtle animated shimmer effect on hover/focus for inner thumb */}
                <motion.div
                  className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-brand-card/50 to-transparent
                               transform -translate-x-full group-hover/thumb:translate-x-full 
                               dark:via-brand-background/30"
                  style={{ willChange: "transform" }} // Performance hint
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: 0.1,
                  }}
                  // Re-attach group-hover directly on thumb to control shimmer if needed without global group.
                  // Or control with a JS managed state for finer control. For pure CSS this requires a 'group' on parent.
                />
              </div>
            </motion.div>
          </div>
          <div className="flex justify-between text-xs text-brand-text-muted mt-1.5">
            <span>
              {min}
              {isBodyFat ? "%" : displayUnit}
            </span>
            <span>
              {max}
              {isBodyFat ? "%" : displayUnit}
            </span>
          </div>
          {error && <p className="text-xs text-error mt-1">{error}</p>}
        </div>
      )}
    />
  );
};

interface SimplifiedRadialGaugeProps {
  score: number;
  maxScore: number;
  label: string;
  primaryColor: string;
  trackColor: string;
}
const SimplifiedRadialGauge: React.FC<SimplifiedRadialGaugeProps> = ({
  score,
  maxScore,
  label,
  primaryColor,
  trackColor,
}) => {
  const r = 42;
  const C = 2 * Math.PI * r;
  const displayScore = Math.min(score, maxScore);
  const pct = Math.max(0, Math.min(1, displayScore / maxScore));
  const offset = C - pct * C;
  return (
    <div className="relative w-44 h-44 sm:w-48 sm:h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth="10"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={primaryColor}
          strokeWidth="10"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1,
            type: "spring",
            stiffness: 60,
            damping: 15,
            delay: 0.2,
          }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          key={score}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-4xl font-bold text-brand-muted tabular-nums"
        >
          {score?.toFixed(1) ?? "--"}
        </motion.span>
        <span className="text-xs text-brand-muted mt-0.5">{label}</span>
      </div>
    </div>
  );
};

interface FFMIScaleBarProps {
  ffmi: number;
  sex: Sex;
  currentDetails?: FFMIInterpretationDetail;
  maxVisualFFMI: number;
}
const FFMIScaleBarComponent: React.FC<FFMIScaleBarProps> = ({
  ffmi,
  sex,
  currentDetails,
  maxVisualFFMI,
}) => {
  const scaleSegments = ffmiScales[sex];
  const minFFMI = 0;
  const displayMaxFFMI = maxVisualFFMI;
  const indicatorPositionPercent =
    isNaN(ffmi) || ffmi < minFFMI
      ? 0
      : Math.min(100, ((ffmi - minFFMI) / (displayMaxFFMI - minFFMI)) * 100);
  return (
    <div className="w-full relative py-4">
      <div className="h-2.5 flex rounded-md overflow-hidden shadow-inner bg-brand-secondary/10">
        {scaleSegments.map((segment) => {
          const segmentStart = Math.max(minFFMI, segment.scoreMin);
          const segmentEnd = Math.min(displayMaxFFMI, segment.scoreMax);
          const widthPercent =
            ((segmentEnd - segmentStart) / (displayMaxFFMI - minFFMI)) * 100;
          if (widthPercent <= 0 || segmentStart >= displayMaxFFMI) return null;
          return (
            <div
              key={`${segment.label}-${segment.scoreMin}`}
              style={{
                width: `${widthPercent}%`,
                backgroundColor: segment.color,
              }}
              title={`${segment.label}: ${segment.scoreMin} - ${
                segment.scoreMax === Infinity ? "+" : segment.scoreMax
              }`}
            />
          );
        })}
        {!isNaN(ffmi) && ffmi >= minFFMI && currentDetails && (
          <motion.div
            className="absolute h-3 w-3 -top-0.5 transform -translate-x-1/2"
            style={{ left: `${indicatorPositionPercent}%` }}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
          >
            <div
              className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px]"
              style={{ borderTopColor: currentDetails.color }}
            />
          </motion.div>
        )}
      </div>
      <div className="flex justify-between text-xs text-brand-text-muted mt-2 relative">
        {scaleSegments.map((segment, index) => {
          if (
            segment.scoreMin < displayMaxFFMI &&
            (index === 0 ||
              segment.scoreMax === Infinity ||
              (index % 2 === 0 && segment.scoreMin < displayMaxFFMI * 0.95) ||
              segment.scoreMin === 0)
          ) {
            const positionPercent =
              ((segment.scoreMin - minFFMI) / (displayMaxFFMI - minFFMI)) * 100;
            if (
              positionPercent > 95 &&
              segment.scoreMax !== Infinity &&
              index !== scaleSegments.length - 1
            )
              return null;
            return (
              <span
                key={`label-${segment.scoreMin}`}
                className="absolute"
                style={{
                  left: `${positionPercent}%`,
                  transform:
                    positionPercent > 95
                      ? "translateX(-100%)"
                      : positionPercent < 5
                      ? "translateX(0%)"
                      : "translateX(-50%)",
                }}
              >
                {" "}
                {segment.scoreMin}{" "}
              </span>
            );
          }
          return null;
        })}
        <span className="absolute right-0 transform translateX(0%)">
          {displayMaxFFMI}
        </span>
      </div>
    </div>
  );
};

const FFMICalculator: React.FC = () => {
  const [unitsSystem, setUnitsSystem] = useState<UnitsSystem>("imperial");
  const [result, setResult] = useState<FFMIResult | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    trigger,
    getValues, // Added getValues
  } = useForm<FFMIFormInputs>({
    mode: "onChange",
    defaultValues: {
      sex: "male",
      weight: 200,
      heightCm: convertToCmInternal(6, 0),
      bodyFat: 15,
      displayFeet: 6,
      displayInches: 0,
    },
  });

  const watchedFormValues = watch(); // For general UI updates and calculation effect

  // Specific fields for height synchronization useEffect dependencies
  const formInputDisplayFeet = watch("displayFeet");
  const formInputDisplayInches = watch("displayInches");
  const formInputHeightCm = watch("heightCm");
  const formInputSex = watch("sex"); // For currentMaxVisualFFMI

  const currentSex = formInputSex || "male";

  const performCalculation = useCallback(
    (currentVals: FFMIFormInputs) => {
      const { sex, weight, heightCm, bodyFat } = currentVals;
      if (
        !sex ||
        isNaN(Number(weight)) ||
        isNaN(Number(heightCm)) ||
        isNaN(Number(bodyFat))
      ) {
        setResult(null);
        return;
      }
      const weightInKg =
        unitsSystem === "imperial" ? Number(weight) * 0.453592 : Number(weight);
      const heightInM = Number(heightCm) / 100;
      if (isNaN(weightInKg) || isNaN(heightInM) || heightInM <= 0) {
        setResult(null);
        return;
      }
      const calcResult = calculateFFMIInternal(
        weightInKg,
        heightInM,
        Number(bodyFat),
        sex
      );
      setResult(calcResult);
    },
    [unitsSystem] // performCalculation depends on unitsSystem
  );

  const debouncedCalculate = useMemo(
    () => debounce((values: FFMIFormInputs) => performCalculation(values), 350),
    [performCalculation] // debouncedCalculate re-memoizes if performCalculation changes
  );

  useEffect(() => {
    if (isValid) {
      debouncedCalculate(watchedFormValues); // Use the comprehensive watchedFormValues here
    } else {
      setResult(null);
    }
  }, [watchedFormValues, debouncedCalculate, isValid]); // This effect should be safe

  // Effect for Imperial Height (Feet/Inches) -> heightCm synchronization
  useEffect(() => {
    if (unitsSystem === "imperial") {
      // Dependencies formInputDisplayFeet and formInputDisplayInches are watched separately
      if (
        formInputDisplayFeet !== undefined &&
        formInputDisplayInches !== undefined
      ) {
        const newHeightCm = convertToCmInternal(
          formInputDisplayFeet,
          formInputDisplayInches
        );
        const existingHeightCm = getValues("heightCm"); // Get current value for comparison

        if (
          !isNaN(newHeightCm) &&
          Math.abs(newHeightCm - (existingHeightCm || 0)) > 0.01
        ) {
          setValue("heightCm", parseFloat(newHeightCm.toFixed(1)), {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }
    }
  }, [
    formInputDisplayFeet,
    formInputDisplayInches,
    unitsSystem,
    setValue,
    getValues,
  ]);

  // Effect for heightCm -> Imperial Display (Feet/Inches) synchronization
  useEffect(() => {
    // Dependency formInputHeightCm is watched separately
    if (!isNaN(Number(formInputHeightCm))) {
      if (unitsSystem === "imperial") {
        const existingDisplayFeet = getValues("displayFeet"); // Get current value for comparison
        const existingDisplayInches = getValues("displayInches"); // Get current value for comparison

        const { feet: newFeet, inches: newInches } = convertCmToFtInInternal(
          Number(formInputHeightCm)
        );

        if (newFeet !== existingDisplayFeet) {
          setValue("displayFeet", newFeet, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
        // Added check for existingDisplayInches being undefined to handle initial sets correctly if necessary
        if (
          Math.abs(newInches - (existingDisplayInches || 0)) > 0.01 ||
          (existingDisplayInches === undefined && newInches !== undefined)
        ) {
          setValue("displayInches", newInches, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }
    }
  }, [formInputHeightCm, unitsSystem, setValue, getValues]);

  const handleSystemToggle = () => {
    const newSystem = unitsSystem === "imperial" ? "metric" : "imperial";
    // Use getValues to ensure we're converting the most current, validated numbers
    const currentWeight = Number(getValues("weight"));
    const currentHeightCm = Number(getValues("heightCm"));

    let newWeightVal = currentWeight;
    if (!isNaN(currentWeight)) {
      if (unitsSystem === "imperial" && newSystem === "metric")
        newWeightVal = currentWeight * 0.453592;
      else if (unitsSystem === "metric" && newSystem === "imperial")
        newWeightVal = currentWeight * 2.20462;
      setValue("weight", parseFloat(newWeightVal.toFixed(1)), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    if (newSystem === "imperial" && !isNaN(currentHeightCm)) {
      const { feet, inches } = convertCmToFtInInternal(currentHeightCm);
      setValue("displayFeet", feet, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("displayInches", inches, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    setUnitsSystem(newSystem);
    trigger(["weight", "heightCm", "displayFeet", "displayInches"]);
  };

  const handleFormSubmit: SubmitHandler<FFMIFormInputs> = (data) => {
    performCalculation(data);
  };

  const currentMaxVisualFFMI = useMemo(
    () => (currentSex === "male" ? 30 : 27),
    [currentSex] // Depends on currentSex, which is now from watch("sex")
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-brand-background text-brand-text">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-8 sm:mb-12"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text tracking-tight">
          FFMI Calculator
        </h1>
        <p className="text-sm sm:text-base text-brand-text-muted mt-2">
          Estimate your Fat Free Mass Index.
        </p>
      </motion.div>

      <div className="max-w-4xl lg:max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)] gap-6 sm:gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="bg-[#fff] dark:bg-black/25 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-[0_25px_100px_-15px_rgba(0,0,1,0.1)] min-h-[450px] flex flex-col justify-between"
        >
          {result && isValid ? (
            <>
              <SimplifiedRadialGauge
                score={result.ffmi}
                maxScore={currentMaxVisualFFMI}
                label="FFMI"
                primaryColor={result.details.color || "#FFFFFF"}
                trackColor={"rgba(255,255,255,0.1)"}
              />
              <div className="mt-2 text-center">
                <p className={`text-xl font-semibold ${"text-brand-text"}`}>
                  {result.interpretation}
                </p>
                <p className="text-xs text-brand-text-muted mt-1">
                  {result.details.description}
                </p>
              </div>
              <div className="mt-6 space-y-2 text-sm pt-4 border-t border-brand-border ">
                {[
                  {
                    label: "Fat Free Mass",
                    value:
                      unitsSystem === "metric" ? result.lbmKg : result.lbmLbs,
                    unit: unitsSystem === "metric" ? "kg" : "lbs",
                  },
                  {
                    label: "Body Fat (Input)",
                    value: result.bodyFat,
                    unit: "%",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-baseline"
                  >
                    <span className="text-brand-text-muted">{item.label}:</span>
                    <span className="font-semibold text-base text-brand-text tabular-nums">
                      {item.value?.toFixed(1) ?? "--"} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-brand-text-muted flex-grow py-10">
              <ScaleIcon className="h-12 w-12 opacity-30 mb-3" />
              <p className="text-md font-medium">Enter your metrics</p>
              <p className="text-xs mt-1">
                {isValid
                  ? "Your results will appear here."
                  : "Please ensure all inputs are valid."}
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="bg-brand-card text-brand-text p-6 sm:p-8 rounded-2xl shadow-brand"
        >
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-brand-text">
                Your Metrics
              </h3>
              <div className="flex items-center space-x-2 p-0.5 bg-brand-secondary/20 rounded-full shadow-sm">
                {(["imperial", "metric"] as const).map((system) => (
                  <button
                    key={system}
                    type="button"
                    onClick={() => {
                      if (unitsSystem !== system) handleSystemToggle();
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 ${
                      unitsSystem === system
                        ? "bg-brand-primary text-brand-background shadow" // Active: primary bg, text is card's base bg
                        : "text-brand-text hover:bg-brand-primary/10"
                    }`}
                  >
                    {system.charAt(0).toUpperCase() + system.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-text-muted mb-1.5">
                Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    setValue("sex", "male", {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  variant={
                    watchedFormValues.sex === "male" ? "primary" : "outline"
                  }
                  className={`!py-2.5 !text-sm w-full`}
                >
                  Male
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setValue("sex", "female", {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  variant={
                    watchedFormValues.sex === "female" ? "primary" : "outline"
                  }
                  className={`!py-2.5 !text-sm w-full`}
                >
                  Female
                </Button>
              </div>
              {errors.sex && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.sex.message}
                </p>
              )}
            </div>

            <FFMIInput
              id="weight"
              label="Weight"
              control={control}
              error={errors.weight?.message as string}
              min={unitsSystem === "metric" ? 20 : 45}
              max={unitsSystem === "metric" ? 180 : 400}
              step={0.1}
              currentValue={watchedFormValues.weight}
              displayUnit={unitsSystem === "metric" ? "kg" : "lbs"}
              decimalPlaces={1}
            />

            {unitsSystem === "metric" ? (
              <FFMIInput
                id="heightCm"
                label="Height"
                control={control}
                error={errors.heightCm?.message as string}
                min={100}
                max={250}
                step={0.5}
                currentValue={watchedFormValues.heightCm}
                displayUnit="cm"
                decimalPlaces={1}
              />
            ) : (
              <>
                <FFMIInput
                  id="displayFeet"
                  label="Height (ft)"
                  control={control}
                  error={errors.displayFeet?.message as string}
                  min={3}
                  max={8}
                  step={1}
                  currentValue={watchedFormValues.displayFeet}
                  displayUnit="ft"
                  decimalPlaces={0}
                />
                <FFMIInput
                  id="displayInches"
                  label="Height (inches)"
                  control={control}
                  error={errors.displayInches?.message as string}
                  min={0}
                  max={11.9}
                  step={0.1}
                  currentValue={watchedFormValues.displayInches}
                  displayUnit="in"
                  decimalPlaces={1}
                />
              </>
            )}
            <FFMIInput
              id="bodyFat"
              label="Body Fat"
              control={control}
              error={errors.bodyFat?.message as string}
              min={3}
              max={60}
              step={0.1}
              currentValue={watchedFormValues.bodyFat}
              displayUnit="%"
              decimalPlaces={1}
              isBodyFat
            />
          </form>
        </motion.div>
      </div>

      {result && isValid && (
        <motion.div
          className="max-w-3xl mx-auto mt-8 sm:mt-10 bg-brand-card p-4 sm:p-6 rounded-xl shadow-brand"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h4 className="text-md font-semibold text-brand-text mb-2 text-center">
            FFMI Scale ({currentSex})
          </h4>
          <FFMIScaleBarComponent
            ffmi={result.ffmi}
            sex={currentSex}
            currentDetails={result.details}
            maxVisualFFMI={currentMaxVisualFFMI}
          />
        </motion.div>
      )}
    </div>
  );
};

export default FFMICalculator;
