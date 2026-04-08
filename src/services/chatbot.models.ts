// ── chatbot.models.ts ─────────────────────────────────────────────────────────

export interface ChatMessage {
    type: 'user' | 'bot';
    text: string;
    time: string;
    isError?: boolean;
    isStreaming?: boolean;   // true while token-streaming is in progress
    service?: {
        id: string | number;
        name: string;
        price?: string;
        duration?: string;
        mode?: string;
        warranty?: string;
    } | null;
    showHumanHandoff?: boolean;
}

export interface ChatHistoryItem {
    type: 'user' | 'bot';
    text: string;
}

export interface ChatApiResponse {
    message: string;
    service?: ChatMessage['service'];
    followUpChips?: string[];
    showHumanHandoff?: boolean;
}