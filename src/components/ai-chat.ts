import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';

const VERSION = '0.2.4';

export interface FAQ {
  "no.": string;
  question: string;
}

export interface Message {
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
@customElement('ai-chat')
export class AIChat extends LitElement {
  static styles = css`
    :host {
      font-family: system-ui, -apple-system, sans-serif;
      color: #09090b;
    }

    /* Fullscreen mode (default) */
    :host([mode="fullscreen"]) {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #fafafa;
    }

    :host([mode="fullscreen"][theme="dark"]) {
      background: #000;
      color: #fafafa;
    }

    /* Widget mode */
    :host([mode="widget"]) {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
    }

    .widget-container {
      position: relative;
    }

    .widget-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #2563eb;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .widget-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .widget-button svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    .widget-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      height: 600px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: scale(0.9) translateY(20px);
      pointer-events: none;
      transition: opacity 0.2s, transform 0.2s;
    }

    .widget-window.open {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: all;
    }

    :host([theme="dark"]) .widget-window {
      background: #18181b;
      color: #fafafa;
    }

    @media (max-width: 480px) {
      .widget-window {
        width: calc(100vw - 40px);
        height: calc(100vh - 100px);
        bottom: 80px;
        right: 0;
      }
    }

    .header {
      border-bottom: 1px solid #e4e4e7;
      background: #fff;
      padding: 1rem;
    }

    :host([theme="dark"]) .header {
      border-bottom-color: #27272a;
      background: #18181b;
    }

    .header-content {
      max-width: 56rem;
      margin: 0 auto;
    }

    .title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .messages-area {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem 1rem;
      position: relative;
    }

    .messages-area::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: var(--background-image-url);
      background-size: 200px auto 60%;
      background-position: center center;
      background-repeat: no-repeat;
      opacity: 0.5;
      pointer-events: none;
      z-index: 0;
    }

    .messages-container {
      max-width: 56rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      position: relative;
      z-index: 1;
    }

    .empty-state {
      text-align: center;
      color: #71717a;
      margin-top: 5rem;
    }

    :host([theme="dark"]) .empty-state {
      color: #a1a1aa;
    }

    .empty-state p {
      font-size: 1.5rem;
      font-weight: 500;
      margin: 0;
    }

    .message {
      display: flex;
      gap: 1rem;
    }

    .message.user {
      flex-direction: row-reverse;
    }

    .avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 9999px;
      background: #e4e4e7;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-weight: 500;
      font-size: 0.875rem;
      overflow: hidden;
    }

    :host([theme="dark"]) .avatar {
      background: #3f3f46;
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .message-content {
      max-width: 36rem;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
    }

    .message.user .message-content {
      background: #2563eb;
      color: #fff;
    }

    .message.assistant .message-content {
      background: #fff;
      border: 1px solid #e4e4e7;
      color: #09090b;
    }

    :host([theme="dark"]) .message.assistant .message-content {
      background: #27272a;
      border-color: #3f3f46;
      color: #fafafa;
    }

    .message-text {
      white-space: pre-wrap;
      margin: 0;
    }

    .faq-section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e4e4e7;
    }

    :host([theme="dark"]) .faq-section {
      border-top-color: #3f3f46;
    }

    .faq-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #3f3f46;
      margin: 0 0 0.5rem 0;
    }

    :host([theme="dark"]) .faq-title {
      color: #d4d4d8;
    }

    .faq-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .faq-item {
      font-size: 0.875rem;
      color: #52525b;
      padding: 0.5rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
    }

    .faq-item:hover {
      background-color: #f4f4f5;
      color: #18181b;
    }

    :host([theme="dark"]) .faq-item {
      color: #a1a1aa;
    }

    :host([theme="dark"]) .faq-item:hover {
      background-color: #27272a;
      color: #fafafa;
    }

    .loading {
      display: flex;
      gap: 1rem;
    }

    .spinner {
      display: inline-block;
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid #e4e4e7;
      border-top-color: #71717a;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .input-area {
      border-top: 1px solid #e4e4e7;
      background: #fff;
      padding: 1rem;
    }

    :host([theme="dark"]) .input-area {
      border-top-color: #27272a;
      background: #000;
    }

    .input-form {
      max-width: 56rem;
      margin: 0 auto;
      display: flex;
      gap: 0.75rem;
    }

    .input-field {
      flex: 1;
      height: 3rem;
      padding: 0 1rem;
      border: 1px solid #e4e4e7;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-family: inherit;
      background: #fff;
      color: #09090b;
    }

    :host([theme="dark"]) .input-field {
      border-color: #3f3f46;
      background: #18181b;
      color: #fafafa;
    }

    .input-field:focus {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }

    .input-field:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .send-button {
      width: 3rem;
      height: 3rem;
      border-radius: 9999px;
      border: none;
      background: #2563eb;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .send-button:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .send-icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    .version-tag {
      text-align: center;
      padding: 0.5rem;
      font-size: 0.75rem;
      color: #71717a;
      border-top: 1px solid #e4e4e7;
    }

    :host([theme="dark"]) .version-tag {
      color: #a1a1aa;
      border-top-color: #27272a;
    }
  `;

