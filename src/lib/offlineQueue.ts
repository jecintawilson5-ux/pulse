// Offline queue using localStorage (lightweight alternative to localForage)
// Stores pending actions when offline, replays when back online

export interface QueuedAction {
  id: string;
  type: "QUESTION" | "ANSWER" | "VOTE";
  payload: Record<string, unknown>;
  timestamp: number;
}

const QUEUE_KEY = "pulse_offline_queue";

function getQueue(): QueuedAction[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedAction[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function enqueueAction(type: QueuedAction["type"], payload: Record<string, unknown>) {
  const queue = getQueue();
  queue.push({
    id: crypto.randomUUID(),
    type,
    payload,
    timestamp: Date.now(),
  });
  saveQueue(queue);
}

export function dequeueAction(id: string) {
  const queue = getQueue().filter((a) => a.id !== id);
  saveQueue(queue);
}

export function getQueuedActions(): QueuedAction[] {
  return getQueue();
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

// Replay queued actions when back online
export async function replayQueue(handlers: {
  QUESTION: (payload: Record<string, unknown>) => Promise<void>;
  ANSWER: (payload: Record<string, unknown>) => Promise<void>;
  VOTE: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const queue = getQueuedActions();
  if (queue.length === 0) return;

  for (const action of queue) {
    try {
      await handlers[action.type](action.payload);
      dequeueAction(action.id);
    } catch (err) {
      console.error("[OfflineQueue] Failed to replay action:", action.type, err);
      break; // Stop on first failure to maintain order
    }
  }
}
