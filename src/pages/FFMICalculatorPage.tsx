// /src/pages/FFMICalculatorPage.tsx
import React from "react";
import { motion } from "framer-motion";
import FFMICalculator from "../components/Calculators/FFMICalculator";

// Optional: Add SEO, page-specific title, breadcrumbs etc.

const FFMICalculatorPage: React.FC = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 0) => ({
      // Added default value for i
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2, // Stagger effect for each section
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Helper component for consistent section styling and animation
  const InfoSection: React.FC<{
    title: string;
    customIndex: number;
    children: React.ReactNode;
  }> = ({ title, customIndex, children }) => (
    <motion.section
      className="mb-10 p-6 bg-brand-surface shadow-lg rounded-lg" // Using a card-like style
      custom={customIndex}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary mb-6 border-b-2 border-brand-primary pb-3">
        {title}
      </h2>
      <div className="space-y-4 text-brand-text leading-relaxed">
        {children}
      </div>
    </motion.section>
  );

  const ffmiMenData = [
    { ffmi: "17-18", bodyFat: "10-18%", description: "Skinny man" },
    { ffmi: "18-20", bodyFat: "20-27%", description: "Average man" },
    { ffmi: "19-21", bodyFat: "25-40%", description: "Fat man" },
    {
      ffmi: "20-21",
      bodyFat: "10-18%",
      description: "Athlete / Intermediate gym user",
    },
    { ffmi: "22-23", bodyFat: "6-12%", description: "Advanced gym user" },
    {
      ffmi: "24-25",
      bodyFat: "8-20%",
      description: "Bodybuilder / Powerlifter / Weightlifter",
    },
  ];

  const ffmiWomenData = [
    { ffmi: "14-15", bodyFat: "20-25%", description: "Skinny women" },
    { ffmi: "14-17", bodyFat: "22-35%", description: "Average women" },
    { ffmi: "15-18", bodyFat: "30-45%", description: "Fat women" },
    {
      ffmi: "16-17",
      bodyFat: "18-25%",
      description: "Athlete / Intermediate gym user",
    },
    { ffmi: "18-20", bodyFat: "15-22%", description: "Advanced gym user" },
    {
      ffmi: "19-21",
      bodyFat: "15-30%",
      description: "Bodybuilder / Powerlifter / Weightlifter",
    },
  ];

  // Helper component for responsive tables
  const InterpretationTable: React.FC<{
    data: Array<{ ffmi: string; bodyFat: string; description: string }>;
    title: string;
  }> = ({ data, title }) => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-brand-text mb-3">{title}</h3>
      <div className="overflow-x-auto shadow-md rounded-md">
        {" "}
        {/* Enables horizontal scroll on small screens */}
        <table className="min-w-full w-full text-sm text-left text-brand-text-muted bg-brand-background">
          <thead className="text-xs text-brand-text uppercase bg-brand-surface border-b border-brand-border">
            <tr>
              <th scope="col" className="px-4 py-3">
                FFMI
              </th>
              <th scope="col" className="px-4 py-3">
                Body Fat %
              </th>
              <th scope="col" className="px-4 py-3">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`border-b border-brand-border ${
                  index % 2 === 0
                    ? "bg-brand-background"
                    : "bg-brand-surface/50"
                }`}
              >
                <td className="px-4 py-3 font-medium text-brand-text whitespace-nowrap">
                  {row.ffmi}
                </td>
                <td className="px-4 py-3">{row.bodyFat}</td>
                <td className="px-4 py-3">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <FFMICalculator />

      {/* Informational Content Area */}
      <div className="mt-12 sm:mt-16">
        {" "}
        {/* Spacing below the calculator */}
        <InfoSection title="What is FFMI?" customIndex={0}>
          <p>
            FFMI stands for Fat-Free Mass Index. It's a measure used to quantify
            the amount of muscle mass a person has relative to their height.
            This index is often used by bodybuilders, athletes, and fitness
            enthusiasts to track their progress and compare their muscularity to
            others.
          </p>
          <p>
            Think of FFMI as an alternative or a complement to the more commonly
            known Body Mass Index (BMI). While BMI can sometimes misclassify
            muscular individuals as overweight, FFMI provides a more accurate
            picture by focusing specifically on lean body mass.
          </p>
        </InfoSection>
        <InfoSection title="FFMI Formula" customIndex={1}>
          <p>The FFMI calculation involves a few steps:</p>
          <div className="space-y-3 mt-4 p-4 bg-brand-background rounded-md shadow">
            <p className="font-mono text-sm">
              <strong className="text-brand-primary">
                1. Total Body Fat (kg or lbs):
              </strong>
              <br />
              Weight × (Body Fat Percentage / 100)
            </p>
            <p className="font-mono text-sm">
              <strong className="text-brand-primary">
                2. Lean Body Mass (LBM) (kg or lbs):
              </strong>
              <br />
              Weight − Total Body Fat
              <br />{" "}
              <em className="text-xs text-brand-text-muted">
                Alternatively: Weight × (1 − (Body Fat Percentage / 100))
              </em>
            </p>
            <p className="font-mono text-sm">
              <strong className="text-brand-primary">
                3. FFMI (Metric - kg/m²):
              </strong>
              <br />
              LBM (kg) / (Height (m)²)
            </p>
            <p className="font-mono text-sm">
              <strong className="text-brand-primary">
                3. FFMI (Imperial - lbs/ft² - Approx.):
              </strong>
              <br />
              (LBM (lbs) / 2.20462) / (Height (m)²)
              <br />{" "}
              <em className="text-xs text-brand-text-muted">
                Where Height (m) = ( (Feet × 12) + Inches ) × 0.0254
              </em>
            </p>
            <p className="font-mono text-sm">
              <strong className="text-brand-primary">
                4. Adjusted FFMI (Normalized):
              </strong>
              <br />
              FFMI + (6.1 × (1.8 − Height (m)))
              <br />{" "}
              <em className="text-xs text-brand-text-muted">
                The adjustment is typically for heights deviating from an
                average of 1.8m (approx 5'11"). The factor might vary slightly
                (e.g. 6.0 to 6.3) in different literature.
              </em>
            </p>
          </div>
          <p className="mt-3 text-sm text-brand-text-muted">
            Note: Most online calculators, including this one, handle these unit
            conversions internally. The "Adjusted FFMI" helps to normalize
            scores for people of different heights.
          </p>
        </InfoSection>
        <InfoSection title="FFMI Interpretation" customIndex={2}>
          <p>
            The calculated normalized FFMI score can be interpreted using
            reference ranges. It's important to note that interpretations can
            differ for men and women due to physiological differences in body
            composition.
          </p>
          <InterpretationTable data={ffmiMenData} title="FFMI Score for Men" />
          <InterpretationTable
            data={ffmiWomenData}
            title="FFMI Score for Women"
          />
          <p className="text-sm text-brand-text-muted">
            These values are general guidelines. Body fat percentage also plays
            a crucial role in overall physique and health. Very high FFMI values
            (25 for men, 21 for women) without performance-enhancing drugs are
            rare but can be achieved with exceptional genetics and dedication.
          </p>
        </InfoSection>
        <InfoSection title="How to Use This Calculator" customIndex={3}>
          <p>
            To estimate your FFMI with the calculator above, follow these simple
            steps:
          </p>
          <ol className="list-decimal list-outside space-y-2 pl-5 mt-3 marker:text-brand-primary marker:font-semibold">
            <li>Select your preferred unit system (Metric or Imperial).</li>
            <li>Enter your current height accurately.</li>
            <li>Input your current body weight.</li>
            <li>
              Provide your estimated body fat percentage. (This is crucial for
              accuracy. If unsure, use a reliable method to estimate it.)
            </li>
            <li>
              Click the "Calculate" button to see your FFMI, Lean Body Mass, and
              an interpretation of your score.
            </li>
          </ol>
          <p className="mt-4 text-sm text-brand-text-muted">
            Remember, the accuracy of your FFMI calculation largely depends on
            the accuracy of your body fat percentage input.
          </p>
        </InfoSection>
      </div>
    </motion.div>
  );
};

export default FFMICalculatorPage;