  declare apiUrl: string;
  declare sessionId: string;
  declare chatTitle: string;
  declare theme: 'light' | 'dark';
  declare mode: 'fullscreen' | 'widget';
  declare initialMessages: Message[];
  declare botAvatarUrl: string;
  declare backgroundImageUrl: string;

  @state()
  private declare messages: Message[];

  @state()
  private declare input: string;

  @state()
  private declare isLoading: boolean;

  @state()
  private declare isOpen: boolean;

  private messagesEndRef?: HTMLDivElement;

  static override properties = {
    apiUrl: { type: String, attribute: 'api-url' },
    sessionId: { type: String, attribute: 'session-id' },
    chatTitle: { type: String, attribute: 'title' },
    theme: { type: String },
    mode: { type: String, reflect: true },
    initialMessages: { type: Array },
    botAvatarUrl: { type: String, attribute: 'bot-avatar-url' },
    backgroundImageUrl: { type: String, attribute: 'background-image-url' },
  };

  constructor() {
    super();
    this.apiUrl = '';
    this.sessionId = 'default-session';
    this.chatTitle = 'My AI Agent';
    this.theme = 'light';
    this.mode = 'fullscreen';
    this.initialMessages = [];
    this.botAvatarUrl = '';
    this.backgroundImageUrl = '';
    this.messages = [];
    this.input = '';
    this.isLoading = false;
    this.isOpen = false;
  }

