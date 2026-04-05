export type DemoPhase = "idle" | "recording" | "processing" | "cards" | "complete" | "resetting";

export type VisibleCards = {
  subject: boolean;
  memory: boolean;
  keyThings: number;
  reminder: boolean;
};
