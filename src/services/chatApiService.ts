import { ChatApiResponse, ChatHistoryItem } from './chatbot.models';
import { firebaseAuthHelper } from './firebaseAuth.helper';

export class ChatApiService {
    private static readonly API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/';

    private static async buildHeaders() {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        try {
            const token = await firebaseAuthHelper.getIdToken();
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        } catch (err) {
            console.warn('[ChatApiService] failed to get auth token, falling back to unauthenticated request', err);
        }

        return headers;
    }

    private static normalizeLang(lang: string): string {
        const map: Record<string, string> = {
            english: 'en',
            hindi: 'hi',
            tamil: 'ta',
            telugu: 'te'
        };
        return map[lang.toLowerCase()] || lang.toLowerCase();
    }

    private static getClientId(): string {
        const localStorageKey = 'pockit_chat_client_id';
        let cid = localStorage.getItem(localStorageKey);
        if (!cid) {
            cid = (window.crypto && typeof window.crypto.randomUUID === 'function')
                ? window.crypto.randomUUID()
                : 'cid-' + Math.random().toString(36).substring(2, 12);
            localStorage.setItem(localStorageKey, cid);
        }
        return cid;
    }

    static async getResponse(
        message: string,
        lang: string,
        history: ChatHistoryItem[]
    ): Promise<ChatApiResponse> {
        const body = {
            message,
            lang: ChatApiService.normalizeLang(lang),
            history,
            clientId: ChatApiService.getClientId()
        };

        const url = `${ChatApiService.API_BASE.replace(/\/$/, '')}/api/v1/chat`;

        const res = await fetch(url, {
            method: 'POST',
            headers: await ChatApiService.buildHeaders(),
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error(`Chat API error ${res.status}`);
        }

        const json = await res.json();

        return {
            message: json?.message ?? json?.reply ?? '',
            service: json?.service ?? null,
            followUpChips: json?.followUpChips ?? [],
            showHumanHandoff: !!json?.showHumanHandoff
        };
    }

    static async getHistory(sessionId: string): Promise<ChatApiResponse[]> {
        const url = `${ChatApiService.API_BASE.replace(/\/$/, '')}/api/v1/history/${sessionId}`;
        const res = await fetch(url, { headers: await ChatApiService.buildHeaders() });
        if (!res.ok) throw new Error(`History fetch error ${res.status}`);
        return await res.json();
    }
}