  private toggleWidget() {
    this.isOpen = !this.isOpen;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.initialMessages && this.initialMessages.length > 0) {
      this.messages = [...this.initialMessages];
    }
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('messages')) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    requestAnimationFrame(() => {
      this.messagesEndRef?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  private handleInput(e: Event) {
    this.input = (e.target as HTMLInputElement).value;
  }

  private handleFAQClick(question: string) {
    if (this.isLoading) return;

    // Set the input and trigger submit
    this.input = question;

    // Create a synthetic submit event
    const submitEvent = new Event('submit', { cancelable: true });
    this.handleSubmit(submitEvent);
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();

    if (!this.input.trim() || this.isLoading || !this.apiUrl) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: this.input.trim(),
    };

    this.messages = [...this.messages, userMessage];
    const questionText = this.input.trim();
    this.input = '';
    this.isLoading = true;

    // Dispatch message-sent event
    this.dispatchEvent(new CustomEvent('message-sent', {
      detail: userMessage,
      bubbles: true,
      composed: true,
    }));

    try {
      const response = await fetch(`${this.apiUrl}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
          question: questionText,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('🔍 Raw API response:', data);

      // Extract the response text and FAQs properly
      let responseText = 'No response from agent';
      let faqs: FAQ[] | undefined = undefined;

      if (data && typeof data === 'object' && data.response && typeof data.response === 'string') {
        console.log('📝 data.response type:', typeof data.response);
        console.log('📝 data.response preview:', data.response.substring(0, 100));

        // Check if data.response contains stringified JSON
        const trimmedResponse = data.response.trim();
        if (trimmedResponse.startsWith('{') || trimmedResponse.startsWith('[')) {
          console.log('🔄 Detected stringified JSON, parsing...');

          try {
            // First attempt: standard JSON.parse
            let innerData = JSON.parse(data.response);
            console.log('✅ Parsed inner data with JSON.parse');

            if (innerData && innerData.response && typeof innerData.response === 'string') {
              responseText = innerData.response;
              faqs = innerData.faqs_used || undefined;
              console.log('✅ Extracted text length:', responseText.length);
              console.log('✅ Extracted FAQs count:', faqs?.length || 0);
            } else {
              responseText = data.response;
              faqs = data.faqs_used || undefined;
            }
          } catch (parseError) {
            console.warn('⚠️ JSON.parse failed, using regex extraction...', parseError);

            // Backend has malformed JSON - extract response text
            const responsePattern = /"response"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/s;
            const responseMatch = data.response.match(responsePattern);

            if (responseMatch) {
              responseText = responseMatch[1]
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\r/g, '\r')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');
              console.log('✅ Extracted response text, length:', responseText.length);
            } else {
              console.error('❌ Could not extract response');
              responseText = 'Error: Could not parse response';
            }

            // Extract FAQs array
            const faqsPattern = /"faqs_used"\s*:\s*(\[[^\]]*\])/s;
            const faqsMatch = data.response.match(faqsPattern);

            if (faqsMatch) {
              try {
                faqs = JSON.parse(faqsMatch[1]);
                console.log('✅ Extracted FAQs, count:', faqs?.length || 0);
              } catch {
                console.log('⚠️ Could not parse FAQs, trying multiline...');
                // FAQs might span multiple lines
                const faqsMultiPattern = /"faqs_used"\s*:\s*(\[[\s\S]*?\n\s*\])/;
                const faqsMultiMatch = data.response.match(faqsMultiPattern);
                if (faqsMultiMatch) {
                  try {
                    faqs = JSON.parse(faqsMultiMatch[1]);
                    console.log('✅ Extracted multi-line FAQs, count:', faqs?.length || 0);
                  } catch {
                    faqs = undefined;
                  }
                }
              }
            }
          }
        } else {
          // Not JSON, direct text response
          console.log('📄 Direct text response (not JSON)');
          responseText = data.response;
          faqs = data.faqs_used || undefined;
        }
      } else if (typeof data === 'string') {
        console.log('📄 Response is a plain string');
        responseText = data;
      } else if (data && typeof data === 'object') {
        // Fallback for other formats
        console.warn('⚠️ Unexpected format, using fallback');
        responseText = data.message || data.answer || 'Error: Unexpected response format';
      }

      console.log('🎯 Final responseText length:', responseText.length);
      console.log('🎯 Final responseText preview:', responseText.substring(0, 100));
      console.log('🎯 Final FAQs:', faqs);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        faqs: faqs,
      };

      this.messages = [...this.messages, assistantMessage];

      // Dispatch response-received event
      this.dispatchEvent(new CustomEvent('response-received', {
        detail: assistantMessage,
        bubbles: true,
        composed: true,
      }));
    } catch (err) {
      console.error('Backend connection failed:', err);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Unknown error'}\n\nPlease check your API endpoint configuration.`,
      };

      this.messages = [...this.messages, errorMessage];

      // Dispatch error event
      this.dispatchEvent(new CustomEvent('error', {
        detail: err,
        bubbles: true,
        composed: true,
      }));
    } finally {
      this.isLoading = false;
    }
  }

  private renderChatUI() {
    return html`
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <h1 class="title">${this.chatTitle}</h1>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="messages-area" style="${this.backgroundImageUrl ? `--background-image-url: url('${this.backgroundImageUrl}')` : ''}">
        <div class="messages-container">
          ${this.messages.length === 0 ? html`
            <div class="empty-state">
              <p>How can I help you today?</p>
            </div>
          ` : ''}

          ${repeat(this.messages, (msg) => msg.id, (msg) => html`
            <div class=${classMap({
              message: true,
              user: msg.role === 'user',
              assistant: msg.role === 'assistant'
            })}>
              <div class="avatar">
                ${msg.role === 'user'
                  ? 'U'
                  : this.botAvatarUrl
                    ? html`<img src="${this.botAvatarUrl}" alt="AI" class="avatar-image" />`
                    : 'AI'}
              </div>
              <div class="message-content">
                <p class="message-text">${msg.content}</p>
                ${msg.role === 'assistant' && msg.faqs && msg.faqs.length > 0 ? html`
                  <div class="faq-section">
                    <p class="faq-title">Related FAQs:</p>
                    <ul class="faq-list">
                      ${msg.faqs.map(faq => html`
                        <li class="faq-item" @click=${() => this.handleFAQClick(faq.question)}>
                          ${faq.question}
                        </li>
                      `)}
                    </ul>
                  </div>
                ` : ''}
              </div>
            </div>
          `)}

          ${this.isLoading ? html`
            <div class="loading">
              <div class="avatar">
                ${this.botAvatarUrl
                  ? html`<img src="${this.botAvatarUrl}" alt="AI" class="avatar-image" />`
                  : 'AI'}
              </div>
              <div class="message-content">
                <div class="spinner"></div>
              </div>
            </div>
          ` : ''}

          <div ${(el: Element) => this.messagesEndRef = el as HTMLDivElement}></div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <form class="input-form" @submit=${this.handleSubmit}>
          <input
            type="text"
            class="input-field"
            placeholder="Type your message..."
            .value=${this.input}
            @input=${this.handleInput}
            ?disabled=${this.isLoading}
          />
          <button
            type="submit"
            class="send-button"
            ?disabled=${this.isLoading || !this.input.trim()}
            aria-label="Send message"
          >
            ${this.isLoading ? html`
              <div class="spinner" style="border-color: #fff; border-top-color: transparent;"></div>
            ` : html`
              <svg class="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            `}
          </button>
        </form>
      </div>

      <!-- Version -->
      <div class="version-tag">v${VERSION}</div>
    `;
  }

  render() {
    if (this.mode === 'widget') {
      return html`
        <div class="widget-container">
          <!-- Chat Window -->
          <div class=${classMap({ 'widget-window': true, 'open': this.isOpen })}>
            ${this.renderChatUI()}
          </div>

          <!-- Toggle Button -->
          <button
            class="widget-button"
            @click=${this.toggleWidget}
            aria-label=${this.isOpen ? 'Close chat' : 'Open chat'}
          >
            ${this.isOpen ? html`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ` : html`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            `}
          </button>
        </div>
      `;
    }

    // Fullscreen mode
    return this.renderChatUI();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ai-chat': AIChat;
  }
}
