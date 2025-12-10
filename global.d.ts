// Type declarations for ai-chat custom element
declare namespace JSX {
  interface IntrinsicElements {
    'ai-chat': {
      ref?: any;
      'api-url'?: string;
      'session-id'?: string;
      title?: string;
      theme?: 'light' | 'dark';
      mode?: 'fullscreen' | 'widget';
      'widget-width'?: string;
      'widget-height'?: string;
      'primary-color'?: string;
      'primary-color-hover'?: string;
      'user-message-bg'?: string;
      'bot-message-bg'?: string;
      'bot-avatar-url'?: string;
      'background-image-url'?: string;
      'welcome-message'?: string;
      'welcome-subtitle'?: string;
      children?: React.ReactNode;
    };
  }
}
