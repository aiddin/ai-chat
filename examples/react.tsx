// React Example
import { useEffect, useRef } from 'react';
import '@a.izzuddin/ai-chat';
import type { Message } from '@a.izzuddin/ai-chat';

function App() {
  const chatRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;

    const handleMessageSent = (e: Event) => {
      const customEvent = e as CustomEvent<Message>;
      console.log('Message sent:', customEvent.detail);
    };

    const handleResponseReceived = (e: Event) => {
      const customEvent = e as CustomEvent<Message>;
      console.log('Response received:', customEvent.detail);
    };

    const handleError = (e: Event) => {
      const customEvent = e as CustomEvent<Error>;
      console.error('Error:', customEvent.detail);
    };

    chat.addEventListener('message-sent', handleMessageSent);
    chat.addEventListener('response-received', handleResponseReceived);
    chat.addEventListener('error', handleError);

    return () => {
      chat.removeEventListener('message-sent', handleMessageSent);
      chat.removeEventListener('response-received', handleResponseReceived);
      chat.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ai-chat
      ref={chatRef}
      api-url={process.env.REACT_APP_API_URL}
      session-id="user-123"
      title="AI Assistant"
      theme="light"
    />
  );
}

export default App;
