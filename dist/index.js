'use strict';

var lit = require('lit');
var decorators_js = require('lit/decorators.js');
var repeat_js = require('lit/directives/repeat.js');
var classMap_js = require('lit/directives/class-map.js');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var VERSION = "0.2.6";
exports.AIChat = class AIChat extends lit.LitElement {
  constructor() {
    super();
    this.apiUrl = "";
    this.sessionId = "default-session";
    this.chatTitle = "My AI Agent";
    this.theme = "light";
    this.mode = "fullscreen";
    this.initialMessages = [];
    this.botAvatarUrl = "";
    this.backgroundImageUrl = "";
    this.widgetWidth = "380px";
    this.widgetHeight = "600px";
    this.primaryColor = "#3681D3";
    this.primaryColorHover = "#3457C7";
    this.userMessageBg = "#D6E4FF";
    this.botMessageBg = "#F5F5F5";
    this.messages = [];
    this.input = "";
    this.isLoading = false;
    this.isOpen = false;
  }
  toggleWidget() {
    this.isOpen = !this.isOpen;
  }
  lightenColor(hex, percent = 15) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const newR = Math.min(255, Math.round(r + (255 - r) * (percent / 100)));
    const newG = Math.min(255, Math.round(g + (255 - g) * (percent / 100)));
    const newB = Math.min(255, Math.round(b + (255 - b) * (percent / 100)));
    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.initialMessages && this.initialMessages.length > 0) {
      this.messages = [...this.initialMessages];
    }
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("messages")) {
      this.scrollToBottom();
    }
  }
  scrollToBottom() {
    requestAnimationFrame(() => {
      this.messagesEndRef?.scrollIntoView({ behavior: "smooth" });
    });
  }
  handleInput(e) {
    this.input = e.target.value;
  }
  handleFAQClick(question) {
    if (this.isLoading) return;
    this.input = question;
    const submitEvent = new Event("submit", { cancelable: true });
    this.handleSubmit(submitEvent);
  }
  async handleSubmit(e) {
    e.preventDefault();
    if (!this.input.trim() || this.isLoading || !this.apiUrl) return;
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: this.input.trim()
    };
    this.messages = [...this.messages, userMessage];
    const questionText = this.input.trim();
    this.input = "";
    this.isLoading = true;
    this.dispatchEvent(new CustomEvent("message-sent", {
      detail: userMessage,
      bubbles: true,
      composed: true
    }));
    try {
      const response = await fetch(`${this.apiUrl}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: this.sessionId,
          question: questionText
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      console.log("\u{1F50D} Raw API response:", data);
      let responseText = "No response from agent";
      let faqs = void 0;
      let suggestedQuestions = void 0;
      if (data && typeof data === "object" && data.response && typeof data.response === "string") {
        console.log("\u{1F4DD} data.response type:", typeof data.response);
        console.log("\u{1F4DD} data.response preview:", data.response.substring(0, 100));
        const trimmedResponse = data.response.trim();
        if (trimmedResponse.startsWith("{") || trimmedResponse.startsWith("[")) {
          console.log("\u{1F504} Detected stringified JSON, parsing...");
          try {
            let innerData = JSON.parse(data.response);
            console.log("\u2705 Parsed inner data with JSON.parse");
            if (innerData && innerData.response && typeof innerData.response === "string") {
              responseText = innerData.response;
              faqs = innerData.faq_used || innerData.faqs_used || void 0;
              suggestedQuestions = innerData.suggested_follow_ups || innerData.suggested_questions || void 0;
              console.log("\u2705 Extracted text length:", responseText.length);
              console.log("\u2705 Extracted FAQs count:", faqs?.length || 0);
              console.log("\u2705 Extracted suggested questions count:", suggestedQuestions?.length || 0);
            } else {
              responseText = data.response;
              faqs = data.faq_used || data.faqs_used || void 0;
              suggestedQuestions = data.suggested_follow_ups || data.suggested_questions || void 0;
            }
          } catch (parseError) {
            console.warn("\u26A0\uFE0F JSON.parse failed, using regex extraction...", parseError);
            const responsePattern = /"response"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/s;
            const responseMatch = data.response.match(responsePattern);
            if (responseMatch) {
              responseText = responseMatch[1].replace(/\\n/g, "\n").replace(/\\t/g, "	").replace(/\\r/g, "\r").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
              console.log("\u2705 Extracted response text, length:", responseText.length);
            } else {
              console.error("\u274C Could not extract response");
              responseText = "Error: Could not parse response";
            }
            const faqsPattern = /"(?:faq_used|faqs_used)"\s*:\s*(\[[^\]]*\])/s;
            const faqsMatch = data.response.match(faqsPattern);
            if (faqsMatch) {
              try {
                faqs = JSON.parse(faqsMatch[1]);
                console.log("\u2705 Extracted FAQs, count:", faqs?.length || 0);
              } catch {
                console.log("\u26A0\uFE0F Could not parse FAQs, trying multiline...");
                const faqsMultiPattern = /"(?:faq_used|faqs_used)"\s*:\s*(\[[\s\S]*?\n\s*\])/;
                const faqsMultiMatch = data.response.match(faqsMultiPattern);
                if (faqsMultiMatch) {
                  try {
                    faqs = JSON.parse(faqsMultiMatch[1]);
                    console.log("\u2705 Extracted multi-line FAQs, count:", faqs?.length || 0);
                  } catch {
                    faqs = void 0;
                  }
                }
              }
            }
            const suggestedPattern = /"(?:suggested_follow_ups|suggested_questions)"\s*:\s*(\[[^\]]*\])/s;
            const suggestedMatch = data.response.match(suggestedPattern);
            if (suggestedMatch) {
              try {
                suggestedQuestions = JSON.parse(suggestedMatch[1]);
                console.log("\u2705 Extracted suggested questions, count:", suggestedQuestions?.length || 0);
              } catch {
                console.log("\u26A0\uFE0F Could not parse suggested questions, trying multiline...");
                const suggestedMultiPattern = /"(?:suggested_follow_ups|suggested_questions)"\s*:\s*(\[[\s\S]*?\n\s*\])/;
                const suggestedMultiMatch = data.response.match(suggestedMultiPattern);
                if (suggestedMultiMatch) {
                  try {
                    suggestedQuestions = JSON.parse(suggestedMultiMatch[1]);
                    console.log("\u2705 Extracted multi-line suggested questions, count:", suggestedQuestions?.length || 0);
                  } catch {
                    suggestedQuestions = void 0;
                  }
                }
              }
            }
          }
        } else {
          console.log("\u{1F4C4} Direct text response (not JSON)");
          responseText = data.response;
          faqs = data.faq_used || data.faqs_used || void 0;
          suggestedQuestions = data.suggested_follow_ups || data.suggested_questions || void 0;
        }
      } else if (typeof data === "string") {
        console.log("\u{1F4C4} Response is a plain string");
        responseText = data;
      } else if (data && typeof data === "object") {
        console.warn("\u26A0\uFE0F Unexpected format, using fallback");
        responseText = data.message || data.answer || "Error: Unexpected response format";
        faqs = data.faq_used || data.faqs_used || void 0;
        suggestedQuestions = data.suggested_follow_ups || data.suggested_questions || void 0;
      }
      console.log("\u{1F3AF} Final responseText length:", responseText.length);
      console.log("\u{1F3AF} Final responseText preview:", responseText.substring(0, 100));
      console.log("\u{1F3AF} Final FAQs:", faqs);
      console.log("\u{1F3AF} Final suggested questions:", suggestedQuestions);
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        faqs,
        suggestedQuestions
      };
      this.messages = [...this.messages, assistantMessage];
      this.dispatchEvent(new CustomEvent("response-received", {
        detail: assistantMessage,
        bubbles: true,
        composed: true
      }));
    } catch (err) {
      console.error("Backend connection failed:", err);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${err instanceof Error ? err.message : "Unknown error"}

Please check your API endpoint configuration.`
      };
      this.messages = [...this.messages, errorMessage];
      this.dispatchEvent(new CustomEvent("error", {
        detail: err,
        bubbles: true,
        composed: true
      }));
    } finally {
      this.isLoading = false;
    }
  }
  renderChatUI() {
    const primaryColorLight = this.lightenColor(this.primaryColor, 15);
    return lit.html`
      <!-- Header -->
      <div class="header" style="--primary-color: ${this.primaryColor}; --primary-color-light: ${primaryColorLight}; --primary-color-hover: ${this.primaryColorHover};">
        <div class="header-content">
          <div class="header-avatar">
            ${this.botAvatarUrl ? lit.html`<img src="${this.botAvatarUrl}" alt="Bot" class="header-avatar-image" />` : lit.html`<svg viewBox="0 0 24 24" fill="none" stroke="${this.primaryColor}" stroke-width="2" style="width: 1.5rem; height: 1.5rem;">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>`}
          </div>
          <h1 class="title">${this.chatTitle}</h1>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="messages-area" style="--user-message-bg: ${this.userMessageBg}; --bot-message-bg: ${this.botMessageBg}; --primary-color: ${this.primaryColor}; --primary-color-light: ${primaryColorLight}; --primary-color-hover: ${this.primaryColorHover}; ${this.backgroundImageUrl ? `--background-image-url: url('${this.backgroundImageUrl}');` : ""}">
        <div class="messages-container">
          ${this.messages.length === 0 ? lit.html`
            <div class="empty-state">
              <p>How can I help you today?</p>
            </div>
          ` : ""}

          ${repeat_js.repeat(this.messages, (msg) => msg.id, (msg) => lit.html`
            <div class=${classMap_js.classMap({
      message: true,
      user: msg.role === "user",
      assistant: msg.role === "assistant"
    })}>
              <div class="avatar">
                ${msg.role === "user" ? "U" : this.botAvatarUrl ? lit.html`<img src="${this.botAvatarUrl}" alt="AI" class="avatar-image" />` : "AI"}
              </div>
              <div class="message-content">
                <p class="message-text">${msg.content}</p>
                ${msg.role === "assistant" && msg.faqs && msg.faqs.length > 0 ? lit.html`
                  <div class="faq-section">
                    <p class="faq-title">Related FAQs:</p>
                    <ul class="faq-list">
                      ${msg.faqs.map((faq) => lit.html`
                        <li class="faq-item" @click=${() => this.handleFAQClick(faq.question)}>
                          ${faq.question}
                        </li>
                      `)}
                    </ul>
                  </div>
                ` : ""}
                ${msg.role === "assistant" && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 ? lit.html`
                  <div class="faq-section">
                    <p class="faq-title">Suggested Questions:</p>
                    <ul class="faq-list">
                      ${msg.suggestedQuestions.map((question) => lit.html`
                        <li class="faq-item" @click=${() => this.handleFAQClick(question)}>
                          ${question}
                        </li>
                      `)}
                    </ul>
                  </div>
                ` : ""}
              </div>
            </div>
          `)}

          ${this.isLoading ? lit.html`
            <div class="loading">
              <div class="avatar">
                ${this.botAvatarUrl ? lit.html`<img src="${this.botAvatarUrl}" alt="AI" class="avatar-image" />` : "AI"}
              </div>
              <div class="message-content">
                <div class="spinner"></div>
              </div>
            </div>
          ` : ""}

          <div ${(el) => this.messagesEndRef = el}></div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area" style="--primary-color: ${this.primaryColor}; --primary-color-hover: ${this.primaryColorHover};">
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
            ${this.isLoading ? lit.html`
              <div class="spinner" style="border-color: #fff; border-top-color: transparent;"></div>
            ` : lit.html`
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
    const primaryColorLight = this.lightenColor(this.primaryColor, 15);
    if (this.mode === "widget") {
      return lit.html`
        <div class="widget-container">
          <!-- Chat Window -->
          <div
            class=${classMap_js.classMap({ "widget-window": true, "open": this.isOpen })}
            style="--widget-width: ${this.widgetWidth}; --widget-height: ${this.widgetHeight};"
          >
            ${this.renderChatUI()}
          </div>

          <!-- Toggle Button -->
          <button
            class="widget-button"
            style="--primary-color: ${this.primaryColor}; --primary-color-light: ${primaryColorLight};"
            @click=${this.toggleWidget}
            aria-label=${this.isOpen ? "Close chat" : "Open chat"}
          >
            ${this.isOpen ? lit.html`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ` : lit.html`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            `}
          </button>
        </div>
      `;
    }
    return this.renderChatUI();
  }
};
exports.AIChat.styles = lit.css`
    :host {
      font-family: system-ui, -apple-system, sans-serif;
      color: #09090b;
    }

    /* Fullscreen mode (default) */
    :host([mode="fullscreen"]) {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #ffffff;
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
      background: #3681D3;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(65, 105, 225, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .widget-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(65, 105, 225, 0.4);
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
      width: var(--widget-width, 380px);
      height: var(--widget-height, 600px);
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
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

    /* Tablet breakpoint */
    @media (max-width: 1024px) and (min-width: 769px) {
      .widget-window {
        width: var(--widget-width, 400px);
        height: var(--widget-height, 650px);
      }
    }

    /* Small tablet breakpoint */
    @media (max-width: 768px) and (min-width: 481px) {
      .widget-window {
        width: var(--widget-width, 360px);
        height: var(--widget-height, 550px);
      }
    }

    /* Mobile portrait */
    @media (max-width: 480px) and (orientation: portrait) {
      .widget-window {
        width: calc(100vw - 40px);
        height: 70vh;
        bottom: 80px;
        right: 0;
      }

      .widget-button {
        width: 56px;
        height: 56px;
      }

      .widget-button svg {
        width: 24px;
        height: 24px;
      }
    }

    /* Mobile landscape */
    @media (max-width: 900px) and (orientation: landscape) {
      .widget-window {
        width: var(--widget-width, 500px);
        height: calc(100vh - 100px);
        bottom: 80px;
        right: 0;
      }

      .widget-button {
        width: 56px;
        height: 56px;
      }

      .widget-button svg {
        width: 24px;
        height: 24px;
      }
    }

    /* Mobile responsive styles for all modes */
    @media (max-width: 768px) {
      .header {
        padding: 0.875rem 1rem;
      }

      .header-avatar {
        width: 2.25rem;
        height: 2.25rem;
      }

      .title {
        font-size: 1.125rem;
      }

      .messages-area {
        padding: 1rem 0.75rem;
      }

      .message {
        gap: 0.75rem;
      }

      .avatar {
        width: 2rem;
        height: 2rem;
        font-size: 0.75rem;
      }

      .message-content {
        max-width: 100%;
        padding: 0.625rem 0.875rem;
        font-size: 0.9375rem;
      }

      .empty-state {
        margin-top: 3rem;
      }

      .empty-state p {
        font-size: 1.25rem;
        padding: 0 1rem;
      }

      .faq-section {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
      }

      .faq-item {
        font-size: 0.8125rem;
        padding: 0.375rem;
      }

      .input-area {
        padding: 0.75rem;
      }

      .input-form {
        gap: 0.5rem;
      }

      .input-field {
        height: 2.75rem;
        padding: 0 0.875rem;
        font-size: 0.9375rem;
      }

      .send-button {
        width: 2.75rem;
        height: 2.75rem;
        flex-shrink: 0;
      }

      .send-icon {
        width: 1.125rem;
        height: 1.125rem;
      }
    }

    /* Extra small screens */
    @media (max-width: 480px) {
      .header {
        padding: 0.75rem 0.875rem;
      }

      .header-avatar {
        width: 2rem;
        height: 2rem;
      }

      .title {
        font-size: 1rem;
      }

      .messages-area {
        padding: 0.75rem 0.5rem;
      }

      .message {
        gap: 0.5rem;
      }

      .avatar {
        width: 1.75rem;
        height: 1.75rem;
        font-size: 0.7rem;
      }

      .message-content {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        border-radius: 0.75rem;
      }

      .empty-state {
        margin-top: 2rem;
      }

      .empty-state p {
        font-size: 1.125rem;
      }

      .input-area {
        padding: 0.625rem;
      }

      .input-field {
        height: 2.5rem;
        padding: 0 0.75rem;
        font-size: 0.875rem;
      }

      .send-button {
        width: 2.5rem;
        height: 2.5rem;
      }

      .version-tag {
        font-size: 0.7rem;
        padding: 0.375rem;
      }
    }

    .header {
      background:#3681D3;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      box-shadow: 0 2px 8px rgba(65, 105, 225, 0.2);
    }

    :host([theme="dark"]) .header {
      background: #3681D3
    }

    .header-content {
      max-width: 56rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
    }

    .header-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }

    .header-avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color: #fff;
    }

    .messages-area {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem 1rem;
      position: relative;
      background: #ffffff;
    }

    :host([theme="dark"]) .messages-area {
      background: #000;
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
      opacity: 0.03;
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
      color: #9ca3af;
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
      background: #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-weight: 600;
      font-size: 0.875rem;
      overflow: hidden;
      color: #6B7280;
    }

    :host([theme="dark"]) .avatar {
      background: #3f3f46;
      color: #9ca3af;
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .message-content {
      max-width: 36rem;
      padding: 0.875rem 1.125rem;
      border-radius: 1.25rem;
      line-height: 1.6;
    }

    .message.user .message-content {
      background: var(--user-message-bg, #D6E4FF);
      color: #1a1a1a;
      border-radius: 1.25rem 1.25rem 0.25rem 1.25rem;
    }

    .message.assistant .message-content {
      background: var(--bot-message-bg, #F5F5F5);
      color: #1a1a1a;
      border-radius: 1.25rem 1.25rem 1.25rem 0.25rem;
    }

    :host([theme="dark"]) .message.user .message-content {
      background: #3D5A99;
      color: #fff;
    }

    :host([theme="dark"]) .message.assistant .message-content {
      background: #27272a;
      color: #fafafa;
    }

    .message-text {
      white-space: pre-wrap;
      margin: 0;
    }

    .faq-section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #d1d5db;
    }

    :host([theme="dark"]) .faq-section {
      border-top-color: #3f3f46;
    }

    .faq-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--primary-color, #3681D3);
      margin: 0 0 0.5rem 0;
    }

    :host([theme="dark"]) .faq-title {
      color: var(--primary-color-light, #5B7FE8);
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
      color: var(--primary-color, #3681D3);
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
      border: 1px solid transparent;
    }

    .faq-item:hover {
      background-color: #EEF2FF;
      color: var(--primary-color-hover, #3457C7);
      border-color: #C7D2FE;
    }

    :host([theme="dark"]) .faq-item {
      color: var(--primary-color-light, #5B7FE8);
    }

    :host([theme="dark"]) .faq-item:hover {
      background-color: #1e293b;
      color: #93C5FD;
      border-color: #3f3f46;
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
      border-top: 1px solid #e5e7eb;
      background: #fff;
      padding: 1rem 1.25rem;
    }

    :host([theme="dark"]) .input-area {
      border-top-color: #27272a;
      background: #18181b;
    }

    .input-form {
      max-width: 56rem;
      margin: 0 auto;
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .input-field {
      flex: 1;
      height: 3rem;
      padding: 0 1rem;
      border: 1px solid #d1d5db;
      border-radius: 1.5rem;
      font-size: 0.9375rem;
      font-family: inherit;
      background: #fff;
      color: #374151;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input-field::placeholder {
      color: #9ca3af;
    }

    :host([theme="dark"]) .input-field {
      border-color: #3f3f46;
      background: #18181b;
      color: #fafafa;
    }

    .input-field:focus {
      outline: none;
      border-color: var(--primary-color, #3681D3);
      box-shadow: 0 0 0 3px rgba(65, 105, 225, 0.1);
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
      background: var(--primary-color, #3681D3);
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, transform 0.1s;
      flex-shrink: 0;
    }

    .send-button:hover:not(:disabled) {
      background: var(--primary-color-hover, #3457C7);
      transform: scale(1.05);
    }

    .send-button:active:not(:disabled) {
      transform: scale(0.95);
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
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
    }

    :host([theme="dark"]) .version-tag {
      color: #6b7280;
      border-top-color: #27272a;
    }
  `;
