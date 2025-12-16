// Export Web Component
export { AIChat } from './components/ai-chat';
export type { Message } from './components/ai-chat';
// export type { FAQ } from './components/ai-chat';  // Commented out - FAQ functionality disabled

// Auto-register the custom element when imported
import './components/ai-chat';
