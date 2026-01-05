import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import MarkdownIt from 'markdown-it';

console.log('Chatbot Ver = 0.2.21-beta.2');
const md = new MarkdownIt({
  html: false, // Disable HTML tags in source for security
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
});

export interface FAQ {
  No: string;
  Question: string;
}

export interface Confidence {
  confidence_score: number;
  is_confident: boolean;
}

export interface SuggestedQuestion {
  // New API format (capitalized)
  Id?: string;
  QuestionType?: string;
  // Legacy format (lowercase)
  id?: number;
  question_type?: string;
  // Question text (fetched separately or provided)
  question_text: string;
  category?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  faqs?: FAQ[];
  suggestedQuestions?: SuggestedQuestion[];
  confidence?: Confidence;
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
 * <!-- Basic usage -->
 * <ai-chat
 *   api-url="https://api.example.com"
 *   session-id="user-123"
 *   title="My AI Assistant">
 * </ai-chat>
 *
 * <!-- Widget mode with custom size -->
 * <ai-chat
 *   api-url="https://api.example.com"
 *   session-id="user-123"
 *   title="My AI Assistant"
 *   mode="widget"
 *   widget-width="400px"
 *   widget-height="650px">
 * </ai-chat>
 *
 * <!-- Custom theme colors -->
 * <ai-chat
 *   api-url="https://api.example.com"
 *   session-id="user-123"
 *   title="My AI Assistant"
 *   primary-color="#10B981"
 *   primary-color-hover="#059669"
 *   user-message-bg="#D1FAE5"
 *   bot-message-bg="#F3F4F6">
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
      overflow: hidden;
    }

    .widget-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(65, 105, 225, 0.4);
    }

    .widget-button-no-bg {
      background: transparent;
      box-shadow: none;
    }

    .widget-button-no-bg:hover {
      background: transparent;
      box-shadow: none;
      transform: scale(1.1);
    }

    .widget-button svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    .widget-button-icon {
      width: 60px;
      height: 60px;
      object-fit: contain;
      border-radius: 50%;
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
      .contact-support-wrapper {
        margin-left: 2.75rem;
      }

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
        padding: 0;
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
      .contact-support-wrapper {
        margin-left: 2.25rem;
      }

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
      margin-top: 5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    :host([theme="dark"]) .empty-state {
      color: #a1a1aa;
    }

    .empty-state-avatar {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      background: #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    :host([theme="dark"]) .empty-state-avatar {
      background: #3f3f46;
    }

    .empty-state-avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .empty-state-avatar svg {
      width: 3rem;
      height: 3rem;
      color: #9ca3af;
    }

    :host([theme="dark"]) .empty-state-avatar svg {
      color: #6b7280;
    }

    .empty-state-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .empty-state-message {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color: #374151;
    }

    :host([theme="dark"]) .empty-state-message {
      color: #f3f4f6;
    }

    .empty-state-subtitle {
      font-size: 0.9375rem;
      margin: 0;
      color: #6b7280;
      max-width: 24rem;
    }

    :host([theme="dark"]) .empty-state-subtitle {
      color: #9ca3af;
    }

    .message {
      display: flex;
      gap: 1rem;
    }

    .message.user {
      flex-direction: row-reverse;
      justify-content: flex-start;
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
      padding: 1.125rem;
      border-radius: 1.25rem;
      line-height: 1.6;
      overflow-wrap: break-word;
      word-wrap: break-word;
      min-width: 0;
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
      margin: 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .message-text p {
      margin: 0 0 0.75rem 0;
    }

    .message-text p:last-child {
      margin-bottom: 0;
    }

    .message-text p:first-child {
      margin-top: 0;
    }

    .message-text ul,
    .message-text ol {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
      white-space: normal;
      list-style-position: outside;
    }

    .message-text li {
      margin: 0.25rem 0;
      white-space: normal;
      display: list-item;
    }

    .message-text ul {
      list-style-type: disc;
    }

    .message-text ol {
      list-style-type: decimal;
      counter-reset: list-counter;
    }

    .message-text ol li {
      display: list-item;
      list-style-type: decimal;
    }

    .message-text h1,
    .message-text h2,
    .message-text h3,
    .message-text h4,
    .message-text h5,
    .message-text h6 {
      margin: 0.75rem 0 0.5rem 0;
      font-weight: 600;
    }

    .message-text h1:first-child,
    .message-text h2:first-child,
    .message-text h3:first-child,
    .message-text h4:first-child,
    .message-text h5:first-child,
    .message-text h6:first-child {
      margin-top: 0;
    }

    .message-text blockquote {
      margin: 0.5rem 0;
      padding-left: 1rem;
      border-left: 3px solid #d1d5db;
    }

    :host([theme="dark"]) .message-text blockquote {
      border-left-color: #3f3f46;
    }

    .message-text code {
      background: rgba(0, 0, 0, 0.05);
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-size: 0.875em;
    }

    :host([theme="dark"]) .message-text code {
      background: rgba(255, 255, 255, 0.1);
    }

    .message-text pre {
      margin: 0.5rem 0;
      padding: 0.75rem;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 0.5rem;
      overflow-x: auto;
    }

    :host([theme="dark"]) .message-text pre {
      background: rgba(255, 255, 255, 0.05);
    }

    .message-text pre code {
      background: transparent;
      padding: 0;
    }

    .faq-section {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid #d1d5db;
    }

    :host([theme="dark"]) .faq-section {
      border-top-color: #3f3f46;
    }

    .faq-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--primary-color, #3681D3);
      margin: 0 0 0.375rem 0;
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
      gap: 0.375rem;
    }

    .faq-item {
      font-size: 0.875rem;
      color: var(--primary-color, #3681D3);
      padding: 0;
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

    /* FAQ static item styles - commented out for now */
    /* .faq-item-static {
      font-size: 0.875rem;
      color: #6B7280;
      padding: 0;
      border-radius: 0.5rem;
      cursor: default;
      border: 1px solid transparent;
    }

    :host([theme="dark"]) .faq-item-static {
      color: #9CA3AF;
    } */

    .low-confidence-warning {
      margin-top: 0.75rem;
      padding: 0.75rem 1rem;
      background: #FEF3C7;
      border-left: 4px solid #F59E0B;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      color: #92400E;
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
    }

    :host([theme="dark"]) .low-confidence-warning {
      background: #451A03;
      border-left-color: #F59E0B;
      color: #FDE68A;
    }

    .warning-icon {
      width: 1.125rem;
      height: 1.125rem;
      flex-shrink: 0;
      margin-top: 0.125rem;
      color: #F59E0B;
    }

    :host([theme="dark"]) .warning-icon {
      color: #FCD34D;
    }

    .contact-support-wrapper {
      display: flex;
      justify-content: flex-start;
      margin-top: 0.75rem;
      margin-left: 3.5rem;
    }

    .contact-support-button {
      padding: 0.625rem 1.25rem;
      background: transparent;
      color: var(--primary-color, #3681D3);
      border: 1.5px solid var(--primary-color, #3681D3);
      border-radius: 1.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-block;
      text-decoration: none;
      white-space: nowrap;
    }

    .contact-support-button:hover {
      background: var(--primary-color, #3681D3);
      color: #fff;
    }

    .contact-support-button:active {
      transform: scale(0.98);
    }

    :host([theme="dark"]) .contact-support-button {
      background: transparent;
      color: var(--primary-color-light, #5B7FE8);
      border-color: var(--primary-color-light, #5B7FE8);
    }

    :host([theme="dark"]) .contact-support-button:hover {
      background: var(--primary-color-light, #5B7FE8);
      color: #18181b;
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

  declare apiUrl: string;
  declare sessionId: string;
  declare chatTitle: string;
  declare theme: 'light' | 'dark';
  declare mode: 'fullscreen' | 'widget';
  declare initialMessages: Message[];
  declare botAvatarUrl: string;
  declare userAvatarUrl: string;
  declare widgetIconUrl: string;
  declare backgroundImageUrl: string;
  declare widgetWidth: string;
  declare widgetHeight: string;
  declare primaryColor: string;
  declare primaryColorHover: string;
  declare userMessageBg: string;
  declare botMessageBg: string;
  declare welcomeMessage: string;
  declare welcomeSubtitle: string;
  declare initialQuestionsUrl: string;
  declare language: string;
  declare showRelatedFaqs: boolean;
  declare errorMessage: string;
  declare lowConfidenceMessage: string;
  declare contactSupportUrl: string;
  declare contactSupportMessage: string;

  @state()
  private declare messages: Message[];

  @state()
  private declare input: string;

  @state()
  private declare isLoading: boolean;

  @state()
  private declare isOpen: boolean;


  static override properties = {
    apiUrl: { type: String, attribute: 'api-url' },
    sessionId: { type: String, attribute: 'session-id' },
    chatTitle: { type: String, attribute: 'title' },
    theme: { type: String },
    mode: { type: String, reflect: true },
    initialMessages: { type: Array },
    botAvatarUrl: { type: String, attribute: 'bot-avatar-url' },
    userAvatarUrl: { type: String, attribute: 'user-avatar-url' },
    widgetIconUrl: { type: String, attribute: 'widget-icon-url' },
    backgroundImageUrl: { type: String, attribute: 'background-image-url' },
    widgetWidth: { type: String, attribute: 'widget-width' },
    widgetHeight: { type: String, attribute: 'widget-height' },
    primaryColor: { type: String, attribute: 'primary-color' },
    primaryColorHover: { type: String, attribute: 'primary-color-hover' },
    userMessageBg: { type: String, attribute: 'user-message-bg' },
    botMessageBg: { type: String, attribute: 'bot-message-bg' },
    welcomeMessage: { type: String, attribute: 'welcome-message' },
    welcomeSubtitle: { type: String, attribute: 'welcome-subtitle' },
    initialQuestionsUrl: { type: String, attribute: 'initial-questions-url' },
    language: { type: String, attribute: 'language' },
    showRelatedFaqs: { type: Boolean, attribute: 'show-related-faqs' },
    errorMessage: { type: String, attribute: 'error-message' },
    lowConfidenceMessage: { type: String, attribute: 'low-confidence-message' },
    contactSupportUrl: { type: String, attribute: 'contact-support-url' },
    contactSupportMessage: { type: String, attribute: 'contact-support-message' },
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
    this.userAvatarUrl = '';
    this.widgetIconUrl = '';
    this.backgroundImageUrl = '';
    this.widgetWidth = '380px';
    this.widgetHeight = '600px';
    this.primaryColor = '#3681D3';
    this.primaryColorHover = '#3457C7';
    this.userMessageBg = '#D6E4FF';
    this.botMessageBg = '#F5F5F5';
    this.welcomeMessage = 'How can I help you today?';
    this.welcomeSubtitle = '';
    this.initialQuestionsUrl = '';
    this.language = 'en';
    this.showRelatedFaqs = false;
    this.errorMessage = 'Maaf, terdapat masalah semasa menghubungi pelayan. Sila cuba lagi.';
    this.lowConfidenceMessage = 'Sila hubungi helpdesk untuk pengesahan lanjut.';
    this.contactSupportUrl = 'https://example.com/support';
    this.contactSupportMessage = 'Hubungi Sokongan';
    this.messages = [];
    this.input = '';
    this.isLoading = false;
    this.isOpen = false;
  }

  private toggleWidget() {
    this.isOpen = !this.isOpen;
  }

  /**
   * Clear all chat messages and reset to welcome message
   * @public
   */
  public clearChat(): void {
    this.clearMessagesFromStorage();

    if (this.welcomeMessage) {
      const welcomeText = this.welcomeSubtitle
        ? `${this.welcomeMessage}\n\n${this.welcomeSubtitle}`
        : this.welcomeMessage;

      this.messages = [{
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: welcomeText,
      }];
    } else {
      this.messages = [];
    }
  }

  private lightenColor(hex: string, percent: number = 15): string {
    // Remove # if present
    hex = hex.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Lighten
    const newR = Math.min(255, Math.round(r + (255 - r) * (percent / 100)));
    const newG = Math.min(255, Math.round(g + (255 - g) * (percent / 100)));
    const newB = Math.min(255, Math.round(b + (255 - b) * (percent / 100)));

    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  private getStorageKey(): string {
    return `ai-chat-messages-${this.sessionId}`;
  }

  private saveMessagesToStorage(): void {
    try {
      const storageKey = this.getStorageKey();
      sessionStorage.setItem(storageKey, JSON.stringify(this.messages));
      // Store the current session ID to track session changes
      sessionStorage.setItem('ai-chat-last-session-id', this.sessionId);
    } catch (error) {
      console.warn('Failed to save messages to sessionStorage:', error);
    }
  }

  private loadMessagesFromStorage(): Message[] | null {
    try {
      // Check if session has changed
      const lastSessionId = sessionStorage.getItem('ai-chat-last-session-id');

      if (lastSessionId && lastSessionId !== this.sessionId) {
        // Session has changed, clear the old session's messages
        const oldStorageKey = `ai-chat-messages-${lastSessionId}`;
        sessionStorage.removeItem(oldStorageKey);
        sessionStorage.setItem('ai-chat-last-session-id', this.sessionId);
        return null; // Don't load any messages for new session
      }

      const storageKey = this.getStorageKey();
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved) as Message[];
      }
    } catch (error) {
      console.warn('Failed to load messages from sessionStorage:', error);
    }
    return null;
  }

  private clearMessagesFromStorage(): void {
    try {
      const storageKey = this.getStorageKey();
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear messages from sessionStorage:', error);
    }
  }

  private formatMessageContent(content: string): string {
    // Use markdown-it to parse markdown content
    // markdown-it automatically escapes HTML for security when html: false is set
    return md.render(content);
  }

  async connectedCallback() {
    super.connectedCallback();

    // Try to load messages from sessionStorage first
    const savedMessages = this.loadMessagesFromStorage();

    if (this.initialMessages && this.initialMessages.length > 0) {
      this.messages = [...this.initialMessages];
    } else if (savedMessages && savedMessages.length > 0) {
      // Restore saved messages from sessionStorage
      this.messages = savedMessages;
    } else {
      // Fetch initial suggested questions if URL is provided
      let suggestedQuestions: SuggestedQuestion[] | undefined = undefined;
      let fetchFailed = false;

      if (this.initialQuestionsUrl) {
        try {
          // Append language parameter to the URL
          let fetchUrl = this.initialQuestionsUrl;
          if (this.language) {
            const separator = fetchUrl.includes('?') ? '&' : '?';
            fetchUrl = `${fetchUrl}${separator}language=${this.language}`;
          }

          const response = await fetch(fetchUrl);
          if (response.ok) {
            const data = await response.json();

            // Support various response formats
            const questionsArray = data.questions || data.suggested_questions || data;

            // If array contains objects with question_text property, store full objects
            if (Array.isArray(questionsArray) && questionsArray.length > 0) {
              if (typeof questionsArray[0] === 'object' && questionsArray[0].question_text) {
                // Store full question objects with id and question_type
                suggestedQuestions = questionsArray.map((q: any) => ({
                  id: q.id,
                  question_type: q.question_type,
                  question_text: q.question_text,
                  category: q.category
                }));
              } else if (typeof questionsArray[0] === 'string') {
                // Legacy format: convert strings to objects
                suggestedQuestions = questionsArray.map((q: string) => ({
                  question_text: q
                }));
              }
            }
          } else {
            fetchFailed = true;
          }
        } catch (error) {
          console.warn('Failed to fetch initial questions:', error);
          fetchFailed = true;
        }
      }

      // If fetch failed, clear session storage
      if (fetchFailed) {
        this.clearMessagesFromStorage();
      }

      // Always show welcome message if available
      if (this.welcomeMessage) {
        // Add welcome message as initial assistant message
        const welcomeText = this.welcomeSubtitle
          ? `${this.welcomeMessage}\n\n${this.welcomeSubtitle}`
          : this.welcomeMessage;

        this.messages = [{
          id: 'welcome-' + Date.now(),
          role: 'assistant',
          content: welcomeText,
          suggestedQuestions: suggestedQuestions,
        }];
      }
    }
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('messages')) {
      this.scrollToBottom();
      // Save messages to sessionStorage whenever they change
      this.saveMessagesToStorage();
    }
  }

  private scrollToBottom() {
    // Use setTimeout to ensure Lit has finished rendering
    setTimeout(() => {
      // Find the last user message and scroll to it
      const userMessages = this.shadowRoot?.querySelectorAll('.message.user');
      if (userMessages && userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1] as HTMLElement;
        lastUserMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  /**
   * Normalize suggested questions - handles multiple formats:
   * - Objects with question_text (legacy format)
   * - Objects with Id/QuestionType (new API format - question_text will be fetched)
   * - String arrays (legacy format)
   */
  private normalizeSuggestedQuestions(questions: any): SuggestedQuestion[] | undefined {
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return undefined;
    }

    // If already objects with question_text, return as-is
    if (typeof questions[0] === 'object' && questions[0].question_text) {
      return questions as SuggestedQuestion[];
    }

    // If objects with Id/QuestionType (new API format), return as-is
    // The question_text will be fetched later
    if (typeof questions[0] === 'object' && (questions[0].Id || questions[0].id)) {
      return questions as SuggestedQuestion[];
    }

    // If strings, convert to SuggestedQuestion objects
    if (typeof questions[0] === 'string') {
      return questions.map((q: string) => ({
        question_text: q
      }));
    }

    return undefined;
  }

  private handleInput(e: Event) {
    this.input = (e.target as HTMLInputElement).value;
  }

  /**
   * Fetch question texts for suggested questions from the API
   * @param questions Array of suggested questions with Id and QuestionType
   * @returns Array of complete SuggestedQuestion objects with question_text
   */
  private async fetchQuestionTexts(questions: Array<{Id: string, QuestionType: string}>): Promise<SuggestedQuestion[]> {
    if (!questions || questions.length === 0) {
      return [];
    }

    // Extract base URL from initialQuestionsUrl or apiUrl
    let baseUrl = '';
    if (this.initialQuestionsUrl) {
      try {
        const urlObj = new URL(this.initialQuestionsUrl);
        baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      } catch {
        // Fallback to apiUrl if available
        if (this.apiUrl) {
          try {
            const urlObj = new URL(this.apiUrl);
            baseUrl = `${urlObj.protocol}//${urlObj.host}`;
          } catch {
            console.error('Failed to parse API URL');
            return [];
          }
        } else {
          return [];
        }
      }
    } else if (this.apiUrl) {
      try {
        const urlObj = new URL(this.apiUrl);
        baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      } catch {
        console.error('Failed to parse API URL');
        return [];
      }
    } else {
      return [];
    }

    // Fetch all question texts in parallel
    const fetchPromises = questions.map(async (q) => {
      try {
        const url = `${baseUrl}/api/questions/${q.Id}?question_type=${q.QuestionType}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          console.warn(`Failed to fetch question ${q.Id}:`, response.status);
          return null;
        }

        const data = await response.json();

        // Extract question text from the response
        let questionText = '';
        if (data && typeof data === 'object') {
          if (data.question && data.question.question_text) {
            questionText = data.question.question_text;
          } else if (data.question_text) {
            questionText = data.question_text;
          }
        }

        if (!questionText) {
          console.warn(`No question text found for question ${q.Id}`);
          return null;
        }

        return {
          Id: q.Id,
          QuestionType: q.QuestionType,
          question_text: questionText,
        } as SuggestedQuestion;
      } catch (error) {
        console.error(`Error fetching question ${q.Id}:`, error);
        return null;
      }
    });

    const results = await Promise.all(fetchPromises);
    // Filter out null results (failed fetches)
    return results.filter((q): q is SuggestedQuestion => q !== null);
  }

  private async handleFAQClick(question: SuggestedQuestion) {
    if (this.isLoading) return;

    // Check if this is a suggested question with ID (new format with capitalized fields or old format)
    if ((question.Id && question.QuestionType) || (question.id && question.question_type)) {
      // Call the new API endpoint for suggested questions
      await this.handleSuggestedQuestionClick(question);
    } else {
      // Legacy behavior: Set the input and trigger submit
      this.input = question.question_text;

      // Create a synthetic submit event
      const submitEvent = new Event('submit', { cancelable: true });
      this.handleSubmit(submitEvent);
    }
  }

  private async handleSuggestedQuestionClick(question: SuggestedQuestion) {
    // Support both new format (Id, QuestionType) and old format (id, question_type)
    const questionId = question.Id || question.id;
    const questionType = question.QuestionType || question.question_type;

    if (!questionId || !questionType) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question.question_text,
    };

    this.messages = [...this.messages, userMessage];
    this.isLoading = true;

    // Dispatch message-sent event
    this.dispatchEvent(new CustomEvent('message-sent', {
      detail: userMessage,
      bubbles: true,
      composed: true,
    }));

    try {
      // Call the new endpoint: /api/questions/{id}?question_type={question_type}
      // Extract base URL from initialQuestionsUrl (e.g., "http://example.com:8080/api/questions/first-launch" -> "http://example.com:8080")
      let baseUrl = '';
      if (this.initialQuestionsUrl) {
        try {
          const urlObj = new URL(this.initialQuestionsUrl);
          baseUrl = `${urlObj.protocol}//${urlObj.host}`;
        } catch {
          // Fallback if URL parsing fails
          baseUrl = 'http://43.217.183.120:8080';
        }
      } else {
        baseUrl = 'http://43.217.183.120:8080';
      }

      const url = `${baseUrl}/api/questions/${questionId}?question_type=${questionType}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      // Extract response text from the API response
      let responseText = 'No response from agent';
      let suggestedQuestions: SuggestedQuestion[] | undefined = undefined;

      if (data && typeof data === 'object') {
        // The API returns { question: { answer_text: "...", ... }, related_questions: [...] }
        if (data.question && data.question.answer_text) {
          responseText = data.question.answer_text;
        }

        // Convert related_questions to SuggestedQuestion format
        if (data.related_questions && Array.isArray(data.related_questions) && data.related_questions.length > 0) {
          if (typeof data.related_questions[0] === 'object' && data.related_questions[0].question_text) {
            suggestedQuestions = data.related_questions.map((q: any) => ({
              id: q.id,
              question_type: q.question_type,
              question_text: q.question_text,
              category: q.category
            }));
          }
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        suggestedQuestions: suggestedQuestions,
      };

      this.messages = [...this.messages, assistantMessage];

      // Dispatch response-received event
      this.dispatchEvent(new CustomEvent('response-received', {
        detail: assistantMessage,
        bubbles: true,
        composed: true,
      }));
    } catch (err) {
      console.error('Suggested question API failed:', err);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: this.errorMessage,
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

      // Extract the response text, FAQs, suggested questions, and confidence
      let responseText = 'No response from agent';
      let faqs: FAQ[] | undefined = undefined;
      let suggestedQuestions: SuggestedQuestion[] | undefined = undefined;
      let confidence: Confidence | undefined = undefined;

      if (data && typeof data === 'object' && data.response && typeof data.response === 'string') {
        // Check if data.response contains stringified JSON
        const trimmedResponse = data.response.trim();
        if (trimmedResponse.startsWith('{') || trimmedResponse.startsWith('[')) {
          try {
            // First attempt: standard JSON.parse
            const innerData = JSON.parse(data.response);

            if (innerData && innerData.response && typeof innerData.response === 'string') {
              responseText = innerData.response;
              faqs = innerData.faq_used || innerData.faqs_used || undefined;
              suggestedQuestions = this.normalizeSuggestedQuestions(innerData.suggested_follow_ups || innerData.suggested_questions);
              confidence = innerData.confident || innerData.confidence || 'true';
            } else {
              responseText = data.response;
              faqs = data.faq_used || data.faqs_used || undefined;
              suggestedQuestions = this.normalizeSuggestedQuestions(data.suggested_follow_ups || data.suggested_questions);
              confidence = data.confident || data.confidence || undefined;
            }
          } catch (parseError) {
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
            } else {
              responseText = 'Error: Could not parse response';
            }

            // Extract FAQs array (support both faq_used and faqs_used)
            const faqsPattern = /"(?:faq_used|faqs_used)"\s*:\s*(\[[^\]]*\])/s;
            const faqsMatch = data.response.match(faqsPattern);

            if (faqsMatch) {
              try {
                faqs = JSON.parse(faqsMatch[1]);
              } catch {
                // FAQs might span multiple lines
                const faqsMultiPattern = /"(?:faq_used|faqs_used)"\s*:\s*(\[[\s\S]*?\n\s*\])/;
                const faqsMultiMatch = data.response.match(faqsMultiPattern);
                if (faqsMultiMatch) {
                  try {
                    faqs = JSON.parse(faqsMultiMatch[1]);
                  } catch {
                    faqs = undefined;
                  }
                }
              }
            }

            // Extract suggested questions array
            const suggestedPattern = /"(?:suggested_follow_ups|suggested_questions)"\s*:\s*(\[[^\]]*\])/s;
            const suggestedMatch = data.response.match(suggestedPattern);

            if (suggestedMatch) {
              try {
                const parsedQuestions = JSON.parse(suggestedMatch[1]);
                suggestedQuestions = this.normalizeSuggestedQuestions(parsedQuestions);
              } catch {
                const suggestedMultiPattern = /"(?:suggested_follow_ups|suggested_questions)"\s*:\s*(\[[\s\S]*?\n\s*\])/;
                const suggestedMultiMatch = data.response.match(suggestedMultiPattern);
                if (suggestedMultiMatch) {
                  try {
                    const parsedQuestions = JSON.parse(suggestedMultiMatch[1]);
                    suggestedQuestions = this.normalizeSuggestedQuestions(parsedQuestions);
                  } catch {
                    suggestedQuestions = undefined;
                  }
                }
              }
            }
          }
        } else {
          // Not JSON, direct text response - this is the NEW API format
          responseText = data.response;
          faqs = data.faq_used || data.faqs_used || undefined;
          suggestedQuestions = this.normalizeSuggestedQuestions(data.suggested_follow_ups || data.suggested_questions);
          confidence = data.confident || data.confidence || undefined;
        }
      } else if (typeof data === 'string') {
        responseText = data;
      } else if (data && typeof data === 'object') {
        // Fallback for other formats
        responseText = data.message || data.answer || 'Error: Unexpected response format';
        faqs = data.faq_used || data.faqs_used || undefined;
        suggestedQuestions = this.normalizeSuggestedQuestions(data.suggested_follow_ups || data.suggested_questions);
        confidence = data.confident || data.confidence || undefined;
      }

      // Handle new suggested_questions format: if questions have Id/QuestionType but no question_text, fetch them
      if (suggestedQuestions && suggestedQuestions.length > 0) {
        const questionsNeedingText = suggestedQuestions.filter(q =>
          (q.Id || q.id) && (q.QuestionType || q.question_type) && !q.question_text
        );

        if (questionsNeedingText.length > 0) {
          // Convert to the format expected by fetchQuestionTexts
          const questionsToFetch = questionsNeedingText.map(q => ({
            Id: (q.Id || q.id?.toString()) as string,
            QuestionType: (q.QuestionType || q.question_type) as string
          }));

          // Fetch question texts
          const fetchedQuestions = await this.fetchQuestionTexts(questionsToFetch);

          // Replace the questions without text with the fetched ones
          suggestedQuestions = [
            ...suggestedQuestions.filter(q => q.question_text), // Keep questions that already have text
            ...fetchedQuestions // Add newly fetched questions
          ];
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        faqs: faqs,
        suggestedQuestions: suggestedQuestions,
        confidence: confidence,
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
        content: this.errorMessage,
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
    const primaryColorLight = this.lightenColor(this.primaryColor, 15);

    return html`
      <!-- Header -->
      <div class="header" style="--primary-color: ${this.primaryColor}; --primary-color-light: ${primaryColorLight}; --primary-color-hover: ${this.primaryColorHover};">
        <div class="header-content">
          <div class="header-avatar">
            ${this.botAvatarUrl
              ? html`<img src="${this.botAvatarUrl}" alt="Bot" class="header-avatar-image" />`
              : html`<svg viewBox="0 0 24 24" fill="none" stroke="${this.primaryColor}" stroke-width="2" style="width: 1.5rem; height: 1.5rem;">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>`}
          </div>
          <h1 class="title">${this.chatTitle}</h1>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="messages-area" style="--user-message-bg: ${this.userMessageBg}; --bot-message-bg: ${this.botMessageBg}; --primary-color: ${this.primaryColor}; --primary-color-light: ${primaryColorLight}; --primary-color-hover: ${this.primaryColorHover}; ${this.backgroundImageUrl ? `--background-image-url: url('${this.backgroundImageUrl}');` : ''}">
        <div class="messages-container">
          ${repeat(this.messages, (msg) => msg.id, (msg) => html`
            <div>
              <div
                class=${classMap({
                  message: true,
                  user: msg.role === 'user',
                  assistant: msg.role === 'assistant'
                })}
              >
                ${msg.role === 'assistant' ? html`
                  <div class="avatar">
                    ${this.botAvatarUrl
                      ? html`<img src="${this.botAvatarUrl}" alt="AI" class="avatar-image" />`
                      : 'AI'}
                  </div>
                ` : ''}
                <div class="message-content">
                  <div class="message-text">${unsafeHTML(this.formatMessageContent(msg.content))}</div>
                  ${msg.role === 'assistant' && this.showRelatedFaqs && msg.faqs && msg.faqs.length > 0 ? html`
                    <div class="faq-section">
                      <p class="faq-title">Related FAQs:</p>
                      <ul class="faq-list">
                        ${msg.faqs.map(faq => html`
                          <li class="faq-item-static">
                            ${faq.Question}
                          </li>
                        `)}
                      </ul>
                    </div>
                  ` : ''}
                  ${msg.role === 'assistant' && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 ? html`
                    <div class="faq-section">
                      <p class="faq-title">Cadangan Soalan:</p>
                      <ul class="faq-list">
                        ${msg.suggestedQuestions.map(question => html`
                          <li class="faq-item" @click=${() => this.handleFAQClick(question)}>
                            ${question.question_text}
                          </li>
                        `)}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              </div>
              ${msg.role === 'assistant' && msg.confidence && !msg.confidence.is_confident ? html`
                <div class="contact-support-wrapper">
                  <a
                    href="${this.contactSupportUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="contact-support-button"
                    style="--primary-color: ${this.primaryColor}; --primary-color-hover: ${this.primaryColorHover};"
                  >
                    ${this.contactSupportMessage}
                  </a>
                </div>
              ` : ''}
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
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area" style="--primary-color: ${this.primaryColor}; --primary-color-hover: ${this.primaryColorHover};">
        <form class="input-form" @submit=${this.handleSubmit}>
          <input
            type="text"
            class="input-field"
            placeholder="Taip mesej anda..."
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

    `;
  }

  render() {
    const primaryColorLight = this.lightenColor(this.primaryColor, 15);

    if (this.mode === 'widget') {
      return html`
        <div class="widget-container">
          <!-- Chat Window -->
          <div
            class=${classMap({ 'widget-window': true, 'open': this.isOpen })}
            style="--widget-width: ${this.widgetWidth}; --widget-height: ${this.widgetHeight};"
          >
            ${this.renderChatUI()}
          </div>

          <!-- Toggle Button -->
          <button
            class=${classMap({
              'widget-button': true,
              'widget-button-no-bg': !this.isOpen && !!this.widgetIconUrl
            })}
            style="--primary-color: ${this.primaryColor}; --primary-color-light: ${primaryColorLight};"
            @click=${this.toggleWidget}
            aria-label=${this.isOpen ? 'Close chat' : 'Open chat'}
          >
            ${this.isOpen ? html`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ` : this.widgetIconUrl ? html`
              <img src="${this.widgetIconUrl}" alt="Chat" class="widget-button-icon" />
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
