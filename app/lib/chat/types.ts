export type ChatRole = "visitor" | "owner" | "system";

export type ChatMessage = {
  id: string;
  from: ChatRole;
  text: string;
  at: number;
};

export type ChatSession = {
  sessionId: string;
  messages: ChatMessage[];
};

export type ChatStatus = "unconfigured" | "open" | "live" | "unavailable" | "ended";

export type ChatSnapshot = {
  status: ChatStatus;
  messages: ChatMessage[];
};
