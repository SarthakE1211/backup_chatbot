export interface ServiceInfo {
    id: number;
    name: string;
    price?: string;
    duration?: string;
    mode?: string;
    warranty?: string;
}

export interface ChatMessage {
    type: 'user' | 'bot';
    text: string;
    time: string;
    service?: ServiceInfo | null;
    showHumanHandoff?: boolean;
    isError?: boolean;
}

export interface ChatApiResponse {
    message: string;
    service?: ServiceInfo | null;
    followUpChips?: string[];
    showHumanHandoff?: boolean;
}

export interface ChatHistoryItem {
    type: 'user' | 'bot';
    text: string;
}

export interface ChatRequestBody {
    message: string;
    lang: string;
    history: ChatHistoryItem[];
    clientId?: string;
}

export interface WsChatEvent {
    type: 'chunk' | 'done' | 'error' | 'service' | 'handoff' | 'session' | 'message';
    text?: string;
    content?: string;
    role?: string;
    session_id?: string;
    service?: ServiceInfo;
    followUpChips?: string[];
    showHumanHandoff?: boolean;
}
