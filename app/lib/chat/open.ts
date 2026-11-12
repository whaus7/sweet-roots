export const OPEN_CHAT_EVENT = "jordhaus-open-chat";

export function openSiteChat(): boolean {
  if (typeof document === "undefined") return false;
  if (document.documentElement.dataset.chatReady !== "1") return false;
  window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
  return true;
}
