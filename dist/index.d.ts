import * as lit_html from 'lit-html';
import * as lit from 'lit';
import { LitElement, PropertyValues } from 'lit';

interface FAQ {
    "no.": string;
    question: string;
}
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    faqs?: FAQ[];
}
/**
 * AI Chat Web Component
 *
 * @fires message-sent - Fired when user sends a message
 * @fires response-received - Fired when AI responds
 * @fires error - Fired when an error occurs
 *
 * @example
 * ```html
 * <ai-chat
 *   api-url="https://api.example.com"
 *   session-id="user-123"
 *   title="My AI Assistant">
 * </ai-chat>
 * ```
 */
declare class AIChat extends LitElement {
    static styles: lit.CSSResult;
    apiUrl: string;
    sessionId: string;
    chatTitle: string;
    theme: 'light' | 'dark';
    mode: 'fullscreen' | 'widget';
    initialMessages: Message[];
    botAvatarUrl: string;
    backgroundImageUrl: string;
    private messages;
    private input;
    private isLoading;
    private isOpen;
    private messagesEndRef?;
    static properties: {
        apiUrl: {
            type: StringConstructor;
            attribute: string;
        };
        sessionId: {
            type: StringConstructor;
            attribute: string;
        };
        chatTitle: {
            type: StringConstructor;
            attribute: string;
        };
        theme: {
            type: StringConstructor;
        };
        mode: {
            type: StringConstructor;
            reflect: boolean;
        };
        initialMessages: {
            type: ArrayConstructor;
        };
        botAvatarUrl: {
            type: StringConstructor;
            attribute: string;
        };
        backgroundImageUrl: {
            type: StringConstructor;
            attribute: string;
        };
    };
    constructor();
    private toggleWidget;
    connectedCallback(): void;
    updated(changedProperties: PropertyValues): void;
    private scrollToBottom;
    private handleInput;
    private handleFAQClick;
    private handleSubmit;
    private renderChatUI;
    render(): lit_html.TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'ai-chat': AIChat;
    }
}

export { AIChat, type Message };
