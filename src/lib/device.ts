const STORAGE_KEY = "ccwebai_device_id";

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `ccwebai_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateDeviceId(): string {
  const current = window.localStorage.getItem(STORAGE_KEY);
  if (current) {
    return current;
  }
  const next = generateId();
  window.localStorage.setItem(STORAGE_KEY, next);
  return next;
}
