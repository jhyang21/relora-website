const DEMO_SESSION_STORAGE_KEY = "relora.demo.session-id";

let fallbackSessionId: string | null = null;

function createSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `demo-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

export function getOrCreateDemoSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  if (fallbackSessionId) {
    return fallbackSessionId;
  }

  try {
    const existingSessionId = window.sessionStorage.getItem(DEMO_SESSION_STORAGE_KEY);
    if (existingSessionId) {
      fallbackSessionId = existingSessionId;
      return existingSessionId;
    }

    const nextSessionId = createSessionId();
    window.sessionStorage.setItem(DEMO_SESSION_STORAGE_KEY, nextSessionId);
    fallbackSessionId = nextSessionId;
    return nextSessionId;
  } catch {
    fallbackSessionId = createSessionId();
    return fallbackSessionId;
  }
}
