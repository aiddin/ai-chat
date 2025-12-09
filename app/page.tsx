// app/page.tsx - Demo of Web Component
"use client";

import { useEffect, useRef } from "react";
import "@/src/components/ai-chat";

export default function Home() {
  const chatRef = useRef<any>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#f5f5f5' }}>
      <h1 style={{ marginBottom: '1rem' }}>AI Chat Widget Demo</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Click the chat button in the bottom-right corner to open the widget!
      </p>

      <ai-chat
        ref={chatRef}
        api-url={apiUrl}
        session-id="demo-session"
        title="AI Assistant"
        theme="light"
        mode="widget"
        bot-avatar-url="/assets/chat-bot-icon.png"
        background-image-url="/assets/chat-bot-bg.png"
        primary-color="#3681D3"
        primary-color-hover="#3457C7"
        user-message-bg="#D6E4FF"
        bot-message-bg="#F5F5F5"
      />
    </div>
  );
}