exports.AIChat.properties = {
  apiUrl: { type: String, attribute: "api-url" },
  sessionId: { type: String, attribute: "session-id" },
  chatTitle: { type: String, attribute: "title" },
  theme: { type: String },
  mode: { type: String, reflect: true },
  initialMessages: { type: Array },
  botAvatarUrl: { type: String, attribute: "bot-avatar-url" },
  backgroundImageUrl: { type: String, attribute: "background-image-url" },
  widgetWidth: { type: String, attribute: "widget-width" },
  widgetHeight: { type: String, attribute: "widget-height" },
  primaryColor: { type: String, attribute: "primary-color" },
  primaryColorHover: { type: String, attribute: "primary-color-hover" },
  userMessageBg: { type: String, attribute: "user-message-bg" },
  botMessageBg: { type: String, attribute: "bot-message-bg" }
};
__decorateClass([
  decorators_js.state()
], exports.AIChat.prototype, "messages", 2);
__decorateClass([
  decorators_js.state()
], exports.AIChat.prototype, "input", 2);
__decorateClass([
  decorators_js.state()
], exports.AIChat.prototype, "isLoading", 2);
__decorateClass([
  decorators_js.state()
], exports.AIChat.prototype, "isOpen", 2);
exports.AIChat = __decorateClass([
  decorators_js.customElement("ai-chat")
], exports.AIChat);
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map