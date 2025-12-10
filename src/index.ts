// Export Web Component
export { AIChat } from './components/ai-chat';
export type { Message, FAQ } from './components/ai-chat';

// Auto-register the custom element when imported
import './components/ai-chat';
