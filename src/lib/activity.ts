export interface ActivityEntry {
  id: string;
  action: string;
  label: string;
  metadata?: Record<string, string>;
  timestamp: string;
}

const STORAGE_KEY = "pulse_activity";
const MAX_ENTRIES = 50;

export function getSessionId(): string {
  let sid = localStorage.getItem("pulse_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("pulse_session_id", sid);
  }
  return sid;
}

export function logActivity(action: string, label: string, metadata?: Record<string, string>) {
  const entries = getActivity();
  entries.unshift({
    id: crypto.randomUUID(),
    action,
    label,
    metadata,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

export function getActivity(): ActivityEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearActivity() {
  localStorage.removeItem(STORAGE_KEY);
}
