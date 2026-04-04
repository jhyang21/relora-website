export type DemoScenarioSlug = "real-estate" | "financial-advisor" | "sales-founder";

export type DemoKeyThing = {
  id: string;
  label: string;
};

export type DemoScenario = {
  slug: DemoScenarioSlug;
  label: string;
  transcript: string;
  transcriptHighlights: string[];
  audio: {
    src: string;
    durationMs: number;
  };
  contact: {
    name: string;
    title: string;
    initials: string;
  };
  memory: {
    context: string;
  };
  keyThings: DemoKeyThing[];
  reminder: string;
  durations: {
    processingMs: number;
    cardsMs: number;
  };
};

export const demoScenarios: DemoScenario[] = [
  {
    slug: "real-estate",
    label: "Real Estate Agent",
    transcript:
      "Showed Oak Avenue to Sarah Chen. She loved the open kitchen. Her daughter Lily starts kindergarten this fall. Her husband Mike works remotely three days a week and they want a quiet office. Their budget is between six fifty and seven hundred.",
    transcriptHighlights: [
      "Sarah Chen",
      "open kitchen",
      "Lily starts kindergarten this fall",
      "Mike works remotely three days a week",
      "between six fifty and seven hundred",
    ],
    audio: {
      src: "/demo-audio/real-estate.mp3",
      durationMs: 15384,
    },
    contact: {
      name: "Sarah Chen",
      title: "Buyer with a growing family",
      initials: "SC",
    },
    memory: {
      context: "Oak Avenue showing with Sarah Chen. She focused on kitchen layout, school timing for Lily, and space for Mike's remote work setup.",
    },
    keyThings: [
      { id: "schools", label: "Lily starts kindergarten this fall" },
      { id: "office", label: "Mike needs a quiet home office" },
      { id: "budget", label: "Sarah's budget: $650K to $700K" },
      { id: "kitchen", label: "Sarah wants an open kitchen" },
    ],
    reminder: "Hold the Oak Avenue Saturday showing and send two school-zone comps to Sarah.",
    durations: {
      processingMs: 2400,
      cardsMs: 4800,
    },
  },
  {
    slug: "financial-advisor",
    label: "Financial Advisor",
    transcript:
      "Quarterly review with Ethan Miller. His portfolio is still concentrated in NVIDIA and Apple. Grace starts Stanford next August. He is looking at vacation homes near Lake Tahoe again.",
    transcriptHighlights: [
      "Ethan Miller",
      "NVIDIA and Apple",
      "Grace starts Stanford next August",
      "vacation homes near Lake Tahoe",
    ],
    audio: {
      src: "/demo-audio/financial-advisor.mp3",
      durationMs: 10968,
    },
    contact: {
      name: "Ethan Miller",
      title: "Long-term wealth management client",
      initials: "EM",
    },
    memory: {
      context: "Quarterly portfolio review with Ethan Miller covering tech concentration, Grace's Stanford timeline, and renewed interest in Lake Tahoe property.",
    },
    keyThings: [
      { id: "concentration", label: "Portfolio is still concentrated in tech" },
      { id: "stanford", label: "Grace starts Stanford next August" },
      { id: "vacation-home", label: "Eyeing Lake Tahoe again" },
    ],
    reminder: "Book a short follow-up before summer to revisit concentration and liquidity.",
    durations: {
      processingMs: 2200,
      cardsMs: 5000,
    },
  },
  {
    slug: "sales-founder",
    label: "Sales / Founder",
    transcript:
      "Met Rachel Torres at SaaStr. She leads sales at Meridian Software, a company with around two hundred employees. Salesforce adoption is stuck near thirty percent because reps still work outside the CRM. Their renewal push ramps up in Q2.",
    transcriptHighlights: [
      "Rachel Torres",
      "Meridian Software",
      "around two hundred employees",
      "Salesforce adoption is stuck near thirty percent",
      "renewal push ramps up in Q2",
    ],
    audio: {
      src: "/demo-audio/sales-founder.mp3",
      durationMs: 15504,
    },
    contact: {
      name: "Rachel Torres",
      title: "VP Sales at Meridian Software",
      initials: "RT",
    },
    memory: {
      context: "Conversation with Rachel Torres at SaaStr about Meridian Software, low CRM adoption, and the pressure of the upcoming Q2 renewal cycle.",
    },
    keyThings: [
      { id: "role", label: "Leads sales at Meridian Software" },
      { id: "adoption", label: "Meridian Software's CRM adoption is stuck at 30%" },
      { id: "renewal", label: "Her team feels Q2 renewal pressure" },
    ],
    reminder: "Send the rollout case study tomorrow and anchor the note to the Q2 renewal push.",
    durations: {
      processingMs: 2500,
      cardsMs: 4700,
    },
  },
];

function createDemoScenarioMap(
  scenarios: DemoScenario[],
): Record<DemoScenarioSlug, DemoScenario> {
  const scenarioMap = {} as Record<DemoScenarioSlug, DemoScenario>;

  for (const scenario of scenarios) {
    scenarioMap[scenario.slug] = scenario;
  }

  return scenarioMap;
}

export const demoScenarioMap = createDemoScenarioMap(demoScenarios);

export function isDemoScenarioSlug(value: string): value is DemoScenarioSlug {
  return value === "real-estate" || value === "financial-advisor" || value === "sales-founder";
}
